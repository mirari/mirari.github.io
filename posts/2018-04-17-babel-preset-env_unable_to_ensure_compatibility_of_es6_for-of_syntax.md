---
title: babel-preset-env无法确保ES6的for..of语法兼容性
date: '2018-04-17 16:42:35'
categories: 学习笔记
tags:
  - babel
  - webpack
---

`babel-preset-env`是现在最主流的babel解决方案，但是前阵子踩到了一个坑。
部分机型在执行到ES6的`for of`语句时就会报错。

原因有两个。

一是`babel-preset-env`默认只转换语法(syntax)，而不会转换全局对象(`Iterator`、`Generator`、`Set`、`Maps`、`Proxy`、`Reflect`、`Symbol`、`Promise`等)和全局对象上的新增方法（`Object.assign`等）。

二是`for of`会被babel编译，编译之后其中会出现Symbol关键字。

所以表面上看`for of`似乎可以使用，但实际上涉及到了新全局对象，从而导致不支持`Symbol`的浏览器报错。

因此，`babel-preset-env`并不像宣传(`你需要的唯一Babel插件`)描述的那样简单，它仍旧离不开那个笨重但好用的`babel-polyfill`。

最终的解决方案是在`.babelrc`中的`env`下添加`useBuiltIns`属性, 值为`entry`:
```
"presets": [
    ["env", {
      "modules": false,
      "useBuiltIns": "entry"
    }]
  ],
```
并在项目的主入口顶部添加:
```
import 'babel-polyfill'
```
这样env会自动精简没有使用到的polyfill，比单纯直接引入polyfill要小一些。


`useBuiltIns`还可以设置为`usage`，也就是在未兼容的环境使用新对象或方法时在当前脚本顶部自动添加polyfill。
