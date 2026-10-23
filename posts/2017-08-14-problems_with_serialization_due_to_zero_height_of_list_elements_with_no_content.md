---
title: 列表元素无内容时高度为0导致串行的问题
date: '2017-08-14 22:01:04'
categories: 学习笔记
tags:
  - HTML
  - CSS
---

如果有一组标题-内容形式的数据需要展现，用table感觉太笨重了一些，最符合语义化的做法应该是使用`dl`元素。

比如下面这个例子，展现了一个水平列表，样式定义来自bootstrap：

<!-- more -->

<iframe width="100%" height="300" src="//jsfiddle.net/mirari/xdf8qzzf/1/embedded/html,css,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

可以看到一个问题，当某些数据没有值时，它所在的dd元素高度会变成0，结果下面行的数据会顶上来，造成串行。

一种笨办法是在数据渲染时强制给所有`dd`元素一个`&nbsp;`,利用空格强行撑开元素高度。但是这种做法会影响页面处理逻辑，既麻烦又不整洁。

另一种做法是修改对齐方式：

<iframe width="100%" height="300" src="//jsfiddle.net/mirari/xdf8qzzf/2/embedded/html,css,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

表面上看是解决了问题，但是当缩小浏览器，使内容过长超出页面宽度导致换行时，就可以发现内容的文字跑到了标题那边，对强迫症来说很难受。

最完美的做法是使用CSS伪类为元素添加内容：

<iframe width="100%" height="300" src="//jsfiddle.net/mirari/xdf8qzzf/3/embedded/html,css,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

伪类的content属性如果填的是`''`或者`&nbsp;`都会被忽略，无法生效。所以这里用的是Unicode的零宽无连接符。`\200c`和`\200d`分别是零宽无连接符和零宽连接符，分别用于阻止本来会连接的前后两个字符和强行合并本来不会连接的前后两个字符。它们的附加特性非常适合用在这种需要有字符但又希望它看不到的场合。
