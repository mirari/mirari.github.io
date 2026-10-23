---
layout: post
title: 头条小程序批量自动化部署
categories:
  - 学习笔记
tags:
  - uni-app
  - nodejs
  - vue3
  - 小程序
date: '2024-09-03 15:10:17'
---

下面梳理一下头条小程序的批量自动化部署实现流程。

## 准备工作

大致流程与微信小程序类似，请参考[微信小程序批量自动化部署](/posts/2024-07-18-wechat_mini_program_automated_deployment)。


### 密钥配置

跟着文档操作，首先需要到头条小程序管理后台的开发设置中进行配置。

点击立即启用按钮即可创建密钥，关闭后只能重新生成。

![](./1.png)

将密钥文件下载到安全的位置。由于我们的项目是私有库，这里就直接放到了项目deploy/toutiao目录下。多个小程序的密钥可以放在一起，这里我将密钥起名为`${appid}.token`。

[来源](https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/developer-instrument/development-assistance/cli-token)

头条没有白名单的配置。

## 构建脚本

uni-app项目使用vite框架，这里用到了.env环境变量的相关功能，原生头条小程序请自行实现或省略此功能。

### 更新版本号

在微信小程序的deploy.js里已经实现过了，是在版本发布时用到的，执行一次就够了。

这里无需重复实现，可以直接跳过。

### 构建小程序

如果只有一个小程序，可以略过此步，直接执行构建命令然后上传。

有多个小程序时，需要先执行一些定制脚本，再执行构建。比如至少要做的一项操作是更新appId，在uni-app中，这项配置位于manifest.json中。

在`deploy/toutiao/deploy.js`中添加以下代码：

```js
// 切换小程序
program
  .command('toggle')
  .option('-a, --appid <type>', 'application id')
  .action((options) => {
    if (!options.appid) {
      console.error('请输入 application id')
      process.exit(1)
    }
    // 定义文件路径
    const filePath = path.join(__dirname, '../../src/manifest.json')
    // 读取 JSON 文件
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('读取文件失败:', err)
        return
      }

      try {
        // 解析 JSON 数据（支持注释）
        const jsonData = JSON5.parse(data)

        // 修改 appid 字段
        jsonData['mp-toutiao'].appid = options.appid

        // 将修改后的 JSON 数据转换为字符串（支持注释格式）
        console.log(jsonData)
        const updatedData = JSON.stringify(jsonData, null, 2)
        console.log(updatedData)
        // 写入修改后的数据到 JSON 文件
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
          if (err) {
            console.error('写入文件失败:', err)
            return
          }
          console.log('文件已成功更新')
        })
      }
      catch (err) {
        console.error('解析 JSON 数据失败:', err)
      }
    })
  })
```

与微信相比，唯一的改动是将原本修改的mp-weixin.appid改为了mp-toutiao.appid。

调用脚本的命令例子为：

```
node deploy/toutiao/deploy.js toggle --appid=你的appid
```

### 上传小程序

在`deploy/toutiao/deploy.js`中添加以下代码：

```js

// 上传小程序
program
  .command('upload')
  .option('-a, --appid <type>', 'application id')
  .action((options) => {
    if (!options.appid) {
      console.error('请输入 application id')
      process.exit(1)
    }

    // 获取当前工作目录的父路径
    const projectDir = path.join(__dirname, '../../')
    const token = fs.readFileSync(`${projectDir}/deploy/toutiao/${options.appid}.token`, 'utf8')

    tma.setAppConfig({
      appid: options.appid,
      config: {
        token: token.trim(),
      },
    })
    tma.upload({
      project: {
        path: `${projectDir}/dist/build/mp-toutiao`, // 项目地址
      },
      qrcode: {
        format: 'null', // imageSVG | imageFile | null | terminal
        // imageSVG 用于产出二维码 SVG
        // imageFile 用于将二维码存储到某个路径
        // terminal 用于将二维码在控制台输出
        // null 则不产出二维码
        output: '', // 只在 imageFile 生效，填写图片输出绝对路径
        options: {
          small: false, // 使用小二维码，主要用于 terminal
        },
      },
      copyToClipboard: false, // 是否将产出的二维码链接复制到剪切板
      changeLog: `CI机器人于${dayjs().format('YYYY-MM-DD HH:mm:ss')}上传`,
      version, // 本次更新版本，可选参数，默认值为前序版本号末位加一
      needUploadSourcemap: true, // 是否上传后生成 sourcemap，推荐使用 true，否则开发者后台解析错误时将不能展示原始代码
    }).then((res) => {
      console.log(res)
      console.log('上传成功')
      process.exit(0)
    }).catch((error) => {
      if (error.errCode === -1) {
        console.log('上传成功')
        process.exit(0)
      }
      console.log(error)
      console.log('上传失败')
      process.exit(-1)
    })
  })

program.parse(process.argv)
```

这个脚本会调用头条小程序的CI接口，将小程序上传到服务器。调用脚本的命令例子为：

```
node deploy/toutiao/deploy.js upload --appid=你的appid
```

其中appid在命令行中传入，而version是从package.json中读取的。

### 完整的deploy.js文件

```js
const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')
const { execSync } = require('node:child_process')
const JSON5 = require('json5')
const tma = require('tt-ide-cli')
const { Command } = require('commander')
const dayjs = require('dayjs')
const dotenv = require('dotenv')
const { version } = require('../../package.json')

const program = new Command()

// 切换小程序
program
  .command('toggle')
  .option('-a, --appid <type>', 'application id')
  .action((options) => {
    if (!options.appid) {
      console.error('请输入 application id')
      process.exit(1)
    }
    // 定义文件路径
    const filePath = path.join(__dirname, '../../src/manifest.json')
    // 读取 JSON 文件
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('读取文件失败:', err)
        return
      }

      try {
        // 解析 JSON 数据（支持注释）
        const jsonData = JSON5.parse(data)

        // 修改 appid 字段
        jsonData['mp-toutiao'].appid = options.appid

        // 将修改后的 JSON 数据转换为字符串（支持注释格式）
        console.log(jsonData)
        const updatedData = JSON.stringify(jsonData, null, 2)
        console.log(updatedData)
        // 写入修改后的数据到 JSON 文件
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
          if (err) {
            console.error('写入文件失败:', err)
            return
          }
          console.log('文件已成功更新')
        })
      }
      catch (err) {
        console.error('解析 JSON 数据失败:', err)
      }
    })
  })

// 上传小程序
program
  .command('upload')
  .option('-a, --appid <type>', 'application id')
  .action((options) => {
    if (!options.appid) {
      console.error('请输入 application id')
      process.exit(1)
    }

    // 获取当前工作目录的父路径
    const projectDir = path.join(__dirname, '../../')
    const token = fs.readFileSync(`${projectDir}/deploy/toutiao/${options.appid}.token`, 'utf8')

    tma.setAppConfig({
      appid: options.appid,
      config: {
        token: token.trim(),
      },
    })
    tma.upload({
      project: {
        path: `${projectDir}/dist/build/mp-toutiao`, // 项目地址
      },
      qrcode: {
        format: 'null', // imageSVG | imageFile | null | terminal
        // imageSVG 用于产出二维码 SVG
        // imageFile 用于将二维码存储到某个路径
        // terminal 用于将二维码在控制台输出
        // null 则不产出二维码
        output: '', // 只在 imageFile 生效，填写图片输出绝对路径
        options: {
          small: false, // 使用小二维码，主要用于 terminal
        },
      },
      copyToClipboard: false, // 是否将产出的二维码链接复制到剪切板
      changeLog: `CI机器人于${dayjs().format('YYYY-MM-DD HH:mm:ss')}上传`,
      version, // 本次更新版本，可选参数，默认值为前序版本号末位加一
      needUploadSourcemap: true, // 是否上传后生成 sourcemap，推荐使用 true，否则开发者后台解析错误时将不能展示原始代码
    }).then((res) => {
      console.log(res)
      console.log('上传成功')
      process.exit(0)
    }).catch((error) => {
      if (error.errCode === -1) {
        console.log('上传成功')
        process.exit(0)
      }
      console.log(error)
      console.log('上传失败')
      process.exit(-1)
    })
  })

program.parse(process.argv)

```

与微信相比，主要的区别就是ci工具变成了头条提供的`tt-ide-cli`。

在本地调试时，用以下命令即可模拟构建的完整操作了：

```
node deploy/toutiao/deploy.js toggle --appid=小程序A
pnpm run build:mp-toutiao:小程序A
node deploy/toutiao/deploy.js upload --appid=小程序A
```

注意这里的build命令，对应package.json中脚本的写法为：

```
"build:mp-toutiao:小程序A": "uni build -p mp-toutiao --mode 小程序A",
```

传入mode参数时，执行时会读取`.env.小程序A`中定义的环境变量，从而实现一些定制化的操作。

可以将这组命令写成sh脚本，每个小程序一个，都放在deploy目录下，在Flow工作流中调用。

上传命令执行成功后，头条小程序后台版本管理中就可以看到这个版本了：

![](./2.png)

头条的CI功能更多，支持提审，有精力可以自行实现。

## 配置云效Flow

后续动作与微信小程序一致，不再赘述。

## 参考来源：

- [头条小程序构建发布](https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/developer-instrument/development-assistance/ide-cli)
