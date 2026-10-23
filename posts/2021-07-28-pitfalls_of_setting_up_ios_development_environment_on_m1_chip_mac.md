---
title: M1芯片Mac搭建ios开发环境踩坑
categories:
  - 学习笔记
tags:
  - iOS
  - MacOS
  - xcode
date: '2021-07-28 10:20:47'
---

除了能在AppStore下到或者可以轻易获取的工具，我的iOS开发环境还需要以下环境支持：

- homebrew
- cocoapods
- fastlane
- xcode的arm64模拟器

### homebrew

原始的写法因为无法访问`raw.githubusercontent.com`，可能导致安装卡住或者失败。

经过一番踩坑，最终找到了这个网站：

https://brew.idayer.com/

使用以下命令分别安装arm版和x86版的homebrew：

```bash
/bin/bash -c "$(curl -fsSL https://cdn.jsdelivr.net/gh/ineo6/homebrew-install/install.sh)"
```

```bash
arch -x86_64 /bin/bash -c "$(curl -fsSL https://cdn.jsdelivr.net/gh/ineo6/homebrew-install/install.sh)"
```

arm版会被安装到`/opt/homebrew/bin/brew`目录，x86版会被安装到`/usr/local/bin/brew`目录。

安装成功后，会有提示需要手动执行一段脚本：

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

可以手动编辑用户根目录下的.zprofile文件，确保含有如下内容：

```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles/bottles
alias abrew='arch -arm64 /opt/homebrew/bin/brew'
alias ibrew='arch -x86_64 /usr/local/bin/brew'
```

保存后再执行`source ~/.zprofile`刷新配置。

此时，输入`brew -v`、`ibrew -v`、`abrew -v`可以看到如下信息：

```
mirari@MBA ~ % brew -v
Homebrew 3.2.4
Homebrew/homebrew-core (git revision 64a2874e87; last commit 2021-07-27)
Homebrew/homebrew-cask (git revision 9d5abe6a67; last commit 2021-07-27)
mirari@MBA ~ % ibrew -v
Homebrew 3.2.5
Homebrew/homebrew-core (git revision 507807b9dc; last commit 2021-07-27)
mirari@MBA ~ % abrew -v
Homebrew 3.2.4
Homebrew/homebrew-core (git revision 64a2874e87; last commit 2021-07-27)
Homebrew/homebrew-cask (git revision 9d5abe6a67; last commit 2021-07-27)
```

说明安装正常。



之前可能因为网络等原因，我的homebrew虽然安装成功了，但安装大多数工具，比如bob和fastlane，都会提示找不到叫这个名字的工具。

错误信息为`Could not resolve HEAD to a revision`。

使用`brew -v`可以看到，homebrew-core没有HEAD。

执行以下命令可以修复：

```bash
git -C $(brew --repository homebrew/core) reset --hard HEAD.
```

但是为了稳妥起见，我还是rm -rf了两个brew的目录重新安装了一遍。




### fastlane

homebrew安装成功后，直接运行`brew install fastlane`即可安装成功。



### cocoapods

之前有段文字提示brew上的cocoapods已经停止更新，需要改用gem安装，现在去看已经没有了，brew上直接运行`brew install cocoapods`即可。



### M1芯片的arm64模拟器

这是最坑的部分。

新鲜出炉的M1环境xcode在运行以前的老项目时，遇到了一堆问题，比如这样的错误信息：

```
building for iOS Simulator-x86_64 but attempting to link with file built for iOS Simulator-arm64
```

或者提示找不到对应的Framework，或者提示在当前arch下当前的Symbol无法识别。

#### 解决方案1：

> 在访达的应用程序列表中，找到xcode，右键选择显示简介，然后勾选“使用Rosetta打开”。

简单粗暴无脑。这样启动的xcode，模拟器就是x86的了，完美适配x86环境。包括那些没有在xcframework的模拟器里编译arm64的依赖都可以正常运行。

但是xcode的执行效率会受影响，我不能接受。

顺带一提，直接从官网下载的Mac版IntelliJ IDEA就是x86版的，在M1环境下运行卡顿很严重，用了一天整个人都难受了，插件Power Mode II的打字特效掉帧严重，不得不关闭。需要在官网下载前，点击下载按钮右侧切换到arm版，从此丝般顺滑。



我自己制作的xcframework包在模拟器环境同时包含了`x86_64`和`arm64`（谷歌就是这样），要是M1芯片还跑x86，不是媚眼抛给瞎子看？

但是要让项目在arm64下跑起来，配置也不容易，经过一番尝试，解决方案大致如下：

#### 解决方案2：

这里涉及3个编译目标，分别是：

- pod依赖的第三方库Target，包括源码和Framework
- 本地用于编译Framework的自有库源码Target
- 调用以上依赖并运行在模拟器或真机上的应用Target

##### 运行在模拟器或真机上的应用Target

首先确保用于调用Framework和运行模拟器的应用项目Target本身的Build Settings配置如下：

- Architectures为默认值`$(ARCHS_STANDARD)`

在M1芯片下，模拟器的默认值应该是`arm64`, `armv7`

- Build Active Architecture Only的Debug为Yes(前提是模拟器用Debug方式运行)

这一步的作用是让模拟器编译目标时只编译arm64的代码，不要尝试x86等arch的编译。因为它依赖的pod和自有库的arch会被指定为只有一个arm64，如果尝试其他arch编译就会报错。

- 删除Excluded Architectures

这一步的作用是让pod来管理此项参数，不要手动设置值。手动设置这项值时，pod安装会有一段警告提示。

```
[!] The `Demo [Debug]` target overrides the `EXCLUDED_ARCHS[sdk=iphonesimulator*]` build setting defined in `../Pods/Target Support Files/Pods-Demo/Pods-Demo.debug.xcconfig'. This can lead to problems with the CocoaPods installation
    - Use the `$(inherited)` flag, or
    - Remove the build settings from the target.
```

- 删除Valid Architectures

xcode12的新项目应该默认移除了此项参数。新版xcode不再需要用这个参数来指定archs。



##### pod依赖的第三方库Target

在podfile中添加钩子

```yaml
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ONLY_ACTIVE_ARCH'] = 'NO'
    end
  end
end
```

因为手动在xcode里修改pod的project是没用的，pod install一执行，一切修改都会还原。因此需要用钩子来处理pod安装的配置项。

这一步的作用是让pod在编译时编译所有archs，也就是包括了x86和arm64.

之所以要这样做，是因为模拟器环境的pod安装时仍然会把开源的依赖以x86形式编译(我推测)，也就导致了上面那个`building for iOS Simulator-x86_64 but attempting to link with file built for iOS Simulator-arm64`错误。因此我们用这段语句让pod强制编译所有arch。



##### 本地用于编译Framework的自有库源码Target

其余配置参考上面的应用Target，但是Build Active Architecture Only这一项需要改为NO，也就是手动操作了上面pod的那段配置。



**最后，记得删除pods目录，删除项目缓存，然后再执行编译。**



#### 解决方案3

其他操作都类似方案2，但是将pod和自有库的那个Build Active Architecture Only配置项，改为操作Excluded Architectures。具体操作为：

##### pod依赖的第三方库Target

在podfile中添加钩子

```yaml
post_install do |installer|
  installer.pods_project.build_configurations.each do |config|
    config.build_settings["EXCLUDED_ARCHS[sdk=iphonesimulator*]"] = "arm64"
  end
end
```

##### 本地用于编译Framework的自有库源码Target

Debug下的Build Active Architecture Only保持YES，但是Excluded Architectures设置为arm64。



这一步的作用是让Pod依赖和自有库模拟器编译时，排除arm64。

出处：https://stackoverflow.com/a/63955114/6096307

按理说这样arm64的模拟器运行时应该会报错，但是实际上确实可以执行，我也不知道为什么了╮(╯▽╰)╭



不过虽然应用本身能正常运行，但自有库还需要在打包时包含所有的archs。之前在pod里面过滤了arm64，如果自有库依赖了pod中的有源码的开源库，就会导致编译打包时丢失arm64的arch，从而报错。因此如果项目本身是单纯的应用，使用方案3排除arm64会更节省资源，编译更快速。如果是工具库，就得使用方案2，编译所有archs。
