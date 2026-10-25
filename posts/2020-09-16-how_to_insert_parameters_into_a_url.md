---
title: 如何在一段URL中插入参数
categories:
  - 学习笔记
tags:
  - HTML
  - 浏览器
date: '2020-09-16 11:17:03'
---

有一个很简单的需求如下：

给你一段URL，在其中插入一些参数，并返回新的URL，如何实现？

这里的参数，有时候称为`query`，有时候称为`params`，一般称为`search`，指的是

`http://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument`

中的`key1`和`key2`。

最近正在对接阿里云的金融级实人认证，在传递认证成功回调页时就遇到了这样一个问题，大厂有时也会考虑得不全面。

#### 第一层： 直接拼

```javascript
import qs from 'query-string'
function resolve (url) {
  const params = qs.stringify({ a: 1, b: 2 }) // a=1&b=2
  return url + '?' + params
}
```

实际业务中，90%的场景这样写没问题，但如果url的值是这样的：
```
http://taobao.com/?c=3&d=4
```
最终结果就是
```
http://taobao.com/?c=3&d=4?a=1&b=2
```
将这段URL中的search解析，得到的结果是
```javascript
{
  c: '3',
  d: '4?a=1',
  b: '2',
}
```
显然不符合预期。

#### 第二层： 兼容已存在的search

```javascript
import qs from 'query-string'
function resolve (url) {
  const params = qs.stringify({ a: 1, b: 2 }) // a=1&b=2
  return url + (url.includes('?') ? '&' : '?') + params
}
```

看上去问题似乎解决了，很多人也只考虑到这一层，但现在还有这样一种url：
```
http://taobao.com/#/xxx
```
尤其是单页应用，这个形式的hash路由非常常见。

如果只是简单地拼接到URL尾部：
```
http://taobao.com/#/xxx?a=1&b=2
```
将这段URL中的search解析，得到的结果是

```javascript
{}
```
可以看到拼接的参数根本没跑到search里面去。

也就是说，只要URL中出现了`#`，这之后出现的`?`就不会被视作search的起始标志，而是hash的一部分。

如果URL再复杂一点，比如:

```
http://taobao.com/?c=3&d=4#/xxx
```

上面的拼接会变成:

```
http://taobao.com/?c=3&d=4#/xxx&a=1&b=2
```

不但没有按照预期插入参数，还破坏了原本的hash结构。

实际上，以vue-router为例，它的路由系统中恰好就用到了hash中的`?`。

比如：

```
http://example.com/user/:foo/info?c=3&d=4#/xxx?a=1&b=2
```

在vue-router里，`xxx`是路由的path，`foo`被称作params，`a`和`b`被称作query，分别可以通过
`route.params`和`route.query`获取。

`#`之后可以接任意字符串，`?a=1&b=2`只是路由自己定义的一套内部规则，为路由传参服务。

而`c`和`d`才是search，需要从`location.search`中解析。

如果后端接收了这样一段GET请求，hash后面的东西都会被抛弃，只有search可以被接收和解析。

因此，插入参数不能出现在`#`之后，也就是说，简单地在URL后面拼接字符串是不行的。

#### 第三层： 只处理search

```javascript
import qs from 'query-string'
function resolve (url) {
  const params = qs.stringify({ a: 1, b: 2 }) // a=1&b=2
  const urlObj = new URL(url)
  urlObj.search += urlObj.search.startsWith('?') ? '&' : '?' + params
  return urlObj.href
}
```

这样就可以处理上面的复杂情况了。

使用URL对象是一个讨巧的办法，将url字符串解析为URL对象后，可以只修改它的search属性而不影响其他部分。

在`axios`的源码中，我们可以看到另一种标准实现：

```javascript
function buildURL(url, params) {
  if (!params) {
    return url;
  }

  // params序列化过程略
  var hashmarkIndex = url.indexOf('#');
  if (hashmarkIndex !== -1) {
    url = url.slice(0, hashmarkIndex);
  }

  url += (url.indexOf('?') === -1 ? '?' : '&') + params;

  return url;
};
```

思路很简单，就是把序列化后的params插入到URL的末尾，但若存在hash，则插到hash之前，若存在search，则连接符改用`&`。

相关链接：

[What is a URL](https://wiki.developer.mozilla.org/zh-CN/docs/Learn/Common_questions/What_is_a_URL)

[URL对象](https://wiki.developer.mozilla.org/zh-CN/docs/Web/API/URL)

[Vue-router 路由对象](https://router.vuejs.org/zh/api/#%E8%B7%AF%E7%94%B1%E5%AF%B9%E8%B1%A1)
