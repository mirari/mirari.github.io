---
title: TypeScript中以变量方式传递类
date: '2020-01-18 16:29:50'
categories:
  - 学习笔记
tags:
  - TypeScript
---

最近尝试用TypeScript写一个工具库，需要实现这样一个场景：

1. 声明一个抽象类Parent

2. 声明一组子类ChildA、ChildB继承这个Parent，实现它的抽象方法

3. 实现一个方法，根据参数返回对应的子类

4. 用拿到的子类创建实例

代码示例如下：

```typescript
abstract class Animal {
  abstract makeSound(): void
}
class Dog extends Animal {
  makeSound(): void {
    console.log('woof')
  }
}
class Cat extends Animal {
  makeSound(): void {
    console.log('meow')
  }
}
const getAnimal = (name: string) => {
  if (name === 'cat') return Cat
  return Dog
}

const animal = new (getAnimal('dog'))()
animal.makeSound()  // woof

```

首先注意`new`后面`getAnimal`方法的执行需要用括号包起来，否则将得到以下错误：
```
TS2350: Only a void function can be called with the 'new' keyword.
ESLint: A constructor name should not start with a lowercase letter.
```

随后按照严谨的做法，我尝试给这个getAnimal方法添加类型约束：
```typescript
const getAnimal = (name: string): Animal => {
  if (name === 'cat') return Cat
  return Dog
}
```
马上得到了错误提示：
```
TS2351: This expression is not constructable. 
Type 'Animal' has no construct signatures.
```

这样写的错误在于，`Animal`描述的应当是一个由其创建的实例的类型（或者说类）。

比如改写成下面这样就没有问题了:
```typescript
const getAnimalInstance = (name: string): Animal => {
  if (name === 'cat') return new Cat()
  return new Dog()
}
```

而上面的`getAnimal`方法返回的不是实例，是类（构造器）本身。

描述这种类型，需要用到TypeScript的`new ()`语法
```typescript
const getAnimal = (name: string): { new (): Animal } => {
  if (name === 'cat') return Cat
  return Dog
}
```
或者这样写：
```typescript
const getAnimal = (name: string): new () => Animal => {
  if (name === 'cat') return Cat
  return Dog
}
```
表示这个方法返回的是一个构造器，这个构造器可以创造出一个类型是`Animal`的实例。

最后的示例如下：
```typescript
abstract class Animal {
  abstract makeSound(): void
}
class Dog extends Animal {
  makeSound(): void {
    console.log('woof')
  }
}
class Cat extends Animal {
  makeSound(): void {
    console.log('meow')
  }
}
const getAnimal = (name: string): { new (): Animal } => {
  if (name === 'cat') return Cat
  return Dog
}

const getAnimalInstance = (name: string): Animal => {
  if (name === 'cat') return new Cat()
  return new Dog()
}

console.log('sound:', new (getAnimal('dog'))().makeSound())
console.log('sound:', getAnimalInstance('cat').makeSound())

```
打开在线示例查看执行结果：

[https://codepen.io/mirari/pen/xxbrvVd](https://codepen.io/mirari/pen/xxbrvVd)

> 点击Console打开控制台

参考文档：

[TypeScript-泛型-在泛型里使用类类型](https://www.tslang.cn/docs/handbook/generics.html)
