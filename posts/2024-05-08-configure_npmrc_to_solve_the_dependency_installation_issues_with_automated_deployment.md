---
title: 配置npmrc解决自动化部署时cypress等依赖安装问题
categories:
  - 学习笔记
tags:
  - npm
  - cypress
  - canvas
  - electron
date: '2024-05-05 22:02:19'
---

公司的代码仓库在阿里云的云效上，自动化部署使用的是云效的流水线Flow。

流水线默认提供的node版本最高是18，且默认的pnpm版本也较低。而现在的项目基本都是用pnpm作为包管理工具的。

如果编译环境不能做到一致，部署时就可能出现一些奇怪问题。

此外，构建主机在国内，安装依赖时也会遇到网络问题。

一般的依赖可以用镜像`npmmirror.com`来解决(包括流水线自己默认的node镜像也是这样处理的)，但像cypress这种需要下载二进制文件的依赖，就没有办法了。

比如，在流水线中执行安装依赖时，会报错：

```
[21:39:07] .../cypress@13.7.3/node_modules/cypress postinstall: Installing Cypress (version: 13.7.3)
[21:39:07] .../cypress@13.7.3/node_modules/cypress postinstall: [STARTED] Task without title.
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED] The Cypress App could not be downloaded.
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED]
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED] Does your workplace require a proxy to be used to access the Internet? If so, you must configure the HTTP_PROXY environment variable before downloading Cypress. Read more: https://on.cypress.io/proxy-configuration
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED]
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED] Otherwise, please check network connectivity and try again:
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED]
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED] ----------
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED]
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED] URL: https://download.cypress.io/desktop/13.7.3?platform=linux&arch=x64
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED] AggregateError
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED]
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED] ----------
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED]
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED] Platform: linux-x64 (Ubuntu - 20.04)
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: [FAILED] Cypress Version: 13.7.3
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: The Cypress App could not be downloaded.
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: Does your workplace require a proxy to be used to access the Internet? If so, you must configure the HTTP_PROXY environment variable before downloading Cypress. Read more: https://on.cypress.io/proxy-configuration
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: Otherwise, please check network connectivity and try again:
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: ----------
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: URL: https://download.cypress.io/desktop/13.7.3?platform=linux&arch=x64
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: AggregateError
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: ----------
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: Platform: linux-x64 (Ubuntu - 20.04)
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: Cypress Version: 13.7.3
[21:39:09] .../cypress@13.7.3/node_modules/cypress postinstall: Failed
[21:39:09]  ELIFECYCLE  Command failed with exit code 1.
```

明显就是网络不通导致的。

可以通过配置`.npmrc`与`.nvmrc`来解决开发环境与部署编译环境的一致性问题。

### 创建`.nvmrc`文件

首先需要使用`.nvmrc`来指定nodejs版本。

新建`.nvmrc`文件，输入以下内容保存(我的开发环境node版本是`20.11.1`，按需修改)。

```
v20.11.1
```

然后在云效流水线的`Node.js构建`中选择`使用代码库中.nvmrc文件中的版本`

![](./flow_nodejs_build.png)


### 创建`.npmrc`文件


在项目根目录下新建`.npmrc`文件，输入以下内容保存：

```
shamefully-hoist=true
strict-peer-dependencies=false
registry=https://registry.npmmirror.com
disturl=https://registry.npmmirror.com/-/binary/node/
# node-sass预编译二进制文件下载地址
sass_binary_site=https://registry.npmmirror.com/-/binary/node-sass
# sharp预编译共享库, 截止2022-09-20 sharp@0.31.0的预编译共享库并未同步到镜像, 入安装失败可切换到sharp@0.30.7使用
sharp_libvips_binary_host=https://registry.npmmirror.com/-/binary/sharp-libvips
python_mirror=https://registry.npmmirror.com/-/binary/python/
electron_mirror=https://registry.npmmirror.com/-/binary/electron/
electron_builder_binaries_mirror=https://registry.npmmirror.com/-/binary/electron-builder-binaries/
# 无特殊配置参考{pkg-name}_binary_host_mirror={mirror}
canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas
node_sqlite3_binary_host_mirror=https://registry.npmmirror.com/-/binary/sqlite3
better_sqlite3_binary_host_mirror=https://registry.npmmirror.com/-/binary/better-sqlite3
# cypress配置
CYPRESS_DOWNLOAD_PATH_TEMPLATE=https://registry.npmmirror.com/-/binary/cypress/\${version}/\${platform}-\${arch}/cypress.zip
```

下面粗略解释下作用。

```
shamefully-hoist=true
strict-peer-dependencies=false
```

最开头这一段主要是给pnpm使用的。

因为pnpm默认不会将依赖的依赖安装到node_modules目录下，而有些npm时代的项目会省略掉一些依赖的依赖的package声明，如果改用pnpm就会出问题。

```
registry=https://registry.npmmirror.com
disturl=https://registry.npmmirror.com/-/binary/node/
```

这一段用于改写默认镜像地址，应该是很常见的配置了。

之后的配置都是用于改写二进制文件的下载地址的，列举了一些常见的二进制依赖，来自其他网站。

```
# cypress配置
# CYPRESS_DOWNLOAD_MIRROR=https://registry.npmmirror.com/-/binary/cypress
# 不能使用前者，因为desktop路径仍然会被保留
CYPRESS_DOWNLOAD_PATH_TEMPLATE=https://registry.npmmirror.com/-/binary/cypress/\${version}/\${platform}-\${arch}/cypress.zip

```

最后的cypress配置是我额外加的，因为它的二进制文件下载地址与`npmmirror.com`的镜像地址不一致，所以需要单独配置。

参考来源：

https://docs.cypress.io/guides/references/advanced-installation#Download-path-template

### 收工

最后将这两个文件加入版本控制并提交到发布用的分支即可。

在编译流水线中执行编译命令，比如我的：

```
npm i -g pnpm@9.0.6
pnpm config set registry https://registry.npmmirror.com
pnpm i
pnpm run build
```
