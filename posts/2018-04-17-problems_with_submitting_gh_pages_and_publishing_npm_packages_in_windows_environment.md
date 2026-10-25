---
title: windows环境下无法提交gh-pages、无法发布npm包的问题
date: '2018-04-17 10:47:47'
categories: 学习笔记
tags:
  - npm
  - github
  - git
  - nodejs
---

以下问题均出现在windows环境，使用IntelliJ IDEA中的npm选项卡双击执行命令时。

使用npm的gh-pages工具包，可以很方便地一键发布指定目录到项目的gh-pages分支。

以前用着好好的，但是最近使用的时候，忽然发现以下报错信息：

<!-- more -->

```
No such device or address: '/dev/tty'
fatal: could not read Username for 'https://github.com': No error
```
网上搜到类似的问题都是hexo的发布，但这里并不像hexo一样用到config.yml，流传的处理方式也只是治标不治本（暴露了账号密码到配置文件中）。
关键问题还是执行过程中出现了windows不支持的语句。
最终处理方式是，重新安装git for windows，在安装过程这一步选择第二项：

![](./1.png)

这样可以使cmd支持git命令。应该是之前手贱升级git的时候点错了。


随后尝试一键发布到npm仓库时又出现了如下错误：
```
 Error: EPERM: operation not permitted, unlink '...\Temp\npm-xxxxx-xxxxxxxx\tmp\fromDir-xxxxxxxx\package.tgz'
npm ERR!        at Error (native)
```
解决方式是打开Idea设置，找到`Node.js and npm`，将Package Manager从yarn改为npm。
