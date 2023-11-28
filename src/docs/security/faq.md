---
title: 常见安全问题
lang: zh-CN
---

::: warning 🚧 施工中

OP Stack正在施工中。不断推动OP Stack的整体安全性和去中心化是我们的首要任务。

:::

## 去中心化环境下的安全性

OP Stack是一种去中心化的开发堆栈，为Optimism提供支持。OP Stack的组件可能由Optimism Collective内的不同团队维护。通常更容易讨论基于OP Stack构建的特定链的安全模型，而不是堆栈本身的安全模型。**OP Stack的安全基线是创建安全的默认设置，同时给开发人员提供修改和扩展堆栈的灵活性。**

## 常见问题

### 每个OP Stack链都安全吗？

基于OP Stack的区块链的安全模型取决于其组件使用的模块。由于OP Stack提供的灵活性，始终有可能使用OP Stack组件设置一个不安全的区块链。**OP Stack的目标是提供安全的默认设置。**

还请记住，就像任何其他系统一样，**OP Stack可能包含未知的错误**，这可能导致OP Stack基于系统中的某些或全部资产的损失。[OP Stack代码库的许多组件已经经过审计](https://github.com/ethereum-optimism/optimism/tree/129032f15b76b0d2a940443a39433de931a97a44/technical-documents/security-reviews)，但审计并不意味着批准，完成审计也不意味着经过审计的代码库没有错误。重要的是要理解，使用OP Stack本质上会使您面临OP Stack代码库中的错误风险。

### 修改OP Stack是否安全？

与任何事物一样，修改OP Stack需自担风险。无法保证对堆栈的修改是安全的。如果您对自己的操作不太确定，请坚持使用OP Stack提供的更安全的默认设置。目前，OP Stack对于超出堆栈标准Rollup配置的修改不太适应，**不应期望对这些修改提供任何技术支持**。

### 我可以使用故障证明吗？

**目前还不行。** OP Stack目前没有故障证明系统。**请注意，如果系统可以在7天的挑战窗口内升级（“快速升级密钥”），故障证明对系统的安全性没有实质性改进**。具有快速升级密钥的系统完全依赖于升级密钥来保证安全。

故障证明是OP Stack的一个重要里程碑和首要任务。与此同时，在故障证明在生产环境中可用之前，OP Stack可以提供其他几种出色的安全选项，以改进系统的安全性。

### 如何帮助提高OP Stack的安全性？

帮助确保OP Stack安全的最简单方法之一是寻找错误和漏洞。[Optimism Mainnet作为OP Stack的用户，拥有最大的漏洞赏金](https://immunefi.com/bounty/optimism/)。通过在Optimism Mainnet代码库（以及OP Stack）中发现关键漏洞，您可以获得高达200万美元的奖金。

不要忘记，OP Stack是一个去中心化的开发堆栈。任何人都可以通过构建遵循[堆栈设计原则](../understand/design-principles.md)的软件来开始为OP Stack做出贡献。您始终可以通过构建组件（如替代客户端或证明实现）来帮助提高OP Stack的安全性，以供OP Stack的用户使用。

### 如何报告错误？

[查看安全策略以了解有关报告漏洞和可用漏洞赏金计划的详细信息](./policy.md)
