---
layout: post
title: 微信小程序批量自动化部署
categories:
  - 学习笔记
tags:
  - uni-app
  - nodejs
  - vue3
  - 小程序
date: '2024-07-18 14:24:14'
---

CI/CD这个概念很实用，但我们这种小作坊，没有一些很高大上的应用。

最常见的使用场景就是，开发者一键提交分支master，交给工作流工具完成构建，部署的后续操作，自动更新测试或线上环境。

个人博客等项目可以使用Github action来实现，但公司的代码在云效上，我更习惯于使用云效Flow来实现自动化部署。他的操作菜单是可视化的，非常方便，还有一些推送机器人消息的傻瓜化配置插件。

目前遇到一个需求，就是同一个uni-app小程序项目，需要部署到多个不同的小程序上。每个小程序的主要功能类似，但都有一些定制改动。

每次项目发版时，如果要手动挨个在微信开发者工具上切换、上传，会非常繁琐，而且uni-app使用dev命令输出的开发环境微信小程序项目代码也没有优化，正式发版时哪怕只有一个小程序也需要在dev、build两个项目里来回切。

因此非常需要自动化部署来节省精力。

下面梳理一下微信小程序的批量自动化部署实现流程。

## 准备工作

常见的web项目自动化部署，至少包含代码触发、构建、部署这3个步骤。

其中构建步骤中操作的产物会被打包上传，并在部署步骤中，下载到目标服务器，然后执行后续目录操作、启动等操作。

但是微信小程序的部署不需要这些操作，而是通过在node脚本中执行`miniprogram-ci`这个工具的相关方法来实现的。

`miniprogram-ci`的相关文档请参考[这里](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)。

### 密钥及IP白名单配置

跟着文档操作，首先需要到微信小程序管理后台的开发设置中进行配置。

点击生成按钮即可创建密钥，关闭后只能重新生成。

![](./1.png)

将密钥文件下载到安全的位置。由于我们的项目是私有库，这里就直接放到了项目deploy目录下。多个小程序的密钥可以放在一起，默认已经用appId做了区分。


云效Flow的构建集群提供了一组IP地址，将这些IP地址加入白名单即可。地址如下：

```
47.94.150.88
47.94.150.17
47.93.89.246
123.56.255.38
112.126.70.240
```

[来源](https://help.aliyun.com/document_detail/201868.html)

IP地址不在白名单的话，调用上传时会报错。如果在本地调试，别忘了将本机的公网IP加入白名单，或者临时关闭。

## 构建脚本

uni-app项目使用vite框架，这里用到了.env环境变量的相关功能，原生微信小程序请自行实现或省略此功能。

### 更新版本号

微信小程序上传时，需要指定版本号。

版本号标准的用法还是放在package.json中，所以我在自动化部署实现过程中，顺便就引入了[`standard-version`](https://github.com/conventional-changelog/standard-version)版本号管理。(项目被标记为deprecated，但我没有找到其他适合私有库的版本号管理工具，欢迎指点。)

`standard-version`可以自动根据git提交记录生成`CHANGELOG.md`。

并按照以下初始规则来生成版本号：

如果上个版本之间的提交只有fixed，更新patch版本号，比如`1.0.0`更新到`1.0.1`。

否则更新minor版本号，比如`1.0.0`更新到`1.1.0`。

更新版本号的同时，它会将`CHANGELOG.md`与更新版本号以后的`package.json`一同提交到git，同时创建一个版本号对应的tag。

---

在一般项目中这样就足够了，但是如果还想在小程序中展示这个版本号，就会存在问题——无法引入package.json文件。

而且使用wx.getAccountInfoSync虽然也能获取版本号，但只有正式环境能用，在体验版、开发版中是空字符串。

因此，我只能修改部署版本命令，加上了一些后处理脚本，将版本号同步更新到环境变量中。

在package.json的script中，添加以下命令：

```json
{
  "scripts": {
    "release": "standard-version && node deploy/deploy.js version",
    "release:minor": "standard-version -- --release-as minor && node deploy/deploy.js version",
    "release:beta": "standard-version -p beta && node deploy/deploy.js version"
  }
}
```

多提一嘴，release:minor是在提交记录只有fixed但又希望更新minor版本时使用的，可以无视默认规则。当然也可以无视所有规则直接指定具体版本号，具体使用可查看[文档]()(https://github.com/conventional-changelog/standard-version)。

#### 后处理脚本

在deploy目录下，创建deploy.js文件，内容如下：

```js
const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')
const { execSync } = require('node:child_process')
const JSON5 = require('json5')
const ci = require('miniprogram-ci')
const { Command } = require('commander')
const dayjs = require('dayjs')
const dotenv = require('dotenv')
const { version } = require('../package.json')

const program = new Command()

// 同步版本号
program
  .command('version')
  .option('-a, --appid <type>', 'application id')
  .action((options) => {
    const envPath = path.resolve(__dirname, '../.env')
    // 读取 .env 文件的内容
    const envContent = fs.readFileSync(envPath, 'utf8')

    // 分割每一行
    const lines = envContent.split('\n')

    // 定义新的内容数组
    const newLines = []

    // 遍历每一行，查找并修改 VITE_APP_VERSION 的值
    lines.forEach((line) => {
      if (line.startsWith('VITE_APP_VERSION=')) {
        newLines.push(`VITE_APP_VERSION=${version}`)
      }
      else {
        newLines.push(line) // 保留其他行，包括注释
      }
    })

    // 将修改后的内容写回 .env 文件
    fs.writeFileSync(envPath, newLines.join('\n'))

    // 添加文件到暂存区
    execSync(`git add ${envPath}`)

    // 获取前一次提交的标签
    let tag
    try {
      tag = execSync('git describe --tags --abbrev=0').toString().trim()
    }
    catch (error) {
      console.error('没有找到标签')
      process.exit(1)
    }

    // 将当前暂存区的改动追加到前一次提交中
    execSync('git commit --amend --no-edit')

    // 删除旧的标签
    execSync(`git tag -d ${tag}`)

    // 将标签移动到新的提交
    execSync(`git tag ${tag}`)
  })

program.parse(process.argv)
```

这个脚本会读取.env文件，找到VITE_APP_VERSION这一行，将其值更新为package.json中的version，然后将改动合并到前一次的git提交中，也就是standard-version所创建的提交。

没有用dotenv是因为这个工具更适合读取配置，但写入时会丢失注释信息。

### 构建小程序

如果只有一个小程序，可以略过此步，直接执行构建命令然后上传。

有多个小程序时，需要先执行一些定制脚本，再执行构建。比如至少要做的一项操作是更新appId，在uni-app中，这项配置位于manifest.json中。

在`deploy/deploy.js`中添加以下代码：

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
    const filePath = path.join(__dirname, '../src/manifest.json')
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
        jsonData['mp-weixin'].appid = options.appid

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

这个脚本会读取manifest.json文件，找到mp-weixin.appid这一行，将其值更新为命令行参数中的appid，然后将改动写入manifest.json文件。

调用脚本的命令例子为：

```
node deploy/deploy.js toggle --appid=你的appid
```

### 上传小程序

在`deploy/deploy.js`中添加以下代码：

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
    const projectDir = path.join(__dirname, '../')

    const project = new ci.Project({
      appid: options.appid,
      type: 'miniProgram',
      projectPath: `${projectDir}/dist/build/mp-weixin`,
      privateKeyPath: `${projectDir}/deploy/private.${options.appid}.key`,
      // ignores: ['node_modules/**/*'],
    })
    ci.upload({
      project,
      version,
      desc: `CI机器人于${dayjs().format('YYYY-MM-DD HH:mm:ss')}上传`,
      setting: {
        es6: true,
        es7: true,
        minify: true,
        // autoPrefixWXSS: true,
        minifyWXML: true,
        minifyJS: true,
      },
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

这个脚本会调用微信小程序的CI接口，将小程序上传到微信服务器。调用脚本的命令例子为：

```
node deploy/deploy.js upload --appid=你的appid
```

其中appid在命令行中传入，而version是从package.json中读取的。

### 完整的deploy.js文件

```js
const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')
const { execSync } = require('node:child_process')
const JSON5 = require('json5')
const ci = require('miniprogram-ci')
const { Command } = require('commander')
const dayjs = require('dayjs')
const dotenv = require('dotenv')
const { version } = require('../package.json')

const program = new Command()

// 同步版本号
program
  .command('version')
  .option('-a, --appid <type>', 'application id')
  .action((options) => {
    const envPath = path.resolve(__dirname, '../.env')
    // 读取 .env 文件的内容
    const envContent = fs.readFileSync(envPath, 'utf8')

    // 分割每一行
    const lines = envContent.split('\n')

    // 定义新的内容数组
    const newLines = []

    // 遍历每一行，查找并修改 VITE_APP_VERSION 的值
    lines.forEach((line) => {
      if (line.startsWith('VITE_APP_VERSION=')) {
        newLines.push(`VITE_APP_VERSION=${version}`)
      }
      else {
        newLines.push(line) // 保留其他行，包括注释
      }
    })

    // 将修改后的内容写回 .env 文件
    fs.writeFileSync(envPath, newLines.join('\n'))

    // 添加文件到暂存区
    execSync(`git add ${envPath}`)

    // 获取前一次提交的标签
    let tag
    try {
      tag = execSync('git describe --tags --abbrev=0').toString().trim()
    }
    catch (error) {
      console.error('没有找到标签')
      process.exit(1)
    }

    // 将当前暂存区的改动追加到前一次提交中
    execSync('git commit --amend --no-edit')

    // 删除旧的标签
    execSync(`git tag -d ${tag}`)

    // 将标签移动到新的提交
    execSync(`git tag ${tag}`)
  })

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
    const filePath = path.join(__dirname, '../src/manifest.json')
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
        jsonData['mp-weixin'].appid = options.appid

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
    const projectDir = path.join(__dirname, '../')

    const project = new ci.Project({
      appid: options.appid,
      type: 'miniProgram',
      projectPath: `${projectDir}/dist/build/mp-weixin`,
      privateKeyPath: `${projectDir}/deploy/private.${options.appid}.key`,
      // ignores: ['node_modules/**/*'],
    })
    ci.upload({
      project,
      version,
      desc: `CI机器人于${dayjs().format('YYYY-MM-DD HH:mm:ss')}上传`,
      setting: {
        es6: true,
        es7: true,
        minify: true,
        // autoPrefixWXSS: true,
        minifyWXML: true,
        minifyJS: true,
      },
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

如果是原生微信小程序，且使用了npm依赖，只需要在upload之前执行一下构建命令即可：

```js
// 在有需要的时候构建npm
const warning = await ci.packNpm(project, {
  ignores: [],
  reporter: (infos) => { console.log(infos) }
})
console.warn(warning)
// ci.upload()
```

在本地调试时，用以下命令即可模拟构建的完整操作了：

```
node deploy/deploy.js toggle --appid=小程序A
pnpm run build:mp-weixin:小程序A
node deploy/deploy.js upload --appid=小程序A
```

注意这里的build命令，对应package.json中脚本的写法为：

```
"build:mp-weixin:小程序A": "uni build -p mp-weixin --mode 小程序A",
```

传入mode参数时，执行时会读取`.env.小程序A`中定义的环境变量，从而实现一些定制化的操作。

可以将这组命令写成sh脚本，每个小程序一个，都放在deploy目录下，在Flow工作流中调用。

上传命令执行成功后，微信小程序后台版本管理中就可以看到这个版本了：

![](./2.png)

后续的提审、发布操作目前仍需人工操作。

## 配置云效Flow

本地调试正常后，最后来配置云效Flow。

前面的代码触发不变，后面的部署步骤可以直接删除。

构建脚本为：

```
npm i -g pnpm
pnpm config set registry https://registry.npmmirror.com
pnpm i
node deploy/deploy.js toggle --appid=小程序A
pnpm run build:mp-weixin:小程序A
node deploy/deploy.js upload --appid=小程序A
```

如果有多个小程序，可以配置多个并行步骤：

![](./3.png)

### 待优化

依赖应该只需要安装一次，即将安装依赖步骤与构建步骤分开。

### (可选)配置通知机器人

![](./4.png)

在构建步骤窗口的底部，可以添加通知插件。

这里使用的是钉钉机器人，教程参考[这里](https://help.aliyun.com/document_detail/2668755.html)

大致步骤为：

1. 在钉钉中拉上同事或者小号，凑满3人，创建一个外部群。
2. 在钉钉群的群设置中，添加机器人，获得api接口地址与签名。
3. 在云效Flow的钉钉机器人插件中填入接口地址与签名。

此后每次发版，只需提版合并到master分支，等待片刻收到钉钉机器人的提示，就可以准备提审了。

![](./5.png)

## 参考来源：

- [微信小程序构建发布](https://help.aliyun.com/document_detail/202392.html)
