---
title: Husky6配置正确但无法触发githook的问题
categories:
  - 学习笔记
tags:
  - husky
  - lint-staged
  - eslint
date: '2021-05-31 16:56:24'
---

项目中之前一直使用husky进行代码质量控制，主要包含两个步骤：

- 代码提交前，先执行eslint校验，不通过则不允许提交。
- commit记录需要符合规范，用于自动生成changelog。

Husky6的配置步骤如下：

#### 安装husky(lint-staged和commitlint的安装略)

确保package.json的依赖包含：

```
"husky": "^6.0.0",
```

#### 执行husky安装命令

```
husky install
```

在项目目录下会出现一个`.husky`文件夹，包含一个`.gitignore`文件和一个`_`目录，不要改动它们，是存放husky脚本的。

#### 添加hook动作

根据[教程](https://typicode.github.io/husky/#/?id=create-a-hook)添加命令，或者在`.husky`目录直接创建以下这两个文件：

commit-msg
```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit $1
```
用于commit内容校验

pre-commit
```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```
用于代码eslint校验

注意文件名不可自定义，必须对应githook的阶段。

如果是初次配置，到这一步就已经可以正常运行了。

#### 将husky安装命令配置为自动执行

在package.json的scripts中添加以下内容：

```
"prepare": "husky install",
```

注意脚本名必须是prepare，这样使用npm、pnpm执行install命令时，这条命令会在安装完成时自动执行。

当代码上传到远程，同步到另一台设备时，安装完依赖就可以自动启用husky了，无需关心上面那些复杂动作。


但是我遇到了这样的问题：

所有配置都完全一致，执行husky安装命令提示安装成功，没有错误信息，但githook就是不触发。

原因是hook文件的权限不足。在windows上创建的文件提交并同步到mac上就会出现此类问题，因为不是使用`husky add`命令创建的。

解决方式很简单，只要执行以下命令即可：

```sh
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

官网参考：

[https://typicode.github.io/husky/#/?id=hooks-not-running](https://typicode.github.io/husky/#/?id=hooks-not-running)
