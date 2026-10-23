---
title: 微信小程序迁移支付宝踩坑
categories:
  - 学习笔记
tags:
  - 小程序
  - 支付宝
date: '2023-06-02 11:15:15'
---

需要迁移的小程序是原生的微信小程序，涉及大量微信小程序的原生api和功能，工作量不小。

首先还是要用到迁移工具[Antmove](https://ant-move.github.io/)，可惜这个工具已经多年未更新，生成的代码必然是没法直接运行的，而且后来的使用中发现，有一些支付宝原本不支持的功能做了降级适配，实际上现在已经支持了，而Antmove做的处理反而会出问题。

基础的迁移操作和差异对比可参考以下文章：

[一些微信小程序和支付宝小程序对应的差异](https://juejin.cn/post/6844904178012127246)

[微信小程序迁移到支付宝记坑](https://blog.csdn.net/weixin_41476562/article/details/127331168)

这边只记录我遇到的问题：

### 样式隔离

目前只能做到自身不影响外部，但外部始终能影响内部。

因此所有自定义组件的样式如果起得过于简单，一旦冲突，都需要重新命名。

如果有的页面样式很多，其中有些希望影响内部，有些又不希望影响的话，只能重命名那些不希望影响组件的，确保样式名唯一。

[页面样式隔离](https://opendocs.alipay.com/mini/framework/page-acss#%E9%A1%B5%E9%9D%A2%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB)

[如何防止页面样式影响到组件内部？](https://open.alipay.com/portal/forum/post/79501017)

### 样式兼容

`background-image`不支持，需要改为image组件写法。

### 获取子组件 selectComponent

Antmove抹平了查找子组件的差异，从而保留了`selectComponent(s)`方法。

由于要尽量保留微信原生写法，这里后面提到的获取子组件都指的是包装过的`selectComponent`。

#### 生命周期

在生命周期的onLoad和onShow时不能使用查找子组件，此时拿不到对象，需要套一层`setTimeout(() => {}, 0)`

#### 抽象节点

无法获取到抽象节点，只能改写法，使用ref来实现，参考如下：
```html
<abstracta:for='{{list}}'ref="refNavList"id='nav_list'a:key='{{categoryId}}'a:if='{{index===selected}}'item='{{item}}'ref-numbers='{{list}}'onOnClickCard='onClickCard'>
</abstract>
```
```javascript
addMore(){
  constlist=this.$navList
  if(list){
  list.addMore()
  }
},
refNavList(ref){
  //存储自定义组件实例，方便以后调用
  this.$navList=ref;
},
```


### 子组件的点击

直接写`<foo onTap="onTap">`是无法触发的。需要在自定义组件外面套一层view再加点击事件，或者自定义组件做转发：
```html
<view class="子组件最外层的view" onTap="onTap">...</view>
```
```javascript
    onTap (e) {
      this.triggerEvent('tap', e);
    },
```

> 注意：自定义组件的事件（如 onTap 等），并不是每个自定义组件默认支持的，需要自定义组件本身明确支持才能使用。

### npm的使用

在微信中使用npm库，开发工具会将npm库的入口文件重新打包输出并放到转换目录对应文件夹的根路径下。

而在支付宝中，npm包在引入后不会出现转换目录，而是直接使用node_modules下的代码了。

因此如果代码中出现了对npm的引用，其引入路径全部都需要更改。

考虑到有些npm库的代码也是原生微信小程序的，同样需要转换代码，最终的处理方案是将所有npm包都手动拷贝到指定目录，一起参与antmove的转换，并手动修改所有涉及的引入路径。

### Behavior

支付宝中不存在该对象，只能用`Mixin`对象和`mixins`属性平替。

### 复制到剪贴板api

不知道出于什么实际原因，文档里虽然还有，但该接口**已废弃**。小程序中如果有类似需求，只能舍弃。

> 目前`my.setClipboard`这个api支付宝开放平台文档已下架，已不支持使用

[my.setClipboard 在预览和真机调试下无效](https://open.alipay.com/portal/forum/post/55401022)

### 查找元素 createSelectorQuery

与微信不同，不支持查询子组件内部元素的位置信息，只能查原生组件的。

所以需要改变写法，先在子组件上实现一个`createSelectorQuery`相关逻辑，然后让父组件用`selectComponent`获取子组件，再执行其方法获取结果。

另外Antmove对`createSelectorQuery`做了兼容性处理，因为早期的支付宝原生方法不支持局部查询，所以使用`this.createSelectorQuery`时也会变成全局查询。现在的版本需要移除此适配。

### 可选操作符

比如`a?.b`和`a ?? b`语法目前都不支持，据说2023年6月后会支持。

目前只能手动改成` && `和` || `。

### 导航栏

#### 不能隐藏返回、首页按钮

不能完全自由地用脚本控制返回、首页按钮的显隐。因此，原本在微信上自定义过返回、首页按钮的自定义导航栏，只能改回系统按钮。

以下是官方回复：

Q：导航栏左上角的 “返回小程序首页” 按钮和 “返回上一页” 按钮何时会展示？

A：当页面为最底层页面（页面栈深度为 1 ），且页面为非首页、非 tabBar 页面时，标题栏左上角默认展示 “返回首页” 按钮；
当页面栈深度大于 1 时，默认展示 “返回上一页” 按钮
页面栈 是小程序框架管理界面的方式，可以使用 my.getCurrentPages().length 查看当前页面栈深度。

Q：如何隐藏标题栏上的返回按钮？

A：暂无 API 可以直接隐藏页面的返回上一页按钮；可以先通过 my.reLaunch 进行页面跳转，使用页面栈深度为 1，返回上一页按钮自然隐藏。如有必要，在目标页面里调用 my.hideBackHome，将返回小程序首页按钮也隐藏掉。


而用于获取左侧按钮和右侧菜单按钮的api写得像是一坨屎，有很多历史包袱，且没有官方示例。

以下是我的代码供参考：

```javascript
export function getHeader () {
    const {
        titleBarHeight,
        statusBarHeight,
    } = wx.getSystemInfoSync()
    let titleBarLeft = 30
    if (wx.canIUse('getLeftButtonsBoundingClientRect')) {
        const {
            backButtonIcon,
            backButtonInteractive,
            homeButtonIcon,
        } = wx.getLeftButtonsBoundingClientRect();
        titleBarLeft = 0
        if (homeButtonIcon) {
            titleBarLeft += homeButtonIcon.right
        } else if (backButtonInteractive) {
            titleBarLeft += backButtonInteractive.right
        }
    }
    return {
        titleBarHeight,
        statusBarHeight,
        titleBarLeft,
    }
}
```
#### 不能自定义前景色

首先，在页面的json配置文件中只能修改背景色`backgroundColor`。微信上的前景色属性`titleBarColor`并不会生效。

而背景色只要不为白色`#FFFFFF`时，前景色就会被强制固定为白色。

我这里原本的UI配色是将背景色设置为较浅的灰色`#F7F7F7`，结果标题文字变成白色完全看不清。

解决方案是把导航栏的颜色配置挪到onLoad时用脚本修改：

```javascript
wx.setNavigationBar({
  backgroundColor:'#f7f7f7',
  frontColor:'#333333',
})
```

然后又发现前景色`frontColor`实际上只接受黑白两种色值。
这个写法会提示不合法，只能把`frontColor`改为`#000000`

```javascript
wx.setNavigationBar({
  backgroundColor: '#f7f7f7',
  frontColor: '#000000',
})
```

### Antmove处理

#### mixins

支付宝现在已原生支持，但antmove做了适配，反而导致不兼容。

需要到`__antmove/component/classSubdirectory/component.js`找到以下代码，注释掉对`options.mixins`属性的删除

```javascript
const behaviors = options.behaviors || []
const mixins = options.mixins || []
const _export = options.export || ''
delete options.behaviors
// delete options.mixins
const retMixins = {}

_opts.observerObj = {}
_opts.observersObj = {}
_opts.behaviorsArr = []

processBehavior(retMixins, behaviors, _opts.behaviorsArr)
processBehavior(retMixins, mixins, _opts.behaviorsArr)
mergeOptions(retMixins, options)
processBehaviorId(behaviors)
processBehaviorId(mixins)
```

#### createSelectorQuery

支付宝现在已原生支持，但antmove做了适配，反而导致不兼容。

需要到`__antmove/component/classSubdirectory/component.js`找到以下代码，注释掉对`createSelectorQuery`的包装。

```javascript
fnApp.insert('onInit', function() {
      this.__wxExparserNodeId__ = nextUid()
      // processIntersectionObserver(this)
      // this.createSelectorQuery = function() {
      //   if (config.env !== 'production') {
      //     console.warn(
      //       '支付宝createSelectorQuery不支持限定选择器的选择范围，如使用，请保证对应选择器使用的唯一性',
      //     )
      //   }
      //   return createSelectorQuery.fn()
      // }
      for (const method in this) {
        if (typeof this[method] === 'function') {
          this[method] = this[method].bind(this)
        }
      }
```

### 客服按钮

微信现在有好几种形式发起客服，比如企业微信，但支付宝下只有一种，就是放个按钮让用户点击。

需要覆写这个按钮的样式才能实现UI适配，否则很丑。

为了有一个清晰且低耦合的页面结构，更好的做法是自定义样式后，把一个透明的客服按钮盖在上面。

这样客服按钮可以有多种表现形式，而接入写法很简单，在响应范围最外层加上`contact-button-wrapper`样式，再在内部最末尾加上`contact-button`即可。

参考如下: 

```css
.contact-button-wrapper {
    position: relative;
}

.contact-button-wrapper contact-button {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    z-index: 1;
}
```
```html
<view class="contact-button-wrapper">
  如遇到定位不准确等问题，请<text class='text-primary'>联系客服</text>
  <contact-button
    tnt-inst-id="你的客服id"
    scene="你的客服scene"
  />
</view>
```

### 分享 showShareMenu

在微信中由于限制滥用，从某个时间点起这个按钮已经不具备弹出分享页面的功能了，只是控制右上角分享按钮是否展示。

用户只能通过open-type的按钮和右上角来手动操作打开分享页面。

但是文档始终没有修改，容易引起误会。

但支付宝中，这个api仍然可以唤起分享页面，并且没有操作来源的限制。

而且文档删除了showShareMenu，改名为showSharePanel，但前者仍然可用。

因此在微信中习惯性地在onShow回调里打开右上角分享按钮，在支付宝中会变成弹出分享页面。

需要删除该语句。

### 数据变化观测器 observer

支付宝已原生支持。

但某些场景的表现与微信有不同，需要仔细检查。比如：

页面属性a有一个数组子属性b，这个数组b被子组件监听。

当数组成员`b[c]`被修改时，observe不会触发。

数组被重新赋值`b = [...b]`，也不会触发。

页面属性被旧对象组装后重新赋值`a = {...a, b}`，也不会触发。

只有该页面属性被全新对象赋值时才会触发。(怀疑跟diff算法有关)

因此在所有值变化结束后，需要靠`lodash.deepCopy`复制对象，然后重新setData。
