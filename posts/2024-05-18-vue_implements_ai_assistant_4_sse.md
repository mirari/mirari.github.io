---
title: vue实现AI问答小助手(4)——服务端推送(SSE)
categories:
  - 学习笔记
tags:
  - vueuse
  - vue3
  - WebRTC
  - ASR
date: '2024-05-18 17:40:12'
---

与AI聊天接口交互时，由于生成内容需要一定时间，如果等到所有内容都生成完毕才返回，那用户等待的时间会很长，使用体验就很差。

因此，必须实现流式返回。

一般情况下聊天之类的功能往往会用socket来实现，但由于AI总是一问一答，其实更适合的方案就是SSE([server-sent events](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events/Using_server-sent_events))。

SSE是只能单向传输的，即服务端向客户端推送数据，客户端只能被动接收。

在AI聊天场景下，SSE连接没必要一直保持，可以是发送消息时建立，答复完毕后断开。

大致流程如下：

1. 客户端向服务器发送消息，发送消息的请求本身就是建立SSE连接。
2. 服务器收到消息后，转发给AI模型。
3. 服务器收到AI模型的回复后，通过SSE向客户端推送回复。

---

在一般的实现中，SSE连接可以直接用原生的`EventSource`对象来实现，或者可以用`vueuse`的`useEventSource`。

但是，在我们的使用场景中，发送的消息体会比较复杂，除了要携带发送消息的内容，还需要在header里附带token等信息，用于用户鉴权。

而原生的`EventSource`对象无法提供完全的HTTP控制，不支持自定义header或者POST方法，只能自己实现一个封装。

幸运的是，类似的需求并不是只有我们才有，已经有成熟的轮子[`sse.js`](https://github.com/mpetazzoni/sse.js)，可以很方便地实现复杂数据的SSE连接。

---

在常规的业务接口实现里，一般会对axios进行封装，比如用户登录后插入token等参数，在页面中调用时无需再处理这些问题。

只是axios不支持SSE，所以需要基于`sse.js`实现一个类似的封装。

节选部分代码如下：

```ts
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { debounce, merge } from 'lodash-es'
import { SSE } from 'sse.js'

const { buildURL, combineURLs, isAbsoluteURL } = utils

export interface ResponseData {
  status: string
  errMsg: string
  data: any
}

export interface SSEResponseData {
  source: SSE
  data: any
  readyState?: number
}

export interface RequestConfig extends AxiosRequestConfig {
  successCode?: number | string // 后台返回表示成功的状态码
  loading?: {
    enable?: boolean
    text?: string
    lock?: boolean
  }
  message?: {
    success?: {
      enable?: boolean
      text?: string
      title?: string
      type?: 'toast' | 'alert' | 'notify'
    }
    error?: {
      enable?: boolean
      text?: string
      title?: string
      type?: 'toast' | 'alert' | 'notify'
    }
  }
  resultHandler?: (res: any) => any // 查询结果处理
  logoutHandler?: Function // 登录失效处理
  appendData?: Function // 添加公共参数
  returnResponse?: boolean // 不解析response返回data，直接视为成功并返回
}

export interface SSERequestConfig extends RequestConfig {
  onMessage: (data: any) => void
  onError: (error: Error) => void
}

class API {
  defaults: RequestConfig

  constructor(apiConfig: RequestConfig) {
    this.defaults = merge({}, DEFAULTS, apiConfig)
    this.instance = axios.create(this.defaults)
  }

  requestSSE(config: SSERequestConfig) {
    config = merge(
      {},
      this.defaults,
      {
        lock: false,
        showSuccess: false,
        method: 'POST',
        successMessage: '请求成功',
        errorMessage: '请求失败',
      },
      config,
    )
    // 删除空参数
    deleteEmptyData(config.params)
    deleteEmptyData(config.data)
    // 添加公共参数
    appendData(config)
    let { url, data, method } = config
    if (config.baseURL && !isAbsoluteURL(url!)) {
      url = combineURLs(config.baseURL, url!)
    }
    const headers = config.headers as any
    return new Promise((resolve, reject) => {
      const eventSource = new SSE(url!, {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        method,
        payload: JSON.stringify(data),
        start: false,
      })
      let isConnected = false
      eventSource.addEventListener('message', (res: SSEResponseData) => {
        try {
          const result = JSON.parse(res.data)
          if (!isConnected) {
            isConnected = true
            // 连接建立就视为请求完成
            resolve(Promise.resolve())
          }
          if (config.onMessage) {
            config.onMessage(result)
          }
        }
        catch (e: any) {
          if (config.message?.error?.enable) {
            showError({
              ...config.message?.error,
              text: e.message,
            })
          }
          reject(e)
        }
      })
      eventSource.addEventListener('error', (res: SSEResponseData) => {
        if (!isConnected) {
          // 连接建立失败
          let error = new Error(res.data)
          try {
            const result = JSON.parse(res.data)
            error = new APIError(result)
            if (config.message?.error?.enable) {
              showError({
                ...config.message?.error,
                text: error.message,
              })
            }
          }
          catch (e) {
            if (config.message?.error?.enable) {
              showError({
                ...config.message?.error,
                text: '请求失败',
              })
            }
          }
          reject(error)
        }
        else {
          // 推送返回失败
          let error = new Error(res.data)
          try {
            const result = JSON.parse(res.data)
            error = new APIError(result)
          }
          catch (e) {
          }
          if (config.onError) {
            config.onError(error)
          }
        }
      })
      eventSource.addEventListener('abort', (e: SSEResponseData) => {
        eventSource.close()
      })
      eventSource.stream()
    })
  }
}

export class APIError extends Error {
  data?: any
  code?: number | string

  constructor(result: ResponseData) {
    super(result.errMsg)
    this.data = result.data
    this.code = result.status
    this.name = 'APIError'
  }
}

export default API
```

使用方法基本与普通请求一样，只是需要多传入onMessage和onError两个回调:

```ts
const send = (data: ChatMessageDTO, onMessage: (reply: ReplyEntity) => void, onError: (error: Error) => void): Promise<any> => {
  return api.requestSSE({
    url: 'dialogue/chat',
    method: 'post',
    data,
    onMessage,
    onError,
  })
}
```
