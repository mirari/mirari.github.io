---
title: 让IDE识别webpack的别名alias'@'
date: '2019-06-10 16:39:39'
categories: 学习笔记
tags:
  - Vue
  - Webpack
  - VSCode
  - WebStorm
  - IntelliJ IDEA
---

许多项目脚手架默认就会把src目录添加一个`@`别名，项目中实际引入时，虽然可以精简路径，但也带来一个很麻烦的问题：
IDE无法识别这些别名，因此导致无法自动完成路径、无法识别引用资源的输出、出现不必要的告警等情况。

偶然发现vscode的web项目里有一个`jsconfig.json`文件，如：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "target": "ES6",
    "module": "commonjs",
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```
只要有这个文件，vscode就可以正常识别出别名了。

后来发现JetBrains家的IDE更简单，配置指定一下就行：

![](./1.png)

在项目设置的webpack标签页里，将配置文件指向`<projectRoot>/node_modules/@vue/cli-service/webpack.config.js`即可。

保存并重新打开项目以后，不只`src`，所有的别名比如`utils`等等都可以被正常识别。

其实这都已经写在`vue-cli3`的[文档](https://cli.vuejs.org/zh/guide/webpack.html#以一个文件的方式使用解析好的配置)里了，只是原始表述不太直观，被我一直忽略了。
