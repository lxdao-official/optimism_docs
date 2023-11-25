---
title: 执行技巧
lang: zh-CN
---


::: warning 🚧 OP Stack Hacks 是一些你可以在 OP Stack 上做的事情，但目前并不打算用于生产环境

OP Stack Hacks 不适合新手。你将无法获得针对 OP Stack Hacks 的重要开发者支持，准备好自己动手解决问题并在没有支持的情况下工作。

:::

## 概述

执行层负责定义状态的格式和 L2 上的状态转换函数。当通过 [Engine API](https://github.com/ethereum/execution-apis/tree/main/src/engine) 接收到有效载荷时，它将触发状态转换函数。尽管默认的执行层模块是 EVM，但你可以用任何替代的虚拟机替换 EVM，只要它位于 Engine API 的后面。

## 默认

默认的执行层模块是 Rollup EVM 模块。Rollup EVM 模块使用了一个经过轻微修改的 EVM，增加了对 L1 上由智能合约触发的交易的支持，并为每个交易引入了 L1 数据费用，以补偿将用户交易发布到 L1 的成本。你可以在[此页面](https://op-geth.optimism.io/)上找到标准 EVM 和 Rollup EVM 之间的全部差异。

## 安全性

与对派生层的修改一样，对执行层的修改可能会产生意想不到的后果。例如，对 EVM 的修改可能会破坏现有的工具链，或者可能会为拒绝服务攻击打开大门。请仔细考虑每个修改对案例的影响。

## 修改

### EVM 调整

默认的执行层模块是 EVM。可以以许多不同的方式修改 EVM，例如添加新的预编译合约或将预部署的智能合约插入到创世状态中。预编译合约可以帮助降低常见智能合约操作的成本，从而进一步降低特定用例的执行成本。这些修改应直接应用于[执行客户端](https://github.com/ethereum-optimism/op-geth)。

还可以创建替代的执行客户端实现，以改善链的安全性能。请注意，如果修改了 EVM，则必须将相同的修改应用于您希望支持的每个执行客户端。

### 替代虚拟机

OP Stack 允许您用*任何*状态转换函数替换 EVM，只要该转换可以通过 Engine API 触发。例如，已经使用它来实现了一个运行 GameBoy 模拟器而不是 EVM 的 OP Stack 链。

[教程：添加预编译合约](./tutorials/new-precomp.md)。
