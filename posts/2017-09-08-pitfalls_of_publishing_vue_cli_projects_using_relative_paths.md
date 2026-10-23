---
title: 使用相对路径发布vue-cli项目的坑
date: '2017-09-08 16:21:07'
categories: 学习笔记
tags:
  - vue
  - vue-cli
  - webpack
---

使用vue-cli可以快速创建一个webpack项目脚手架，有相当多的项目都使用了相似的配置。
它们对发布环境的配置差不多是这样的：

```javascript
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'assets',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  ...
}
```

<!-- more -->

这种配置只能通过根路径访问，比如`http://project.example.com/`。

如果这个项目发布的内网地址是`http://192.168.1.101/project/`，那么它实际上是无法被直接访问的，所有js、css等资源的引用地址全部会出错。

从调试器中可以看到这些URL全都是写死成从根路径开始的。

而如果想要以`http://www.example.com/project/`来访问项目，就只有将`assetsPublicPath`修改成`'/project/''`并重新编译打包发布。

显然这种做法相当不灵活。

理想的做法是将项目以相对路径形式发布，无论它位于什么层级，都可以以相对路径的方式请求到引用的资源。

很多教程都是这么教的：

>只要把根目录改为相对目录就好了
```javascript
assetsPublicPath: './'
```

如果只是拿脚手架做点练习，这样做也许可以。

但只要你的项目有CSS引用了图片或者字体，并且它们会被归类到各自的目录，光是修改assetsPublicPath是不够的，会遇到这样的问题：

![](./snipaste20170908_165246.png)

如果项目中用到了Bootstrap或者FontAwesome之类的工具，那这个坑是必然绕不过去的。

完美的解决方法是在cssLoaders中为CSS单独配置publicPath：
```javascript
if (options.extract) {
      return ExtractTextPlugin.extract({
        use: sourceLoader,
        fallback: 'vue-style-loader',
        publicPath: '../../'
      })
    }
```
我的输出目录是dist > index.html + assets > css + fonts + img + js，因此publicPath需要向上返回两级，可根据实际项目配置修改它的值。

步骤总结：
1. 在`config/index.js`中，将`assetsPublicPath`修改为`./`

2. 在`build/utils.js`中，找到`ExtractTextPlugin.extract`，添加配置项`publicPath: '../../'`
