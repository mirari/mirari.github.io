---
title: CSS3实现转盘抽奖
date: '2019-06-25 11:11:20'
categories:
  - Vue
tags:
  - Vue
  - CSS3
---

最近有个转盘抽奖的需求，搜了一下现有的轮子，有的是用jQuery的动画函数实现的，有的是用canvas绘图然后再用高频率的setTimeout调用旋转方法，前者太老了没法简单移植到vue项目，后者感觉性能表现可能不会太好。

也有一些用CSS动画的方案，设计了加速-匀速-减速三个动画，再计算偏转角度让三个动画尽可能无缝衔接，但我感觉绕了大远路，应该有更简单轻量的实现方案。

个人更倾向于用transition来实现，不过网上的例子感觉还不够好，有的倾斜文字都没有对齐，最后还是自己手写了一个。

核心思路是用transition以及rotate实现旋转动画，使用transition-origin和rotate绘制出定位较为精确的轮盘奖项，同时支持动态设置奖品数量。

<iframe height="600" style="width: 100%;" scrolling="no" title="lucky wheel by vue" src="https://codepen.io/mirari/embed/XLgBQP?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mirari/pen/XLgBQP">
  lucky wheel by vue</a> by mirari (<a href="https://codepen.io/mirari">@mirari</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
