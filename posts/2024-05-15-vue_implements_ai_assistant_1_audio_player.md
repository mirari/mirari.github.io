---
title: vue实现AI问答小助手(1)——播放语音
categories:
  - 学习笔记
tags:
  - vueuse
  - vue3
  - socket
  - tts
date: '2024-05-15 22:02:19'
---

项目需要开发一个类似微信操作体验的AI问答小助手，记录下开发过程。

先从最简单的功能说起。

第一步是实现语音播放功能，也就是将从TTS(Text-to-speech)文字转语音服务中获取到的二进制语音文件播放出来。

项目使用vite+vue3+typescript搭建，基于vitesse脚手架，且尽可能使用了vueuse的工具库。

因此实现这样一个语音播放器，也会尽可能利用vueuse和使用组合式函数风格。

---

首先遇到的第一个坑，是浏览器的策略限制禁止自动播放。

详情可见[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/Media/Autoplay_guide#%E6%96%B9%E6%B3%95%E4%B8%80%EF%BC%9A%E5%85%B3%E9%97%AD%

音频的播放行为必须来自用户操作。

在产品的业务流程中，用户会先按住底部语音按钮，并在松开时发送用户语音消息。然后AI进行回复，同时播放语音。

因此，我们的使用场景理论上是满足自动播放的条件的。

只是在微信等浏览器环境下，存在一些更严格的策略限制，比如用户操作大约5秒以后才创建出来的Audio元素仍然无法自动播放。

所以，最终的实现思路如下：

1. 页面初始化时就创建一个audio元素，并设置其src为一段无声的音频。
2. 当用户进行任意符合策略的操作时，执行play动作。
3. 当AI回复消息或者需要播放消息语音时，重新设置audio元素的src为新的语音文件，并执行play操作。

这样始终使用同一个audio元素，就避免了微信内置浏览器下的限制。

---

然后实现一个播放器的组合式函数，提供play、stop方法，并暴露playing等状态。

完整代码如下：

```ts
function createEmptyAudioBlob() {
  const sampleRate = 44100 // 采样率
  const seconds = 1 // 音频长度，单位：秒
  const numSamples = sampleRate * seconds // 总的采样数量
  const numChannels = 2 // 声道数量
  const bytesPerSample = 2 // 每个采样的字节数
  const blockAlign = numChannels * bytesPerSample // 每个采样块的字节数
  const byteRate = sampleRate * blockAlign // 每秒的字节数
  const dataSize = numSamples * blockAlign // 数据部分的大小
  const buffer = new ArrayBuffer(44 + dataSize) // WAV 文件的总大小
  const view = new DataView(buffer)

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  // RIFF 头
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(8, 'WAVE')

  // fmt 子块
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 8 * bytesPerSample, true)

  // data 子块
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)

  // 数据部分（静音）
  for (let i = 44; i < dataSize; i++) {
    view.setInt16(i, 0, true)
  }

  return new Blob([buffer], { type: 'audio/wav' })
}
// 创建一个可以在Audio对象中使用的URL
const audioUrl = ref(URL.createObjectURL(createEmptyAudioBlob()))
// 创建一个Audio对象
const audioRef = ref(new Audio())
audioRef.value.autoplay = false
audioRef.value.src = audioUrl.value
let inited = false
function init(e: MouseEvent | TouchEvent | KeyboardEvent) {
  if (!inited) {
    // 避免在无用户交互时无法播放音频
    console.log('audio初始化播放', e.type)
    audioRef.value.play()
    audioRef.value.pause()
    inited = true
    document.removeEventListener('click', init)
    document.removeEventListener('touchend', init)
    document.removeEventListener('keydown', init)
  }
}
document.addEventListener('click', init)
document.addEventListener('touchend', init)
document.addEventListener('keydown', init)

// 创建响应式控制器
const { playing, duration, ended } = useMediaControls(audioRef, {
  // src: audioUrl,
})

export function useAudioPlayer() {
  const play = async (data: Blob | MediaSource) => {
    audioRef.value.pause()
    if (audioUrl.value) {
      URL.revokeObjectURL(audioUrl.value)
    }
    audioUrl.value = URL.createObjectURL(data)
    audioRef.value.src = audioUrl.value
    await nextTick() // 等待响应式的url修改生效
    return await audioRef.value.play()
  }

  const stop = () => {
    audioRef.value.pause()
  }

  onUnmounted(() => {
    stop()
  })

  return {
    play,
    stop,
    playing,
    ended,
    duration,
    audio: audioRef,
  }
}
```

---

然后，在需要播放语音的地方，使用这个播放器组合式函数即可。

```ts
const player = useAudioPlayer()
const blob = new Blob([res], { type: 'audio/mp3' }) // 这里的类型需要根据你的音频文件类型进行更改
await player.play(blob)
// 必须在play之后执行watch，否则会意外监听到load数据带来的playing状态改变
const unwatch = watchImmediate(player.playing, (playing) => {
  if (!playing) {
    message.playing = false
    unwatch()
  }
  else {
    message.playing = true
  }
})
```
