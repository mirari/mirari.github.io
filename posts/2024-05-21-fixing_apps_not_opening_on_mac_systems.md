---
title: Mac修复应用无法打开
categories:
  - 好人修电脑
tags:
  - 好人修电脑
  - MacOS
date: '2024-05-21 17:46:29'
---

在一些第三方网站下载安装MacOS应用时，打开dmg文件，有时候会有一个“修复无法打开”的图标。

遇到应用拖动到Applications文件夹无法打开时，双击运行一下就可以解决问题。

但是在Sonoma 14.5版本下，这些操作失效了。

在隐私与安全性中配置“任何来源”`(sudo spctl --master-disable)`与点击“仍要打开”这些基本操作就不说了，只记录下如何解决“修复无法打开”的问题，也就是绕过GateKeeper保护机制。

网上能搜到的方法是教你输入`sudo xattr -rd com.apple.quarantine`这段代码，不过在Sonoma 14.5中，`-r`这个参数已经失效了。

所以正确的做法是：

1. 打开终端
2. 输入`sudo xattr -d com.apple.quarantine `
3. 将应用目录下要安装的应用拖动到终端(此时路径会拼接到后面，注意空格)
4. 运行并输入管理员密码即可。

参考来源：

https://fcp7.com/solution-mac-install-app-common-problem.html
