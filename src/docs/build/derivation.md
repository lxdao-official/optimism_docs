---
title: 衍生技巧
lang: zh-CN
---


::: warning 🚧 OP Stack Hacks 是一些你可以在 OP Stack 上做的事情，但目前并不适用于生产环境

OP Stack Hacks 不适合新手。你将无法获得 OP Stack Hacks 的重要开发者支持，因此请准备好自己动手解决问题。

:::

## 概述

衍生层负责解析来自数据可用性层的原始输入，并将其转换为要发送到执行层的[Engine API](https://github.com/ethereum/execution-apis/tree/main/src/engine)负载。衍生层通常与数据可用性层紧密耦合，因为它必须理解所选模块的数据可用性层的API以及发布到所选模块的原始数据的格式。

## 默认值

默认的衍生层模块是Rollup模块。该模块从三个来源派生交易：顺序交易、用户存款和L1块。Rollup模块还强制执行某些排序属性，例如保证用户存款始终在一定可配置的时间内包含在L2链中。

## 安全性

修改衍生层可能会产生意想不到的后果。例如，删除或扩展用户存款必须包含的时间窗口可以使顺序交易员对L2链进行审查。由于衍生层的灵活性，任何更改的确切影响可能因更改的具体情况而异。应该仔细考虑任何修改的负面影响。

## 修改

### EVM事件触发的交易

OP Stack的默认Rollup配置包括“存款”交易，每当L1上的`OptimismPortal`合约发出特定事件时触发。使用相同的原理，OP Stack链可以从EVM-based DA上的*任何*合约发出的事件派生交易。请参考[attributes.go](https://github.com/ethereum-optimism/optimism/blob/e468b66efedc5f47f4e04dc1acc803d4db2ce383/op-node/rollup/derive/attributes.go#L70)以了解如何派生存款交易以及如何创建自定义交易。

### EVM块触发的交易

与事件类似，OP Stack链上的交易可以在EVM-based DA上发布新块时触发。OP Stack的默认Rollup配置已经包含了一个块触发的交易，即[“L1 info”交易](https://github.com/ethereum-optimism/optimism/blob/e468b66efedc5f47f4e04dc1acc803d4db2ce383/op-node/rollup/derive/attributes.go#L103)，它将最新的块哈希、时间戳和基础费用等信息传递到L2。入门指南演示了如何添加一个新的块触发的交易，以报告通过L1上的基础费用燃烧的气体量。

### 还有更多...

衍生层是堆栈中最灵活的层之一。交易可以从各种原始输入数据生成，并且可以从各种条件触发。您可以从数据可用性层模块中找到的任何数据派生交易！

[教程：向衍生函数添加属性](./tutorials/add-attr.md)。
