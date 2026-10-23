---
layout: post
title: 支付宝小程序批量自动化部署
categories:
  - 学习笔记
tags:
  - uni-app
  - nodejs
  - vue3
  - 小程序
date: '2024-09-03 15:10:46'
---

下面梳理一下支付宝小程序的批量自动化部署实现流程。

## 准备工作

大致流程与微信小程序类似，请参考[微信小程序批量自动化部署](/posts/2024-07-18-wechat_mini_program_automated_deployment)。


### 密钥及IP白名单配置

跟着文档操作，首先需要到支付宝小程序管理后台右上角点击头像后点击[**账户中心**](https://open.alipay.com/develop/manage/tool-key)(不是开发配置)中进行配置。

注意，只有**管理员**可以看到这个页面，应用管理员无法使用此功能。

![](./1.png)

将密钥文件下载到安全的位置。由于我们的项目是私有库，这里就直接放到了项目deploy/alipay目录下。多个小程序的密钥可以放在一起，这里我将密钥起名为`${appid}.json`。

这是一个json文件，在nodejs中可以直接用require引入。

[来源](https://opendocs.alipay.com/mini/02q29w?pathHash=dad1b6ca)


## 构建脚本

uni-app项目使用vite框架，这里用到了.env环境变量的相关功能，原生支付宝小程序请自行实现或省略此功能。

### 更新版本号

在微信小程序的deploy.js里已经实现过了，是在版本发布时用到的，执行一次就够了。

这里无需重复实现，可以直接跳过。

### 构建小程序

如果只有一个小程序，可以略过此步，直接执行构建命令然后上传。

有多个小程序时，需要先执行一些定制脚本，再执行构建。比如至少要做的一项操作是更新appId，在uni-app中，这项配置位于manifest.json中。

在`deploy/alipay/deploy.js`中添加以下代码：

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
        jsonData['mp-alipay'].appid = options.appid

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

与微信相比，唯一的改动是将原本修改的mp-weixin.appid改为了mp-alipay.appid。

调用脚本的命令例子为：

```
node deploy/alipay/deploy.js toggle --appid=你的appid
```

### 上传小程序

在`deploy/alipay/deploy.js`中添加以下代码：

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
    const config = require(`./${options.appid}.json`)
    useDefaults(config)

    const params = {
      appId: options.appid,
      // identityKeyPath: `${projectDir}/deploy/alipay/${options.appid}.json`,
      version,
      project: `${projectDir}/dist/build/mp-alipay`,
      experience: true,
    }
    console.log('params', params)
    minidev.upload(params, {
      onLog: (data) => {
        // 输出日志
        console.log(data)
      },
    })
  })

program.parse(process.argv)
```

这个脚本会调用支付宝小程序的CI接口，将小程序上传到服务器。调用脚本的命令例子为：

```
node deploy/alipay/deploy.js upload --appid=你的appid
```

其中appid在命令行中传入，而version是从package.json中读取的。

### 完整的deploy.js文件

```js
const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')
const { execSync } = require('node:child_process')
const JSON5 = require('json5')
const { minidev, useDefaults } = require('minidev')
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
        jsonData['mp-alipay'].appid = options.appid

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
    const config = require(`./${options.appid}.json`)
    useDefaults(config)

    const params = {
      appId: options.appid,
      // identityKeyPath: `${projectDir}/deploy/alipay/${options.appid}.json`,
      version,
      project: `${projectDir}/dist/build/mp-alipay`,
      experience: true,
    }
    console.log('params', params)
    minidev.upload(params, {
      onLog: (data) => {
        // 输出日志
        console.log(data)
      },
    })
  })

program.parse(process.argv)

```

与微信相比，主要的区别就是ci工具变成了支付宝提供的`minidev`。

在本地调试时，用以下命令即可模拟构建的完整操作了：

```
node deploy/alipay/deploy.js toggle --appid=小程序A
pnpm run build:mp-alipay:小程序A
node deploy/alipay/deploy.js upload --appid=小程序A
```

注意这里的build命令，对应package.json中脚本的写法为：

```
"build:mp-alipay:小程序A": "uni build -p mp-alipay --mode 小程序A",
```

传入mode参数时，执行时会读取`.env.小程序A`中定义的环境变量，从而实现一些定制化的操作。

可以将这组命令写成sh脚本，每个小程序一个，都放在deploy目录下，在Flow工作流中调用。

上传命令执行成功后，支付宝小程序后台版本管理中就可以看到这个版本了：

![](./2.png)

注意上传版本前需要先创建迭代。这是支付宝小程序特有的步骤。

## 额外信息

此外，以nodejs方式调用minidev时，异常不一定会输出。

如果在调试上传过程中遇到错误，比如执行没有反应，就需要使用文档中没写的隐藏参数开启debug。或者也可以用命令行形式执行，可以在控制台看到错误信息。

代码示例如下：

```
# 开启debug模式
export DEBUG=minidev-cli
node deploy/alipay/deploy.js upload --appid=小程序id
# 命令行形式调用
#minidev upload --app-id=小程序id --project dist/build/mp-alipay --version 0.1.1 --identity-key-path deploy/alipay/小程序id.json
```

## 配置云效Flow

后续动作与微信小程序一致，不再赘述。

## 参考来源：

- [支付宝小程序构建发布](https://opendocs.alipay.com/mini/02q17h)
