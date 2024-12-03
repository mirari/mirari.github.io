import{_ as d}from"./ValaxyMain.vue_vue_type_style_index_0_lang-BWN6FZjJ.js";import{f as u,w as e,e as h,A as c,ag as l,o as g,a as o,H as r,U as a}from"./app-O6veFoRw.js";import"./YunComment.vue_vue_type_style_index_0_lang-BdmCVZ97.js";import"./index-C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-6OskRlK9.js";import"./post-CxZOEfth.js";const V={__name:"2019-06-25-implementing_spin_wheel_lottery_with_css3",setup(S,{expose:p}){const n=JSON.parse('{"title":"CSS3实现转盘抽奖","description":"","frontmatter":{"title":"CSS3实现转盘抽奖","date":"2019-06-25 11:11:20","categories":["Vue"],"tags":["Vue","CSS3"]},"headers":[],"relativePath":"pages/posts/2019-06-25-implementing_spin_wheel_lottery_with_css3.md","path":"/home/runner/work/blog/blog/pages/posts/2019-06-25-implementing_spin_wheel_lottery_with_css3.md","lastUpdated":1733198069000}'),i=c(),s=n.frontmatter||{};return i.meta.frontmatter=Object.assign(i.meta.frontmatter||{},n.frontmatter||{}),l("pageData",n),l("valaxy:frontmatter",s),globalThis.$frontmatter=s,p({frontmatter:{title:"CSS3实现转盘抽奖",date:"2019-06-25 11:11:20",categories:["Vue"],tags:["Vue","CSS3"]}}),(t,m)=>{const f=d;return g(),u(f,{frontmatter:h(s)},{"main-content-md":e(()=>m[0]||(m[0]=[o("p",null,"最近有个转盘抽奖的需求，搜了一下现有的轮子，有的是用jQuery的动画函数实现的，有的是用canvas绘图然后再用高频率的setTimeout调用旋转方法，前者太老了没法简单移植到vue项目，后者感觉性能表现可能不会太好。",-1),o("p",null,"也有一些用CSS动画的方案，设计了加速-匀速-减速三个动画，再计算偏转角度让三个动画尽可能无缝衔接，但我感觉绕了大远路，应该有更简单轻量的实现方案。",-1),o("p",null,"个人更倾向于用transition来实现，不过网上的例子感觉还不够好，有的倾斜文字都没有对齐，最后还是自己手写了一个。",-1),o("p",null,"核心思路是用transition以及rotate实现旋转动画，使用transition-origin和rotate绘制出定位较为精确的轮盘奖项，同时支持动态设置奖品数量。",-1),o("iframe",{height:"600",style:{width:"100%"},scrolling:"no",title:"lucky wheel by vue",src:"https://codepen.io/mirari/embed/XLgBQP?default-tab=html%2Cresult",frameborder:"no",loading:"lazy",allowtransparency:"true",allowfullscreen:"true"},[r(" See the Pen "),o("a",{href:"https://codepen.io/mirari/pen/XLgBQP"}," lucky wheel by vue"),r(" by mirari ("),o("a",{href:"https://codepen.io/mirari"},"@mirari"),r(") on "),o("a",{href:"https://codepen.io"},"CodePen"),r(". ")],-1)])),"main-header":e(()=>[a(t.$slots,"main-header")]),"main-header-after":e(()=>[a(t.$slots,"main-header-after")]),"main-nav":e(()=>[a(t.$slots,"main-nav")]),"main-content":e(()=>[a(t.$slots,"main-content")]),"main-content-after":e(()=>[a(t.$slots,"main-content-after")]),"main-nav-before":e(()=>[a(t.$slots,"main-nav-before")]),"main-nav-after":e(()=>[a(t.$slots,"main-nav-after")]),comment:e(()=>[a(t.$slots,"comment")]),footer:e(()=>[a(t.$slots,"footer")]),aside:e(()=>[a(t.$slots,"aside")]),"aside-custom":e(()=>[a(t.$slots,"aside-custom")]),default:e(()=>[a(t.$slots,"default")]),_:3},8,["frontmatter"])}}};export{V as default};