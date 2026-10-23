---
title: cssnano升级导致z-index被重新计算的解决办法
date: '2019-08-13 15:55:08'
categories: 学习笔记
tags:
  - vue
  - vue-cli
  - webpack
---

之前遇到了一个遮罩层级的奇怪问题。在dev环境能在弹窗前正常显示的全屏动画，在编译打包以后实际运行时跑到了弹窗的后面。
弹窗的z-index是500，按理说将动画放到501就应该能显示了，结果发现实际编译出来的z-index仅仅是1。
最后发现这个z-index被重新计算是cssnano的杰作。因为它只处理了项目本身的样式，而不包括第三方库的样式。

cssnano的配置如下：
```
"cssnano": {
    "preset": "advanced",
    "autoprefixer": false,
    "postcss-zindex": false
}
```
可见z-index自动重新计算的配置应该是关闭的。
但是这配置实际上是从webpack2的旧项目上拷过来的，而新版本的cssnano已经悄悄修改了配置方式，这个写法等于什么都没配。
修改成以下配置就可以解决问题了：
```
"cssnano": {
    "cssnano-preset-advanced": {
        "zindex": false,
        "autoprefixer": false
    }
}
```
