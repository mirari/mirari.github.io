import{_ as c}from"./ValaxyMain.vue_vue_type_style_index_0_lang-BWN6FZjJ.js";import{f,w as a,e as u,A as g,ag as i,o as $,a as t,H as n,U as o}from"./app-O6veFoRw.js";import"./YunComment.vue_vue_type_style_index_0_lang-BdmCVZ97.js";import"./index-C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-6OskRlK9.js";import"./post-CxZOEfth.js";const y={__name:"index",setup(h,{expose:p}){const s=JSON.parse('{"title":"Mac修复应用无法打开","description":"","frontmatter":{"title":"Mac修复应用无法打开","categories":["好人修电脑"],"tags":["好人修电脑","MacOS"],"date":"2024-05-21 17:46:29"},"headers":[],"relativePath":"pages/posts/2024-05-21-fixing_apps_not_opening_on_mac_systems/index.md","path":"/home/runner/work/blog/blog/pages/posts/2024-05-21-fixing_apps_not_opening_on_mac_systems/index.md","lastUpdated":1733198069000}'),l=g(),r=s.frontmatter||{};return l.meta.frontmatter=Object.assign(l.meta.frontmatter||{},s.frontmatter||{}),i("pageData",s),i("valaxy:frontmatter",r),globalThis.$frontmatter=r,p({frontmatter:{title:"Mac修复应用无法打开",categories:["好人修电脑"],tags:["好人修电脑","MacOS"],date:"2024-05-21 17:46:29"}}),(e,m)=>{const d=c;return $(),f(d,{frontmatter:u(r)},{"main-content-md":a(()=>m[0]||(m[0]=[t("p",null,"在一些第三方网站下载安装MacOS应用时，打开dmg文件，有时候会有一个“修复无法打开”的图标。",-1),t("p",null,"遇到应用拖动到Applications文件夹无法打开时，双击运行一下就可以解决问题。",-1),t("p",null,"但是在Sonoma 14.5版本下，这些操作失效了。",-1),t("p",null,[n("在隐私与安全性中配置“任何来源”"),t("code",null,"(sudo spctl --master-disable)"),n("与点击“仍要打开”这些基本操作就不说了，只记录下如何解决“修复无法打开”的问题，也就是绕过GateKeeper保护机制。")],-1),t("p",null,[n("网上能搜到的方法是教你输入"),t("code",null,"sudo xattr -rd com.apple.quarantine"),n("这段代码，不过在Sonoma 14.5中，"),t("code",null,"-r"),n("这个参数已经失效了。")],-1),t("p",null,"所以正确的做法是：",-1),t("ol",null,[t("li",null,"打开终端"),t("li",null,[n("输入"),t("code",null,"sudo xattr -d com.apple.quarantine ")]),t("li",null,"将应用目录下要安装的应用拖动到终端(此时路径会拼接到后面，注意空格)"),t("li",null,"运行并输入管理员密码即可。")],-1),t("p",null,"参考来源：",-1),t("p",null,[t("a",{href:"https://fcp7.com/solution-mac-install-app-common-problem.html",target:"_blank",rel:"noreferrer"},"https://fcp7.com/solution-mac-install-app-common-problem.html")],-1)])),"main-header":a(()=>[o(e.$slots,"main-header")]),"main-header-after":a(()=>[o(e.$slots,"main-header-after")]),"main-nav":a(()=>[o(e.$slots,"main-nav")]),"main-content":a(()=>[o(e.$slots,"main-content")]),"main-content-after":a(()=>[o(e.$slots,"main-content-after")]),"main-nav-before":a(()=>[o(e.$slots,"main-nav-before")]),"main-nav-after":a(()=>[o(e.$slots,"main-nav-after")]),comment:a(()=>[o(e.$slots,"comment")]),footer:a(()=>[o(e.$slots,"footer")]),aside:a(()=>[o(e.$slots,"aside")]),"aside-custom":a(()=>[o(e.$slots,"aside-custom")]),default:a(()=>[o(e.$slots,"default")]),_:3},8,["frontmatter"])}}};export{y as default};
