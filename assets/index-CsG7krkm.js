import{_ as p}from"./ValaxyMain.vue_vue_type_style_index_0_lang-BWN6FZjJ.js";import{f as d,w as a,e as c,A as m,ag as o,o as g,a as s,H as i,U as t}from"./app-O6veFoRw.js";import"./YunComment.vue_vue_type_style_index_0_lang-BdmCVZ97.js";import"./index-C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-6OskRlK9.js";import"./post-CxZOEfth.js";const u="/assets/1-DJl0YVDn.png",$={__name:"index",setup(y,{expose:k}){const l=JSON.parse(`{"title":"让IDE识别webpack的别名alias'@'","description":"","frontmatter":{"title":"让IDE识别webpack的别名alias'@'","date":"2019-06-10 16:39:39","categories":"学习笔记","tags":["Vue","Webpack","VSCode","WebStorm","IntelliJ IDEA"]},"headers":[],"relativePath":"pages/posts/2019-06-10-make_ide_recognize_webpack_alias/index.md","path":"/home/runner/work/blog/blog/pages/posts/2019-06-10-make_ide_recognize_webpack_alias/index.md","lastUpdated":1733198069000}`),r=m(),n=l.frontmatter||{};return r.meta.frontmatter=Object.assign(r.meta.frontmatter||{},l.frontmatter||{}),o("pageData",l),o("valaxy:frontmatter",n),globalThis.$frontmatter=n,k({frontmatter:{title:"让IDE识别webpack的别名alias'@'",date:"2019-06-10 16:39:39",categories:"学习笔记",tags:["Vue","Webpack","VSCode","WebStorm","IntelliJ IDEA"]}}),(e,h)=>{const E=p;return g(),d(E,{frontmatter:c(n)},{"main-content-md":a(()=>h[0]||(h[0]=[s("p",null,[i("许多项目脚手架默认就会把src目录添加一个"),s("code",null,"@"),i("别名，项目中实际引入时，虽然可以精简路径，但也带来一个很麻烦的问题： IDE无法识别这些别名，因此导致无法自动完成路径、无法识别引用资源的输出、出现不必要的告警等情况。")],-1),s("p",null,[i("偶然发现vscode的web项目里有一个"),s("code",null,"jsconfig.json"),i("文件，如：")],-1),s("div",{class:"language-json vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"json"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"{")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},'  "compilerOptions"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": {")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},'    "baseUrl"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"."'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},",")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},'    "paths"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": {")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},'      "@/*"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": ["),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"src/*"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"]")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    },")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},'    "target"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"ES6"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},",")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},'    "module"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"commonjs"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},",")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},'    "allowSyntheticDefaultImports"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"true")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  },")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},'  "include"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": ["),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"src/**/*"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"],")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},'  "exclude"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": ["),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"node_modules"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"]")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])]),s("button",{class:"collapse"})],-1),s("p",null,"只要有这个文件，vscode就可以正常识别出别名了。",-1),s("p",null,"后来发现JetBrains家的IDE更简单，配置指定一下就行：",-1),s("figure",null,[s("img",{src:u,alt:"",loading:"lazy",decoding:"async"})],-1),s("p",null,[i("在项目设置的webpack标签页里，将配置文件指向"),s("code",null,"<projectRoot>/node_modules/@vue/cli-service/webpack.config.js"),i("即可。")],-1),s("p",null,[i("保存并重新打开项目以后，不只"),s("code",null,"src"),i("，所有的别名比如"),s("code",null,"utils"),i("等等都可以被正常识别。")],-1),s("p",null,[i("其实这都已经写在"),s("code",null,"vue-cli3"),i("的"),s("a",{href:"https://cli.vuejs.org/zh/guide/webpack.html#%E4%BB%A5%E4%B8%80%E4%B8%AA%E6%96%87%E4%BB%B6%E7%9A%84%E6%96%B9%E5%BC%8F%E4%BD%BF%E7%94%A8%E8%A7%A3%E6%9E%90%E5%A5%BD%E7%9A%84%E9%85%8D%E7%BD%AE",target:"_blank",rel:"noreferrer"},"文档"),i("里了，只是原始表述不太直观，被我一直忽略了。")],-1)])),"main-header":a(()=>[t(e.$slots,"main-header")]),"main-header-after":a(()=>[t(e.$slots,"main-header-after")]),"main-nav":a(()=>[t(e.$slots,"main-nav")]),"main-content":a(()=>[t(e.$slots,"main-content")]),"main-content-after":a(()=>[t(e.$slots,"main-content-after")]),"main-nav-before":a(()=>[t(e.$slots,"main-nav-before")]),"main-nav-after":a(()=>[t(e.$slots,"main-nav-after")]),comment:a(()=>[t(e.$slots,"comment")]),footer:a(()=>[t(e.$slots,"footer")]),aside:a(()=>[t(e.$slots,"aside")]),"aside-custom":a(()=>[t(e.$slots,"aside-custom")]),default:a(()=>[t(e.$slots,"default")]),_:3},8,["frontmatter"])}}};export{$ as default};
