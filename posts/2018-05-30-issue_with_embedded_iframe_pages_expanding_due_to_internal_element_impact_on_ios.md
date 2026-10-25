---
title: 内嵌iframe页面在IOS下会受内部元素影响自动撑开的问题
date: '2018-05-30 16:15:07'
categories: 学习笔记
tags:
  - HTML
  - CSS
  - 移动端
---

IOS下的webview页面，内嵌iframe元素，将其样式指定为宽高100%：
```css
.iframe {
  width: 100%;
  height: 100%;
}
```
在安卓下运行均无问题，但是在IOS下会出现异常。

具体表现为iframe页面内的子元素一旦超出原先的边界，只要能影响到html元素的宽高，就会自动撑开iframe，即使html元素设置了`overflow:hidden`也没用。
比如一个body元素下的弹层需要从下往上滑动进场，这个弹层的位置就会导致html高度的变化，因此页面底部的tabbar就会在弹层运动期间先消失再出现。

解决方法就是使用具体的宽高数值锁定iframe元素：
```javascript
function onLoadIFrame (index) {
  // 修复IOS下轮播图初始化瞬间会让iframe宽度自行扩大问题
  if (this.ENV.isIOS) {
    const iframe = this.$el.querySelector('#iframe' + index)
    iframe.style.width = iframe.clientWidth + 'px'
    iframe.style.height = iframe.clientHeight + 'px'
  }
}
```
