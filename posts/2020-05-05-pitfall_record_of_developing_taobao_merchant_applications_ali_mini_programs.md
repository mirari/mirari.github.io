---
title: 淘宝商家应用（阿里小程序）开发踩坑记录（已弃坑）
categories:
  - 学习笔记
tags:
  - 小程序
  - 商家应用
  - 淘宝
date: '2020-08-07 15:53:55'
---

阿里正在将淘宝无线开放平台等业务整合为商家应用，类似于支付宝小程序，也就是以小程序的形式进行淘宝天猫店铺的展现、营销。

最近正在开发商家应用小程序，踩了无数坑，原本以为微信小程序已经够坑了，没想到这个几乎照搬微信小程序模式的淘宝小程序更坑。毕竟刚起步，抱怨也没用，将我遇到的问题先记录下来，让后来者可以少花一些时间。

微信小程序遇到开发问题时有一个社区平台可以交流。优点是开发者之间可以互相交流，有一些回帖非常有价值；缺点是提问不一定能得到官方解答，很多帖子可能会石沉大海。

而阿里系这边，反馈问题不能通过社区，只能使用工单系统。优点是有问必答，工作日一般半小时内就可以看到回复，几句话说不清的还可以转钉钉详聊；缺点则是回答者对专业问题几乎一窍不通，只能算是小程序开发者与官方平台开发者的传话人，与所有客服系统一样，只会把平台文档里已经有的东西车轱辘话来回说，除非你用明确的语言表示自己这个问题确实不在文档里。而且一旦客服表示问题复杂邀请你进了钉钉详聊，那这个问题可能很快能解答，也可能再也没有回音。另外，工单系统看上去是10年前开发的样子，贴图、贴代码都极不友好，搜索功能也几乎是废弃状态。

再多吐槽一句，文档系统也非常糟糕，V1和V3文档同时存在并运行，很多文档中的链接都没有更新，你会在逐步的浏览中先后打开v1、v3甚至支付宝小程序的文档，而更复杂的TOP接口文档，可能会让你进一步陷入迷惑，甚至连你想要的功能应该属于哪个分类都难以确定。

言归正传，记录下我开发中遇到的问题。

### 发起网络请求

我原本已经封装了一套基于`my.request`的api工具，结果真机一调，发现不能用。

[文档](https://miniapp.open.taobao.com/docV3.htm?spm=a219a.7386797.0.0.5538669adQh0cK&source=search&docId=117502&docType=1)没有删干净，仿微信的`my.request`已经被废弃了。

对于云应用，现在官方强推的唯一用法是`cloud.application.httpRequest`

[https://miniapp.open.taobao.com/docV3.htm?docId=118538&docType=1](https://miniapp.open.taobao.com/docV3.htm?docId=118538&docType=1)

### 父组件不能定义自定义子组件的class

比如
```
<aaa class="test" />
```
这种写法是无效的，父组件定义到自定义组件上的样式会被丢弃。

微信小程序和VUE中，像这样的定义在最终会与组件最外层内部定义的class合并到一起，但在淘宝小程序里就是不行（官方提供的组件倒是可以）。

我的临时处理方式是：
```
<view class="test">
    <aaa />
</view>
```
然后样式写:
```
.test > view
```
如果你用了stylelint之类的校验工具，记得将view这个标签关键字加到白名单。

*也许也可以加一个名叫class的props来迂回实现，待验证*

### 上传图片

上传图片的实现折腾了我很久，而这几乎是所有开发者绕不开的问题，我很诧异官方竟然没有及时更新文档来指出。正确的方法在本节内容的最后，前面的试错方法是行不通的。

首先，[文档](https://miniapp.open.taobao.com/docV3.htm?docId=970&docType=20)确实存在了这样一个接口：`my.uploadFile`

所以我的第一反应就是用它来实现图片上传，微信小程序也是这么做的。

实际上`my.uploadFile`就是一个传递流的HTTP请求，我希望将图片上传到阿里云OSS服务，因此，我需要手写模拟出OSS上传所需的各种参数。

参考了[这篇文档](https://help.aliyun.com/document_detail/92883.html?spm=a2c4g.11186623.2.14.5b5f74b8XlBvll#concept-egs-zv1-kfb)来实现。

注意，这是在小程序客户端实现根据密钥生成签名，私钥暴露到了前端，理论上有安全隐患。

拼完参数以后，还要指定上传服务器地址，也就是HTTP请求的URL。

例如：`https://my-oss-name.oss-cn-hangzhou.aliyuncs.com`

四级域名是阿里云OSS的bucket名称。

折腾完上面这些以后，在本地开发者工具上测试没有问题，但预览和真机调试时发现报错。
错误信息为

```
{errorCode:4,errorMessage: "no premission"}
```

工单反馈才知道，`my.uploadFile`限制了域名。只允许以下域名规则：

```
miniappcloud.taobao.com
media.taobao.com
upload.media.aliyun.com
miniappcloud-common-file.oss-cn-zhangjiakou.aliyuncs.com
\\S\\.alicdn\\.com$
\\S\\.mmstat\\.com$
```

简单来说，就是`my.uploadFile`这个接口只有阿里内部服务可以使用，无法被普通开发者调用，应当屏蔽和废弃。

上传图片现在只有一条路可走，就是改用阿里云开发中的[云存储](https://miniapp.open.taobao.com/docV3.htm?docId=118522&docType=1)

这里问题又来了，文档说，小程序关联云服务，[只能在云开发和云应用里二选一](https://miniapp.open.taobao.com/docV3.htm?docId=118537&docType=1)。

而我们的后台用的就是云应用，难道就不给用云开发里的云存储功能了？

幸好实际使用发现，即使选择了云应用，仍然可以使用云开发的云存储功能。不过，云存储的管理只能在开发者工具中进行。

**注意，每次点击开发者工具中的云开发，都会自动在项目下创建server和client目录，并将项目原来的文件包括node_modules全部挪到client下，如果你不希望目录被改变，记得先启用git，没事别点这个按钮**

云存储的调用就不详述了，但还有一个坑待验证：

使用云存储上传成功后，拿到的是一个cloud协议前缀的内部地址和一个URL。

文档和客服的反馈都表示，这个URL不是永久有效的，也就是你如果想要访问这个文件，需要先调用云存储的[接口](https://miniapp.open.taobao.com/docV3.htm?docId=118518&docType=1)获取临时地址。

这个设计带来一个麻烦的问题，不能直接把存储的图片地址赋值给image组件，因为image所需的URL只能异步获取到，你需要自己再封装一个组件用来显示云存储图片。

不过实际使用发现，上传成功后获得的这个URL到目前为止还没有过期，就先这样用着了。

### 预览和真机调试时，二维码丢失全局参数（2020-05-18似乎已修复）

在编译模式中添加的全局参数，本地调试都能生效，但预览和真机调试时，这些参数都被丢弃了。在编译模式里的配置项只有默认页面是生效的。

询问工单后得知，只能自行添加参数。

首先点击编译成功后得到的二维码图案，获得一串地址，类似这样
```
https://m.duanqu.com?_ariver_appid=xxx&nbsv=0.1.2004151019.52&nbsource=debug&nbsn=DEBUG&channelId=1jOXeERZ54A_2IS7tG_0Co1du_0149_1vA&isRemoteX=true
```
然后需要将全局参数进行url编码，比如原始参数
```
dev=true&id=123
```
编码后变成
```
dev%3Dtrue%26id%3D123
```
作为query参数的值，拼接到url上，变成
```
https://m.duanqu.com?_ariver_appid=xxx&nbsv=0.1.2004151019.52&nbsource=debug&nbsn=DEBUG&channelId=1jOXeERZ54A_2IS7tG_0Co1du_0149_1vA&isRemoteX=true&query=dev%3Dtrue%26id%3D123
```

最后在浏览器打开这段地址，然后进行扫码。

每次真机调试都要这么来一次，非常麻烦，不知道什么时候才能修正。

### PC端基础组件overlay运行不正常

PC端尝试使用`overlay`组件实现弹窗效果。

要弹出一个居中的`overlay`，需要这样配置：

```
<overlay
  visible="{{ visible }}"
  onRequestClose="onClose"
  align="cc cc"
  hasMask
>
弹窗内容
</overlay>
```

随后发现两个致命问题：

1. overlay层级无法修改

弹窗内部如果有进行系统级弹窗的操作，比如执行my.chooseImage后，系统弹出的选择相册菜单被盖在了当前弹层下方。
并且文档中没有关于overlay层级调整的相关方法。

2. overlay中有任意自定义组件，第二次弹出时必定崩溃

比如最简结构

```
<overlay visible={{visible}}>
  <aaa />
</overlay>
```
当visible第二次被修改为true时，app崩溃，错误提示为

```
worker render components is not sync! can not find id from path: 1-1-1-3-1:/src/components/aaa/index
```

这个问题客服只说转给开发了，但至今没有反馈，因此`overlay`无法被实用，只能自己实现一个弹窗组件。


### 自定义组件的样式是全局生效的

page的样式只在page内生效，这是有共识的，但我没想到的是component下定义的样式竟然会是全局生效的。

不同的自定义组件中出现同名样式时，会互相影响和覆盖。

而商家PC端现在官方强推的是使用扩展组件里的路由系统（顺带一提这路由系统非常简陋，使用又繁琐），
如果使用了路由系统，就意味着所有页面都是component，这时候这种全局scope就会严重影响开发。

临时的解决方式是，手动在组件样式最外层套上当前组件的class（用scss会比较方便）

### PC端千牛使用远程调试时无法收到调试信息

按照文档配置：

[https://miniapp.open.taobao.com/docV3.htm?docId=118310&docType=1](https://miniapp.open.taobao.com/docV3.htm?docId=118310&docType=1)

能正常从千牛中启动预览包，能打开chrome上的devtool标签页，并且关闭当前的预览应用时，能看到chrome弹出连接断开的提示。

但预览应用中执行的各种输出控制台信息，在chrome调试标签页都没有反应，看不到任何变化和输出。

工单反馈说：

*目前发现 chrome 80.0.3985.0 及以上版本（也可能是79以上，边界没有定位得很精确），能连接上小程序js环境，甚至能打断点调试代码，但就是看不到console输出，直接在console里输入 console.log，也是不输出的。此问题已知待解决，请尝试用低版本chrome绕过。*

我不想装旧版本的chrome，有精力的同学可以试一下。

### 商家后台千牛PC端应用上传后，预览码无法在千牛客户端打开

商家后台千牛PC端应用上传成功，在版本管理-开发阶段中可以查看到，性能任务已通过，但查看并复制预览码后，在千牛的开发者设置中粘贴预览码并打开时，提示页面不存在。

在本地调试时点击预览后复制二维码并粘贴打开是正常的。

这实际上并不是小程序本身的问题，而是千牛端即使处于登录状态，也可能有什么类似session的东西过期了，需要手动重新登录一下千牛。

### hideLoading以后执行showToast无效

文档里写了

> 在 my.showToast 之前调用 my.hideLoading，toast 被 my.hideLoading 覆盖，将不展示。

如果我将异步请求封装为公共方法，在请求前showLoading，请求后hideLoading，结果就无法在请求完成后显示结果。

工单没有对这个问题做出有效解答，实际测试发现在开发者工具上模拟时不会弹出toast，但真机却可以正常弹出。

### 分享在path里添加的参数在终端打开时取不到

这算得上是一个大坑。

实际测试发现`app.onLoad`里取不到，`page.onLoad`里才有。

通过分享打开小程序时，得从页面onload的query里取参数。
```
onLoad(query){
  console.log(query)
}
```
通过扫码打开时，得从app的options里取参数。
```
onLoad(options) {
  console.log(options.query)
}
```

这里有一个很关键的问题，对商家应用来说，启动参数是不可或缺的，比如营销活动的id，没有id，应用就不能进行任何实际操作或展示。

因此，我只能将初始化动作变成一个分几步走的过程：

1. 创建全局的初始化promise对象
2. 从`app.onLoad`中获取参数，如果没有取到关键字，则跳过
3. 从`page.onLoad`中获取参数，如果还是没有取到关键字，则进入模拟数据展示，使用模拟数据进入下一步

**还记得前面二维码不带参数的问题吗？现在提审时不能像微信那样为某个版本添加编译参数，只能把组装好参数的二维码对应的URL贴到审核备注里，而应用审核者经常不看备注直接扫码打开应用，他看到一片空白时，就会拒绝通过。为了增加过审几率，必须制作一个模拟数据展示模式。**

4. 根据参数进行初始化动作，比如判断运行环境，初始化api接口cloud实例，将活动id放到globalData里等等。最后将初始化promise对象置为resolved。
5. app或者页面的后续动作都要在初始化promise对象完成后进行。关键在于cloud实例的初始化也是异步的，只有在cloud初始化完毕后，才能执行获取数据等异步请求操作。

### PC端千牛只能在page.onLoad里接受参数

与前一个问题有微妙的不同。

生成的二维码地址如：
```
https://m.duanqu.com?_ariver_appid=xxx&nbsv=0.1.2004161617.2&nbsource=debug&nbsn=DEBUG&query=dev%3Dtrue
```
并不能在app的onLoad里拿到query信息。

只能在page的onLoad里拿到**整个options**对象。

区别在这里，文档描述的正常场景中，onLoad的入参应该是一个query对象。我不确定这种不协调的差异什么时候会被修正，建议将处理语句写成:

```
let query = options.query || options
```

### 返回结果只有一个false，会自动变成空对象

后台返回的内容要注意了，比如有个接口是检测用户是否会员或者检测用户剩余游戏次数，不要直接返回一个boolean或者number对象。

因为`cloud.application.httpRequest`这个接口我估计会用一个if条件来判断后台返回的data。如果后台返回false或者0，前端拿到的最终结果总是一个空对象`{}`，前端也用if判断就会出错。

因此，确保所有接口返回的内容都是一个复杂对象。

### 跳转到店铺固定页接口天猫无反应

使用`my.tb.navigateToTaobaoPage`跳转到店铺会员页，在手淘上正常，天猫上无反应，且没有错误提示

工单答复为：
> my.tb.xxx 接口预计在月底版本支持天猫客户端

### image的相对路径是相对于页面而不是当前组件的

这个问题也很恶心。等于说组件不能有独属于自己的图片存放目录，无法实现解耦。

工单答复也是建议图片统一放到assets目录下，或者放到OSS上。

我反问1耦合性怎么办，2远程请求影响加载速度怎么办。

我认为这明显是个BUG，客服只说已反馈给开发，目前无下文。

### 分享设置的content自定义淘口令无效

分享的使用[文档](https://miniapp.open.taobao.com/docV3.htm?spm=a219a.7386653.0.0.68f2669aEPMvtV&docId=118186&docType=1)

内容实际上是从支付宝小程序文档里复制的，里面的描述都还是`吱口令`

工单答复是，暂不支持，文档会去掉（截止发文时还没去掉）

### 关注店铺

需要到C端模板下的权限管理中，申请

> 商家应用商品收藏、店铺关注权限包

注意不是最外面应用管理下的商家应用，那里的权限管理中没有该权限包

关注店铺相关接口为

`https://miniapp.open.taobao.com/docV3.htm?docId=913&docType=20`

注意这里的id，不是店铺Id，而是店铺所属卖家Id。

需要再申请一个卖家信息查询权限包，由服务端查询并返回给消费者端。

实际使用时，安卓下测试通过。

IOS下执行出错，错误为：

```
{ code:2 , errorMessage: "参数错误：id" }
```

另外，IOS下的Error对象字段也与安卓不同，不是标准的Error对象。

安卓下返回的错误提示文字字段为message，而IOS下是errorMessage。

后来发现原来是id不能为字符串，必须是number类型。

### 权益中心插件配置

发放优惠券需要用到权益中心。

权益中心插件，本地模拟器不能运行，只能在PC千牛上调试。

同样的，因为chrome版本问题导致看不到调试信息，目前还未修复。

使用过程中发现无法以组件形式引入插件，折腾半天以后发现，原来是文档不一致。

[https://console.open.taobao.com/?spm=a219a.7386653.0.0.143d669aiBAGsb#/market/plugin?tabKey=document&pluginId=3000000002026202](https://console.open.taobao.com/?spm=a219a.7386653.0.0.143d669aiBAGsb#/market/plugin?tabKey=document&pluginId=3000000002026202)

插件中心的这篇文档害人不浅。

```
"plugins": {
    "myPlugin": {
      "version": "0.0.1",
      "provider": "3000000002026202"
    }
  }
```

注意`app.json`不要跟着示例写，provider上没有双括号。

然后插件文档里说支持组件形式调用，实际上是不行的。使用文档以

[https://miniapp.open.taobao.com/docV3.htm?docId=117142&docType=1](https://miniapp.open.taobao.com/docV3.htm?docId=117142&docType=1)

这篇为准。

### 页面配置transparentTitle

设置`transparentTitle`的值为always时，安卓下表现正常。

但IOS上向上滑动时，会随着滑动在顶部出现白色导航栏，且导航栏上面没有标题文字，也不能用`titleBarColor`修改文字颜色，只是一个白色长条。

结果因为这个长条，审核无法通过。

需要将该字段删除，默认就是不显示导航栏。

### PC端表单组件文档未完善，validate几乎无法使用

文档中`validateState`的描述中提到：

`校验状态，如不设置，则会根据校验规则自动生成`。

但并无文档或例子说明校验规则在哪里配置。

### 已弃坑

由于上架应用几乎无人问津，业务已中止，弃坑了╮(╯▽╰)╭
