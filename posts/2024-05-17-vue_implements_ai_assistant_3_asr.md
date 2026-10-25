---
title: vue实现AI问答小助手(3)——实现录音和语音转文字
categories:
  - 学习笔记
tags:
  - vueuse
  - vue3
  - WebRTC
  - ASR
date: '2024-05-16 20:52:43'
---

由于操作模式是类似微信的按下录音松开发送，所以转换文字就不需要像文字转语音那样流式了。

大致流程如下：

1. 按下语音按钮开始录音：调用浏览器api申请麦克风权限，获取音频流。使用Recorder配置录音码流并对音频流进行录制。
2. 松开按钮后结束录音：结束麦克风拾音关闭音频流，关闭录制，并获得录音blob文件。
3. 调用阿里云的接口将blob文件转换成文字(这里与微信场景不同，服务器不负责处理语音)。
4. 将文字发送到服务器，等效于输入文字并发送。

经过初步调研，录音使用了基于WebRTC的工具库[`RecordRTC`](https://github.com/muaz-khan/RecordRTC)。

其中，获取音频流的方法，也使用的是vueuse提供的[`useUserMedia`](https://vueuse.org/core/useUserMedia/)。

虽然这两个自己从头实现也不算复杂，但能用轮子就坚决不重新造。

录音的组合式函数完整代码如下：

```ts
import { RecordRTCPromisesHandler, StereoAudioRecorder } from 'recordrtc'

export interface RecoderOptions {
  onData?: (blob: Blob) => void
}

export function useAudioRecorder(options?: RecoderOptions) {
  let recorder: RecordRTCPromisesHandler | undefined
  const result = ref<Blob>()
  const startTime = ref<Date>()
  const duration = ref<number>(0)
  let timer: any
  const { stream, start: streamStart, stop: streamStop, enabled: recording } = useUserMedia({
    constraints: {
      audio: {
        echoCancellation: true,
      },
    },
  })

  onUnmounted(() => {
    stop(true)
  })

  async function start(maxDuration = 1000 * 60) {
    if (recording.value) {
      return
    }
    try {
      await streamStart()
    }
    catch (e) {
      // 用户拒绝
      console.error(e)
      dialog.toast({ message: '请允许访问麦克风', type: DIALOG.WARNING })
      recorder = undefined
      throw e
    }
    if (!stream.value) {
      return
    }
    recorder = new RecordRTCPromisesHandler(stream.value, {
      type: 'audio',
      recorderType: StereoAudioRecorder,
      mimeType: 'audio/wav',
      // sampleRate: 16000, // 不能选这个
      desiredSampRate: 16000,
      numberOfAudioChannels: 1,
    })
    startTime.value = new Date()
    await recorder.startRecording()
    timer = setTimeout(() => {
      stop()
    }, maxDuration)
    return recorder
  }

  async function stop(cancel = false) {
    clearTimeout(timer)
    if (recorder && stream.value) {
      await recorder.stopRecording()
      streamStop()
      if (!cancel) {
        result.value = await recorder.getBlob()
        duration.value = new Date().getTime() - startTime.value!.getTime()
        if (options?.onData) {
          options.onData(result.value!)
        }
        return result.value
      }
    }
  }

  return {
    start,
    stop,
    result,
    recording,
    duration,
    stream,
  }
}

```

获取到blob文件后，下一步就是将音频二进制流转换为文本。

ASR(Automatic-speech-recognition)语音转文字使用的是阿里云的服务，文档地址：

https://help.aliyun.com/zh/isi/developer-reference/restful-api-2

这个接口调用比较简单，这边是后台做了转发，在后台拼接了token等参数，前端直接调用即可。

前端基于axios做了一些封装，简单示例如下：

```ts
  asr: async (data: Blob): Promise<any> => {
    const file = new File([data], 'message.wav')
    return await aliApi.upload({
      url: 'nls/asr',
      method: 'post',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      data: {
        file,
      },
    })
  }
```
