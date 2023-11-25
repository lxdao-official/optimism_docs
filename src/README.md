---
title: Welcome to the OP Stack
lang: zh-CN
---

**OP Stack是一个标准化的、共享的、开源的开发栈，它为Optimism提供动力，由Optimism Collective维护。**

::: tip 持续跟踪最新状态

[通过订阅Optimism新闻通讯，保持对Superchain和OP Stack的最新了解。](https://optimism.us6.list-manage.com/subscribe/post?u=9727fa8bec4011400e57cafcb&id=ca91042234&f_id=002a19e3f0).

:::

OP Stack由Optimism Collective管理和维护的许多不同的软件组件组成，这些组件共同构成了Optimism的骨干。
OP Stack是为以太坊和Optimism生态系统构建的公共物品。

## OP Stack驱动Optimism

OP Stack是驱动Optimism的软件集合，目前以Optimism Mainnet背后的软件形式存在，最终将以Optimism Superchain及其治理的形式存在。

随着Superchain概念的出现，Optimism能够轻松支持，在提议的Superchain生态系统内，安全创建可互操作的新链的能力变得越来越重要。
因此，OP Stack主要关注创建共享的、高质量的、完全开源的用于创建新的L2区块链的系统。
通过协调共享标准，Optimism Collective可以避免重复在孤立的环境中重新构建相同的软件。

尽管OP Stack今天大大简化了创建L2区块链的过程，但必须要注意，这并不完全定义了OP Stack是什么。
OP Stack是驱动Optimism的所有软件。随着Optimism的发展，OP Stack也会发展。

**可以将OP Stack视为帮助定义Optimism生态系统特定层的软件组件，或填充现有层中模块的角色。**
尽管OP Stack当前的核心是用于运行L2区块链的基础设施，但理论上，OP Stack还可以扩展到底层区块链之上的各个层面，包括块浏览器、消息传递机制、治理系统等工具。

层次结构在堆栈的底部通常更加紧密定义（如数据可用性层），但在堆栈的顶部变得更加宽松定义（如治理层）。

## OP Stack的现状

Optimism Bedrock是当前版本的OP Stack。
Bedrock版本提供了启动生产级别的Optimistic Rollup区块链的工具。
目前，OP Stack的不同层的API与该Rollup配置紧密耦合。

如果您想了解OP Stack的当前状态，请查看[描述Bedrock版本的页面](/docs/releases/bedrock/README.md)。

今天的OP Stack是为支持Optimism Superchain而构建的，Optimism Superchain是一组共享安全性、通信层和共同开发堆栈（OP Stack本身）的L2网络。
OP Stack的Bedrock版本使得轻松启动与Superchain兼容的L2变得容易。
如果您想启动一个准备加入Superchain的L2，请查看我们基于OP Stack的Bedrock版本运行链的指南。

可以修改OP Stack的组件来构建新颖的L2系统。
如果您对OP Stack感兴趣并想进行实验，请查看本站的OP Stack Hacks部分。
请注意，从Bedrock版本开始，OP Stack预期并不支持这些修改，您将在代码库上进行“极客开发”。
因此，**目前您应该对OP Stack Hacks的开发者支持（如果有的话）保持有限的预期**。
OP Stack Hacks可能会使您的链与Optimism Superchain不兼容。

玩得开心，但风险自担，**如果您想加入Superchain，请坚持使用Bedrock版本！**

## OP Stack的规划

OP Stack是一个不断发展的概念。
随着Optimism的发展，OP Stack也会发展。
如今，OP Stack的Bedrock版本简化了部署新的L2 Rollups的过程。
随着对堆栈的工作继续进行，插入和配置不同模块将变得更加容易。
随着Superchain的形成，OP Stack可以与之一起发展，包括允许不同链无缝互操作的消息传递基础设施。
最终，OP Stack将成为Optimism所需的东西。

## 深入了解OP Stack

准备深入了解OP Stack的世界了吗？

- 如果您对OP Stack的当前版本感兴趣，请查看Bedrock版本页面。
- 如果您想更深入地了解OP Stack，请从[设计原则](/docs/understand/design-principles.md)和[景观概述](/docs/understand/landscape.md)开始。
- 如果您想加入Superchain，请使用我们的[入门指南](/docs/build/getting-started.md)启动您的第一个准备加入Superchain的L2，或直接深入OP Stack代码库以获取更多信息。

OP Stack是以太坊的下一个前沿。您已经在这里，还在等什么呢？
