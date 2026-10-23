---
title: vue实现AI问答小助手(2)——流式TTS文字转语音
categories:
  - 学习笔记
tags:
  - vueuse
  - vue3
  - socket
  - tts
date: '2024-05-16 20:52:43'
---

TTS(Text-to-speech)文字转语音使用的是阿里云的服务，文档地址：

https://help.aliyun.com/zh/isi/developer-reference/streaming-text-tts-wss

文档只给出了一些配置项的说明，以及java端的代码示例，但没有web端的。所以这篇笔记可以给web开发者参考。

---

首先，AI答复的消息是通过SSE([server-sent events](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events/Using_server-sent_events))返回的。SSE请求的实现流程后续有时间再填坑。

代码实现中，使用了一个onReply回调来执行后续动作。 这个方法会连续多次执行，直到消息结束。

SSE是单向的，只能由服务端向客户端推送，而流式TTS这种双向通信需要通过socket来实现。

socket的实现，原本是打算用封装了心跳、房间等概念的`socket.io`，但后来发现这个功能实现并不需要用到保活和长连接，发送和接收都完成以后，直接关闭socket连接即可，不用考虑那些复杂逻辑。

所以socket的连接可以直接使用`vueuse`的工具方法[`useWebSocket`](https://vueuse.org/core/useWebSocket)

业务流程大致如下：

1. 若尚未初始化，则从后台获取临时token，用于与阿里云服务建立socket连接
2. 若socket尚未连接，则建立socket连接，并完成握手
3. 若音频流尚未初始化，则初始化音频流
4. 向socket发送文本
5. 接收语音二进制Blob文件，有序推入音频流进行播放

### 与阿里云服务建立socket连接

详细文档详见开头[链接](https://help.aliyun.com/zh/isi/developer-reference/streaming-text-tts-wss)，这里只提一下要点。

- 获取到的临时token等信息，是以URL参数的形式拼接到socket请求URL中，例如`wss://nls-gateway.aliyuncs.com/ws/v1?token=123&appKey=abc`
- 超时时间为5秒，若超过5秒没有发送任何内容，连接会断开。
- message_id使用的字符串限制为16进制字符，因此使用`nanoid`时需要自定义规则，避免传递`-`和`_`。
- 服务器返回的内容分为JSON字符串格式的事件和二进制格式的音频数据。可以通过`typeof event.data === 'string'`来判断返回内容是事件还是数据。
- 连接成功后，需要先发送`StartSynthesis`命令，并等待服务器返回`SynthesisStarted`，才能发送`RunSynthesis`进行语音合成，否则服务器会返回状态不正确的错误信息。
- 文本内容发送完毕后，必须发送`StopSynthesis`命令，否则服务器不会返回`SynthesisCompleted`命令，也就无法得知二进制文件是否已经全部收到。

### 播放流式音频

播放流式音频使用的是[`MediaSource`](https://developer.mozilla.org/en-US/docs/Web/API/MediaSource)和[`SourceBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer)。

Blob对象与MediaSource都可以使用`URL.revokeObjectURL`来转换为本地URL，然后赋值给Audio对象的src属性。

因此，只要先实例化一个`MediaSource`对象，等到播放时再往里面插入`SourceBuffer`并有序推送Blob文件，就可以复用之前实现的语音播放器`useAudioPlayer`了。

要注意的是MediaSource支持的音频格式有限制，比如配置到TTS服务的返回格式是mp3，添加`SourceBuffer`时必须指定`mimeType`为`audio/mpeg`，而不是`audio/mp3`。


完整代码如下：

```ts
import { customAlphabet } from 'nanoid'
import dayjs from 'dayjs'

const nanoid = customAlphabet('0123456789abcdef', 32)

// 以下是阿里云流式TTS的请求与返回内容的定义
interface TTSRequestHeader {
  appkey: string
  message_id: string
  task_id: string
  namespace: 'FlowingSpeechSynthesizer'
  name: 'StartSynthesis' | 'StopSynthesis' | 'RunSynthesis'
}
interface TTSResponseHeader {
  message_id: string
  task_id: string
  namespace: 'FlowingSpeechSynthesizer' | 'Default'
  name: 'SynthesisStarted' | 'SentenceBegin' | 'SentenceEnd' | 'SynthesisCompleted' | 'TaskFailed'
  status: number // 20000000 success
  status_message: string
}

interface StartSynthesisRequest {
  header: TTSRequestHeader & { name: 'StartSynthesis' }
  payload: {
    voice?: string
    format?: 'pcm' | 'mp3' | 'wav'
    sample_rate?: number
    volume?: number
    speech_rate?: number
    pitch_rate?: number
    enable_subtitle?: boolean
    enable_phoneme_timestamp?: boolean
  }
}
interface RunSynthesisRequest {
  header: TTSRequestHeader & { name: 'RunSynthesis' }
  payload: {
    text: string
  }
}
interface StopSynthesisRequest {
  header: TTSRequestHeader & { name: 'StopSynthesis' }
}

interface StartSynthesisResponse {
  header: TTSResponseHeader & { name: 'SynthesisStarted' }
  payload: {
    session_id: string
  }
}
// 服务端检测到了一句话的开始
interface SentenceBeginResponse {
  header: TTSResponseHeader & { name: 'SentenceBegin' }
  payload: {
    index: number
  }
}
// 有新的合成结果返回，包含最新的音频和时间戳，句内全量，句间增量
interface SentenceSynthesisResponse {
  header: TTSResponseHeader & { name: 'SentenceSynthesis' }
  payload: {
    subtitles: {
      text: string
      sentence: boolean
      begin_index: number
      end_index: number
      begin_time: number
      end_time: number
      phoneme_list: {
        index: number
        begin_time: number
        end_time: number
        phoneme: string
        tone: string
      }[]
    }[]
  }
}
// 服务端检测到了一句话的结束，返回该句的全量时间戳
interface SentenceEndResponse {
  header: TTSResponseHeader & { name: 'SentenceEnd' }
  payload: {
    subtitles: {
      text: string
      sentence: boolean
      begin_index: number
      end_index: number
      begin_time: number
      end_time: number
      phoneme_list: {
        index: number
        begin_time: number
        end_time: number
        phoneme: string
        tone: string
      }[]
    }[]
  }
}
// 服务端已停止了语音转写
interface SynthesisCompletedResponse {
  header: TTSResponseHeader & { name: 'SynthesisCompleted' }
}

const baseUrl = `wss://nls-gateway.aliyuncs.com/ws/v1`
const url = ref(new URL(baseUrl))

export function useStreamPlayer() {
  // 收到完整所有语音数据时
  const received = createEventHook<any>()
  // 播放结束时
  const played = createEventHook<any>()
  let initPromise: Promise<void> | null // 初始化动作，获取token等信息
  let connectPromise: Promise<void> | null // 流式通讯准备，创建socket连接并握手
  let mediaPromise: Promise<void> | null // 音频播放准备，创建音频流
  let mediaSource: MediaSource | null = null
  let sourceBuffer: SourceBuffer | null = null
  let blobQueue: Blob[]
  let blobCache: Blob[] // 缓存已返回的blob数组，下次点击播放时不用再重新请求
  let lock = false
  const { playing, ended, play, stop: playerStop } = useAudioPlayer()

  // 从队列中取出语音数据
  async function fetchBuffer() {
    if (lock) {
      return
    }
    if (!sourceBuffer) {
      return
    }
    if (!blobQueue.length) {
      return
    }
    if (sourceBuffer.updating) {
      return
    }
    lock = true
    const blob = blobQueue.shift()
    if (blob) {
      const buffer = await blob.arrayBuffer()
      sourceBuffer.appendBuffer(buffer)
    }
    lock = false
  }

  // header模板
  const headerTemplate = {
    appkey: '',
    message_id: '',
    task_id: '',
    namespace: 'FlowingSpeechSynthesizer',
    name: 'StartSynthesis',
  }

  const { open: socketOpen, close: socketClose, send: socketSend, status, data } = useWebSocket(url, {
    immediate: false, // 先创建组合式函数，但不要马上连接，因为此时token还没获取
    onError(ws, event) {
      console.log('WebSocket error:', event)
    },
    onMessage(ws, event) {
      // 返回内容是二进制或者JSON
      if (typeof event.data === 'string') {
        const response = JSON.parse(event.data)
        const { name } = response.header
        switch (name) {
          case 'SynthesisStarted':
            onSynthesisStarted(response as StartSynthesisResponse)
            break
          case 'SentenceBegin':
            onSentenceBegin(response as SentenceBeginResponse)
            break
          case 'SentenceSynthesis':
            onSentenceSynthesis(response as SentenceSynthesisResponse)
            break
          case 'SentenceEnd':
            onSentenceEnd(response as SentenceEndResponse)
            break
          case 'SynthesisCompleted':
            onSynthesisCompleted(response as SynthesisCompletedResponse)
        }
      }
      else {
        blobQueue.push(event.data)
        blobCache.push(event.data)
        fetchBuffer()
      }
    },
  })

  function onSynthesisStarted(response: StartSynthesisResponse) {
    // 已在初始化时处理
  }
  function onSentenceBegin(response: SentenceBeginResponse) {
    // 无需处理
  }
  function onSentenceSynthesis(response: SentenceSynthesisResponse) {
    // 无需处理
  }
  function onSentenceEnd(response: SentenceEndResponse) {
    // 无需处理
  }
  function onSynthesisCompleted(response: SynthesisCompletedResponse) {
    // 流式TTS处理完毕，断开socket，播放还将继续
    socketClose()
    const blob = new Blob(blobCache, { type: 'audio/mpeg' })
    received.trigger(blob)
  }

  async function init() {
    const { appKey, token, expireTime } = await service.message.token()
    // querystring与qs等工具库都不再推荐使用，直接使用URL对象的searchParams属性定义即可
    url.value.searchParams.set('appKey', appKey)
    url.value.searchParams.set('token', token)
    headerTemplate.appkey = appKey
    const expireDelay = (expireTime - dayjs().unix())
    console.log(`token已获取，${expireDelay}秒(${dayjs.unix(expireTime).format(DATE.FULL_DATE_TIME)})后过期 `)
    // 创建过期任务
    setTimeout(() => {
      initPromise = null
    }, expireDelay * 1000)
  }

  function open(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 创建新任务
      headerTemplate.task_id = nanoid(32)
      socketOpen()
      // 创建连接后，发送开始指令
      const request = {
        header: { ...headerTemplate, name: 'StartSynthesis', message_id: nanoid() },
        payload: {
          voice: 'siyue',
          format: 'mp3',
          sample_rate: 16000,
        },
      } as StartSynthesisRequest
      socketSend(JSON.stringify(request))
      const unwatch = watchOnce(data, (val) => {
        const response = JSON.parse(val)
        const { name, status, status_message } = response.header as TTSResponseHeader
        if (status !== 20000000) {
          reject(new Error(status_message))
        }
        else if (name === 'SynthesisStarted') {
          console.log('语音合成已启动')
          unwatch()
          resolve()
        }
      })
    })
  }

  function createStream(): Promise<void> {
    return new Promise((resolve, reject) => {
      blobQueue = []
      blobCache = []
      mediaSource = new MediaSource()
      mediaSource.addEventListener('sourceopen', () => {
        sourceBuffer = mediaSource!.addSourceBuffer('audio/mpeg')
        sourceBuffer.addEventListener('updateend', fetchBuffer)
        resolve()
      })
      play(mediaSource).then(() => {
        const unwatch = watch(playing, (val) => {
          if (!val) {
            // 播放完毕
            console.log('播放完毕')
            played.trigger()
            unwatch()
            reset()
          }
        })
      })
    })
  }

  async function send(text: string, end = false) {
    if (!initPromise) {
      initPromise = init()
    }
    await initPromise
    if (!connectPromise) {
      connectPromise = open()
    }
    await connectPromise
    if (!mediaPromise) {
      mediaPromise = createStream()
    }
    await mediaPromise
    if (end) {
      // 语音发送完毕，发出指令停止合成，只有发出停止命令，才能收到completed回调
      const request = {
        header: { ...headerTemplate, name: 'StopSynthesis', message_id: nanoid() },
      } as StopSynthesisRequest
      socketSend(JSON.stringify(request))
    }
    else {
      const request = {
        header: { ...headerTemplate, name: 'RunSynthesis', message_id: nanoid() },
        payload: { text },
      } as RunSynthesisRequest
      socketSend(JSON.stringify(request))
    }
  }

  function stop() {
    playerStop()
    socketClose()
    reset()
  }

  function reset() {
    connectPromise = null
    mediaPromise = null
  }

  return {
    status,
    send,
    data,
    onData: received.on,
    onPlayEnd: played.on,
    playing,
    ended,
    stop,
  }
}

```


使用方式与player非常相似。

发送问题前，初始化相关回调：

```ts
answer.playing = true
streamPlayer.onPlayEnd(() => {
  answer.playing = false
})
streamPlayer.onData((res: Blob) => {
  readBlobMap.set(answer.id, res) // 写入缓存
})
```

在onReply方法中：
```ts
if (data.choices[0].finish_reason) {
  // 不为空就表示消息传输已结束
  answer.receiving = false
  scrollToBottom()
  receiving.value = false
  if (chatApp.ttsEnabled) {
    streamPlayer.send('', true)
  }
}
else {
  answer.content += data.choices[0].delta.content
  scrollToBottomThrottle()
  if (chatApp.ttsEnabled) {
    if (data.choices[0].delta.content) {
      streamPlayer.send(data.choices[0].delta.content)
    }
  }
}
```
