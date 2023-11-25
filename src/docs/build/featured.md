---
title: 特色黑客技巧
lang: zh-CN
---

::: warning 🚧 OP Stack Hacks 是一些你可以在 OP Stack 上做的事情，但目前并不打算用于生产环境

OP Stack Hacks 不适合新手。你将无法获得针对 OP Stack Hacks 的重要开发者支持 - 请准备好自己动手解决问题，无需支持。

:::

## 概述

特色黑客技巧是一些人们在 OP Stack 上构建的酷炫项目的汇编！

## OPCraft

### 作者

[Lattice](https://lattice.xyz/)

### 描述

OPCraft 是一个在 OP Stack 上运行修改版 EVM 作为后端的完全链上 3D 体素游戏，使用了 [MUD](https://mud.dev/) 构建。

### OP Stack 配置

- 数据可用性：以太坊 DA（Goerli）
- 顺序执行器：单一执行器
- 派生：标准 Rollup
- 执行：修改版 Rollup EVM

### 链接

- [宣布 OPCraft：在 OP Stack 上构建的自治世界](https://dev.optimism.io/opcraft-autonomous-world/)
- [OPCraft 浏览器](https://opcraft.mud.dev/)
- [OPCraft 在 GitHub 上的项目](https://github.com/latticexyz/opcraft)
- [MUD](https://mud.dev/)

## Ticking Optimism

### 作者

[@therealbytes](https://twitter.com/therealbytes)

### 描述

Ticking Optimism 是一个 OP Stack 链的概念验证实现，它在每个区块中调用一个 `tick` 函数。通过使用 OP Stack，Ticking Optimism 避免了需要离链基础设施定期执行函数的需求。Ticking Conway 是一个使用 Ticking Optimism 在链上构建 [康威生命游戏](https://conwaylife.com/) 的系统。

### OP Stack 配置

- 数据可用性：以太坊 DA（任意）
- 顺序执行器：单一执行器
- 派生：带有自定义 `tick` 函数的标准 Rollup
- 执行：Rollup EVM

### 链接

- [Ticking Optimism 在 GitHub 上的项目](https://github.com/therealbytes/ticking-optimism)
- [Ticking Conway 在 GitHub 上的项目](https://github.com/therealbytes/ticking-conway)
