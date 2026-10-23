---
title: 一段脚本同时编译FatFramework和XCFramework
categories:
  - 学习笔记
tags:
  - iOS
  - xcode
date: '2021-07-28 18:06:16'
---

### 简介

FatFramework即传统的Framework大包，一个二进制文件同时包含了真机和模拟器在不同架构下的代码，是以前闭源分发常用的形式。

XCFramework本质上是一个文件夹合集，里面包含了真机和模拟器两个子文件夹，再里面才是Framework本体。另外还有一个Info.plist配置文件，在xcode11之后可以用来将当前环境所需的指令集自动对应到指定的Framework。

现在cocoapods上很多闭源库都已经使用XCFramework取代了FatFramework。我们不能落后于时代，必须了解一下这一实现流程。

### 打包方式

首先在编译阶段，需要确保真机和模拟器的产出包含了所需的archs。

我们参考谷歌的GoogleAppMeasurement.xcframework，打开它的目录，可以看到如下两个文件夹：

```
ios-arm64_armv7
ios-arm64_i386_x86_64-simulator
```

可以看到真机环境所需的archs是`arm64`、`armv7`，模拟器环境所需的archs是`arm64`、`i386`、`x86_64`。

因为现在M1环境的模拟器arch是`arm64`，模拟器需要包含`arm64`，这是以前很多教程没提及的。

如果你使用的是`x86`环境，在编译模拟器时，需要手动指定archs，否则不会包含`arm64`.

顺便一提，一些教程和问题解答会让xcode12和x86的用户在项目配置里设置`Excluded Architectures`的模拟器配置项为`arm64`。这也会让模拟器编译默认排除`arm64`。

我们不需要这么做。

我用的是fastlane构建，不会影响项目本身的配置，fastlane脚本如下：

```
  desc "打包SDK"
  lane :buildSDK do
    customScheme = "MySDK"
    xcbuild(
        workspace: "MySDK.xcworkspace",
        scheme: customScheme,
        clean: true,
        configuration: "Release",
        xcargs: "-sdk iphonesimulator ARCHS='arm64 x86_64 i386' "
    )

    xcbuild(
        workspace: "MySDK.xcworkspace",
        scheme: customScheme,
        clean: true,
        configuration: "Release",
        xcargs: "-sdk iphoneos ARCHS='arm64 armv7' "
    )
  end
```

这样我们在执行fastlane构建时，可以在真机和模拟器下获得各自所需的原始Framework。

接下来是将这两个Framework合并打包。

XCFramework的打包脚本非常简单：

```bash
# 使用xcodebuild -create-xcframework命令合并
xcodebuild -create-xcframework -framework "${DEVICE_DIR}" -framework "${SIMULATOR_DIR}" -output "${Merged_DIR}"
```

前两个参数即真机和模拟器的Framework路径，第三个是产出路径。

传统的FatFramework打包的麻烦之处在于，两个Framework如果包含了重复的arch就会报错，因此需要在合并前，先移除重复的部分。

```bash
# 复制真机Framework作为新产出Framework的原型
cp -r ../dist/${PRODUCT_NAME}/iphoneos/ ${MergePath}
# 移除模拟器的arm64并替换原始文件
lipo "${SIMULATOR_DIR}/${PRODUCT_NAME}" -remove arm64 -output "${SIMULATOR_DIR}/${PRODUCT_NAME}"
# 使用lipo -create命令合并，需要指向二进制文件，而不是framework文件夹
lipo -create "${DEVICE_DIR}/${PRODUCT_NAME}" "${SIMULATOR_DIR}/${PRODUCT_NAME}" -output "${MergePath}${PRODUCT_NAME}.framework/${PRODUCT_NAME}"

```

这样就在产出目录下同时生成了FatFramework和XCFramework。

最后可以使用`lipo -info ${Framework二进制文件路径}`来验证。

### 使用方式

在podspec文件中引入Framework时，直接将以前的.framework改为.xcframework就可以了。

### 完整示例

完整代码如下，将其保存为post_build.sh。
在项目target的Build Phases的末尾创建一个Run Script Phase并执行该脚本，就可以在fastlane脚本执行完毕后自动打包。

```sh
echo "run script begin"
script_path=${SRCROOT}/post_build.sh
chmod 777 $script_path
# 调用sh脚本文件
sh $script_path
```


```sh
#!/bin/sh

if [  $CONFIGURATION == Release ]
then
	echo 'release build'
	#exit 0
else
	echo 'debug build'
	exit 0
fi

# 获取包路径
rootPub=../dist/${PRODUCT_NAME}/iphoneos/

if [  $EFFECTIVE_PLATFORM_NAME == -iphonesimulator ]
then
	echo '模拟器'
	rootPub=../dist/${PRODUCT_NAME}/iphonesimulator/
else
	echo '真机'
fi

# 将包从默认输出路径复制到dist目录
rm -rf ${rootPub}
mkdir -p ${rootPub}

cp -r ${CODESIGNING_FOLDER_PATH} ${rootPub}

# 合并真机模拟器sdk
DEVICE_DIR=../dist/${PRODUCT_NAME}/iphoneos/${PRODUCT_NAME}.framework
SIMULATOR_DIR=../dist/${PRODUCT_NAME}/iphonesimulator/${PRODUCT_NAME}.framework
# 如果真机包或模拟包不存在，则退出合并
if [ ! -d "${DEVICE_DIR}" ] || [ ! -d "${SIMULATOR_DIR}" ]
then
echo "真机包或模拟包不存在，退出合并"
exit 0
fi

MergePath=../dist/${PRODUCT_NAME}/merge/
rm -rf ${MergePath}
mkdir -p  ${MergePath}

Merged_DIR=../dist/${PRODUCT_NAME}/merge/${PRODUCT_NAME}.xcframework
xcodebuild -create-xcframework -framework "${DEVICE_DIR}" -framework "${SIMULATOR_DIR}" -output "${Merged_DIR}"
cp -r ../dist/${PRODUCT_NAME}/iphoneos/ ${MergePath}
lipo "${SIMULATOR_DIR}/${PRODUCT_NAME}" -remove arm64 -output "${SIMULATOR_DIR}/${PRODUCT_NAME}"
lipo -create "${DEVICE_DIR}/${PRODUCT_NAME}" "${SIMULATOR_DIR}/${PRODUCT_NAME}" -output "${MergePath}${PRODUCT_NAME}.framework/${PRODUCT_NAME}"

# copy assets Bundle: disable copy bundle
rm -rf ${DWARF_DSYM_FOLDER_PATH}/${PRODUCT_NAME}.bundle/*.plist
rm -rf ${DWARF_DSYM_FOLDER_PATH}/${PRODUCT_NAME}.bundle/_CodeSignature
cp -r  ${DWARF_DSYM_FOLDER_PATH}/${PRODUCT_NAME}.bundle  ${MergePath}

### 清理资源
rm -rf ../${PRODUCT_NAME}/Frameworks/*
mv ${MergePath}/* ../${PRODUCT_NAME}/Frameworks/
rm -rf ../dist/${PRODUCT_NAME}/

```
