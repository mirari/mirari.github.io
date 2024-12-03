import{_ as E}from"./ValaxyMain.vue_vue_type_style_index_0_lang-BWN6FZjJ.js";import{f as d,w as a,e as g,A as y,ag as r,o,a as i,H as s,U as h}from"./app-O6veFoRw.js";import"./YunComment.vue_vue_type_style_index_0_lang-BdmCVZ97.js";import"./index-C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-6OskRlK9.js";import"./post-CxZOEfth.js";const $={__name:"2021-07-28-compiling_fatframework_and_xcframework_simultaneously_with_a_script",setup(c,{expose:p}){const k=JSON.parse('{"title":"一段脚本同时编译FatFramework和XCFramework","description":"","frontmatter":{"title":"一段脚本同时编译FatFramework和XCFramework","categories":["学习笔记"],"tags":["iOS","xcode"],"date":"2021-07-28 18:06:16"},"headers":[{"level":3,"title":"简介","slug":"简介","link":"#简介","children":[]},{"level":3,"title":"打包方式","slug":"打包方式","link":"#打包方式","children":[]},{"level":3,"title":"使用方式","slug":"使用方式","link":"#使用方式","children":[]},{"level":3,"title":"完整示例","slug":"完整示例","link":"#完整示例","children":[]}],"relativePath":"pages/posts/2021-07-28-compiling_fatframework_and_xcframework_simultaneously_with_a_script.md","path":"/home/runner/work/blog/blog/pages/posts/2021-07-28-compiling_fatframework_and_xcframework_simultaneously_with_a_script.md","lastUpdated":1733198069000}'),e=y(),t=k.frontmatter||{};return e.meta.frontmatter=Object.assign(e.meta.frontmatter||{},k.frontmatter||{}),r("pageData",k),r("valaxy:frontmatter",t),globalThis.$frontmatter=t,p({frontmatter:{title:"一段脚本同时编译FatFramework和XCFramework",categories:["学习笔记"],tags:["iOS","xcode"],date:"2021-07-28 18:06:16"}}),(l,n)=>{const F=E;return o(),d(F,{frontmatter:g(t)},{"main-content-md":a(()=>n[0]||(n[0]=[i("h3",{id:"简介",tabindex:"-1"},[s("简介 "),i("a",{class:"header-anchor",href:"#简介","aria-label":'Permalink to "简介"'},"​")],-1),i("p",null,"FatFramework即传统的Framework大包，一个二进制文件同时包含了真机和模拟器在不同架构下的代码，是以前闭源分发常用的形式。",-1),i("p",null,"XCFramework本质上是一个文件夹合集，里面包含了真机和模拟器两个子文件夹，再里面才是Framework本体。另外还有一个Info.plist配置文件，在xcode11之后可以用来将当前环境所需的指令集自动对应到指定的Framework。",-1),i("p",null,"现在cocoapods上很多闭源库都已经使用XCFramework取代了FatFramework。我们不能落后于时代，必须了解一下这一实现流程。",-1),i("h3",{id:"打包方式",tabindex:"-1"},[s("打包方式 "),i("a",{class:"header-anchor",href:"#打包方式","aria-label":'Permalink to "打包方式"'},"​")],-1),i("p",null,"首先在编译阶段，需要确保真机和模拟器的产出包含了所需的archs。",-1),i("p",null,"我们参考谷歌的GoogleAppMeasurement.xcframework，打开它的目录，可以看到如下两个文件夹：",-1),i("div",{class:"language- vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"}),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",null,"ios-arm64_armv7")]),s(`
`),i("span",{class:"line"},[i("span",null,"ios-arm64_i386_x86_64-simulator")])])]),i("button",{class:"collapse"})],-1),i("p",null,[s("可以看到真机环境所需的archs是"),i("code",null,"arm64"),s("、"),i("code",null,"armv7"),s("，模拟器环境所需的archs是"),i("code",null,"arm64"),s("、"),i("code",null,"i386"),s("、"),i("code",null,"x86_64"),s("。")],-1),i("p",null,[s("因为现在M1环境的模拟器arch是"),i("code",null,"arm64"),s("，模拟器需要包含"),i("code",null,"arm64"),s("，这是以前很多教程没提及的。")],-1),i("p",null,[s("如果你使用的是"),i("code",null,"x86"),s("环境，在编译模拟器时，需要手动指定archs，否则不会包含"),i("code",null,"arm64"),s(".")],-1),i("p",null,[s("顺便一提，一些教程和问题解答会让xcode12和x86的用户在项目配置里设置"),i("code",null,"Excluded Architectures"),s("的模拟器配置项为"),i("code",null,"arm64"),s("。这也会让模拟器编译默认排除"),i("code",null,"arm64"),s("。")],-1),i("p",null,"我们不需要这么做。",-1),i("p",null,"我用的是fastlane构建，不会影响项目本身的配置，fastlane脚本如下：",-1),i("div",{class:"language- vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"}),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",null,'  desc "打包SDK"')]),s(`
`),i("span",{class:"line"},[i("span",null,"  lane :buildSDK do")]),s(`
`),i("span",{class:"line"},[i("span",null,'    customScheme = "MySDK"')]),s(`
`),i("span",{class:"line"},[i("span",null,"    xcbuild(")]),s(`
`),i("span",{class:"line"},[i("span",null,'        workspace: "MySDK.xcworkspace",')]),s(`
`),i("span",{class:"line"},[i("span",null,"        scheme: customScheme,")]),s(`
`),i("span",{class:"line"},[i("span",null,"        clean: true,")]),s(`
`),i("span",{class:"line"},[i("span",null,'        configuration: "Release",')]),s(`
`),i("span",{class:"line"},[i("span",null,`        xcargs: "-sdk iphonesimulator ARCHS='arm64 x86_64 i386' "`)]),s(`
`),i("span",{class:"line"},[i("span",null,"    )")]),s(`
`),i("span",{class:"line"},[i("span")]),s(`
`),i("span",{class:"line"},[i("span",null,"    xcbuild(")]),s(`
`),i("span",{class:"line"},[i("span",null,'        workspace: "MySDK.xcworkspace",')]),s(`
`),i("span",{class:"line"},[i("span",null,"        scheme: customScheme,")]),s(`
`),i("span",{class:"line"},[i("span",null,"        clean: true,")]),s(`
`),i("span",{class:"line"},[i("span",null,'        configuration: "Release",')]),s(`
`),i("span",{class:"line"},[i("span",null,`        xcargs: "-sdk iphoneos ARCHS='arm64 armv7' "`)]),s(`
`),i("span",{class:"line"},[i("span",null,"    )")]),s(`
`),i("span",{class:"line"},[i("span",null,"  end")])])]),i("button",{class:"collapse"})],-1),i("p",null,"这样我们在执行fastlane构建时，可以在真机和模拟器下获得各自所需的原始Framework。",-1),i("p",null,"接下来是将这两个Framework合并打包。",-1),i("p",null,"XCFramework的打包脚本非常简单：",-1),i("div",{class:"language-bash vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"bash"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 使用xcodebuild -create-xcframework命令合并")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"xcodebuild"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -create-xcframework"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -framework"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"DEVICE_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"'),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -framework"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"SIMULATOR_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"'),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -output"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Merged_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"')])])]),i("button",{class:"collapse"})],-1),i("p",null,"前两个参数即真机和模拟器的Framework路径，第三个是产出路径。",-1),i("p",null,"传统的FatFramework打包的麻烦之处在于，两个Framework如果包含了重复的arch就会报错，因此需要在合并前，先移除重复的部分。",-1),i("div",{class:"language-bash vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"bash"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 复制真机Framework作为新产出Framework的原型")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"cp"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -r"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ../dist/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/iphoneos/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ${MergePath}")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 移除模拟器的arm64并替换原始文件")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"lipo"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"SIMULATOR_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"}/${"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PRODUCT_NAME"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"'),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -remove"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," arm64"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -output"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"SIMULATOR_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"}/${"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PRODUCT_NAME"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"')]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 使用lipo -create命令合并，需要指向二进制文件，而不是framework文件夹")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"lipo"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -create"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"DEVICE_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"}/${"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PRODUCT_NAME"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"'),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"SIMULATOR_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"}/${"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PRODUCT_NAME"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"'),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -output"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"MergePath"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"}${"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PRODUCT_NAME"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"}.framework/${"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PRODUCT_NAME"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"')])])]),i("button",{class:"collapse"})],-1),i("p",null,"这样就在产出目录下同时生成了FatFramework和XCFramework。",-1),i("p",null,[s("最后可以使用"),i("code",null,"lipo -info ${Framework二进制文件路径}"),s("来验证。")],-1),i("h3",{id:"使用方式",tabindex:"-1"},[s("使用方式 "),i("a",{class:"header-anchor",href:"#使用方式","aria-label":'Permalink to "使用方式"'},"​")],-1),i("p",null,"在podspec文件中引入Framework时，直接将以前的.framework改为.xcframework就可以了。",-1),i("h3",{id:"完整示例",tabindex:"-1"},[s("完整示例 "),i("a",{class:"header-anchor",href:"#完整示例","aria-label":'Permalink to "完整示例"'},"​")],-1),i("p",null,"完整代码如下，将其保存为post_build.sh。 在项目target的Build Phases的末尾创建一个Run Script Phase并执行该脚本，就可以在fastlane脚本执行完毕后自动打包。",-1),i("div",{class:"language-sh vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"sh"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"echo"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "run script begin"')]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"script_path"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${SRCROOT}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/post_build.sh")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"chmod"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 777"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $script_path")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 调用sh脚本文件")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"sh"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $script_path")])])]),i("button",{class:"collapse"})],-1),i("div",{class:"language-sh vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"sh"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"#!/bin/sh")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"if"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," [  $CONFIGURATION "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"=="),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," Release ]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"then")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"	echo"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," 'release build'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"	#exit 0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"else")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"	echo"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," 'debug build'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"	exit"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"fi")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 获取包路径")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"rootPub"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"../dist/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/iphoneos/")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"if"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," [  $EFFECTIVE_PLATFORM_NAME "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"=="),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," -iphonesimulator ]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"then")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"	echo"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," '模拟器'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"	rootPub"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"../dist/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/iphonesimulator/")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"else")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"	echo"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," '真机'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"fi")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 将包从默认输出路径复制到dist目录")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"rm"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -rf"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ${rootPub}")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"mkdir"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -p"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ${rootPub}")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"cp"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -r"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ${CODESIGNING_FOLDER_PATH} ${rootPub}")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 合并真机模拟器sdk")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"DEVICE_DIR"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"../dist/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/iphoneos/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},".framework")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"SIMULATOR_DIR"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"../dist/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/iphonesimulator/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},".framework")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 如果真机包或模拟包不存在，则退出合并")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"if"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," [ "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"!"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," -d"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"DEVICE_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ] "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"||"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," [ "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"!"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," -d"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"SIMULATOR_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"then")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"echo"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "真机包或模拟包不存在，退出合并"')]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"exit"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"fi")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"MergePath"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"../dist/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/merge/")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"rm"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -rf"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ${MergePath}")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"mkdir"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -p"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  ${MergePath}")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Merged_DIR"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"../dist/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/merge/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},".xcframework")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"xcodebuild"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -create-xcframework"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -framework"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"DEVICE_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"'),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -framework"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"SIMULATOR_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"'),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -output"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Merged_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"')]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"cp"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -r"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ../dist/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/iphoneos/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ${MergePath}")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"lipo"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"SIMULATOR_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"}/${"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PRODUCT_NAME"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"'),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -remove"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," arm64"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -output"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"SIMULATOR_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"}/${"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PRODUCT_NAME"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"')]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"lipo"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -create"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"DEVICE_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"}/${"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PRODUCT_NAME"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"'),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"SIMULATOR_DIR"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"}/${"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PRODUCT_NAME"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"'),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -output"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "${'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"MergePath"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"}${"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PRODUCT_NAME"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"}.framework/${"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PRODUCT_NAME"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}"')]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# copy assets Bundle: disable copy bundle")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"rm"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -rf"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ${DWARF_DSYM_FOLDER_PATH}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},".bundle/"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"*"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},".plist")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"rm"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -rf"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ${DWARF_DSYM_FOLDER_PATH}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},".bundle/_CodeSignature")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"cp"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -r"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  ${DWARF_DSYM_FOLDER_PATH}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},".bundle"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  ${MergePath}")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"### 清理资源")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"rm"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -rf"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ../"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/Frameworks/"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"*")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"mv"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ${MergePath}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"*"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ../"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/Frameworks/")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"rm"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -rf"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ../dist/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"${PRODUCT_NAME}"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/")])])]),i("button",{class:"collapse"})],-1)])),"main-header":a(()=>[h(l.$slots,"main-header")]),"main-header-after":a(()=>[h(l.$slots,"main-header-after")]),"main-nav":a(()=>[h(l.$slots,"main-nav")]),"main-content":a(()=>[h(l.$slots,"main-content")]),"main-content-after":a(()=>[h(l.$slots,"main-content-after")]),"main-nav-before":a(()=>[h(l.$slots,"main-nav-before")]),"main-nav-after":a(()=>[h(l.$slots,"main-nav-after")]),comment:a(()=>[h(l.$slots,"comment")]),footer:a(()=>[h(l.$slots,"footer")]),aside:a(()=>[h(l.$slots,"aside")]),"aside-custom":a(()=>[h(l.$slots,"aside-custom")]),default:a(()=>[h(l.$slots,"default")]),_:3},8,["frontmatter"])}}};export{$ as default};
