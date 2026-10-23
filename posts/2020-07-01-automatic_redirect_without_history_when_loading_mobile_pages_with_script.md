---
title: 移动端页面加载时使用脚本自动跳转不会产生历史记录
categories:
  - 学习笔记
tags:
  - HTML
  - 移动端
  - 网页浏览器
date: '2020-07-01 18:06:25'
---

最近遇到这样一个需求：

- 打开当前页面时，可能会带上一个参数`pid`。

- 页面初始化时，如果发现存在此参数，就立刻跳转到其对应的外部页面。

- 当用户从外部页面后退时，可以回到当前页面，此时正常显示页面内容。

我的实现方式是：

- 用`hash`传递`pid`。

- 在页面入口脚本中，如果`hash`中没有`pid`，就正常渲染页面。

- 如果发现存在`pid`，就不渲染页面内容，而是通过`ajax`从后台获取`pid`对应的URL。然后从`location.hash`里去掉`pid`，再修改`location.href`进行跳转。

在PC端Chrome下测试正常通过，但在手机浏览器中出现了问题。

跳转到新页面后，按后退时不会回到当前页。在微信浏览器里，后退会直接关闭，在小米自带浏览器、夸克浏览器里，后退会回到标签页的初始页，移动端Chrome还是正常。

上百度搜了下，尝试了以下方案，均无效：

- 加`setTimeout`延时再跳转
- 使用`location.assign()`代替`location.href`赋值
- 使用`history.pushState`手动写入当前页面URL后再跳转
- 在`window.onload`里执行判断并延时跳转
- 在`window.onload`里延时执行一个模拟点击事件并在该元素的点击回调中执行跳转

这其中倒是发现一个奇怪的现象，就是在延时跳转前，如果手动点击过页面任意位置，表现就会一切正常，新页面后退可以正常返回当前页，完全符合需求预期。

但是，使用`dispatchEvent`模拟出来的点击事件不行。

与之前做全屏api时遇到的问题类似，应该是浏览器有某种策略，要求`history`的操作只能在用户的真实点击操作中执行。

但奇怪的是搜了很多中文页，没有一个提到这样的问题。

最后在StackOverflow上找到了一些解答（类似问题同样很少，但总算有答案）：

[HTML标准](https://html.spec.whatwg.org/multipage/history.html#location-object-setter-navigate) 文档对`history`的使用有一些规范：

> If any of the following conditions are met, let replacement flag be unset; otherwise, let it be set:
>
> - This `Location` object's [relevant `Document`](https://html.spec.whatwg.org/multipage/history.html#relevant-document) has [completely loaded](https://html.spec.whatwg.org/multipage/parsing.html#completely-loaded), or
> - In the [task](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task) in which the algorithm is running, an [activation behavior](https://dom.spec.whatwg.org/#eventtarget-activation-behavior) is currently being processed whose `click` event's `isTrusted` attribute is true, or
> - In the [task](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task) in which the algorithm is running, the event listener for a `click` event, whose `isTrusted` attribute is true, is being handled.

大致的意思是：

如果满足以下任意条件之一， `location`对象的`replacement`标记置为默认，否则置为true。

（换句话说，如果不满足以下条件，对`location`进行任何操作，都不会产生新的历史记录）

- `location`对象所在的文档已经`完全加载`
- `location`的修改操作由`click`事件触发，且事件的`isTrusted`属性为`true`（也就是用户的真实点击操作）

英文不行，没有找到`完全加载`的精确定义。但我推测对遵循HTML标准的浏览器来说，只有用户与页面产生互动，才表示页面真的已经“完全加载”了。

在用户对页面进行操作前，只有最终展现的页面才被认为是有效页面，之前的所有中间跳转都应该被忽略，不计入历史记录，这样才能避免后退行为出现死锁。

我对这种设计表示理解，这段HTML标准的定义证实了我的推测。因此，原本预想的方案是走不通的，我只能调整需求了。

最终方案是增加一个跳转中间页，由用户点击来进行跳转。

话说Chrome没这个问题，说明Chrome在这一条上其实没有遵循HTML标准规范？
