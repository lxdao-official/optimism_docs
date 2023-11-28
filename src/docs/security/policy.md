---
title: 安全策略、漏洞报告和赏金计划
lang: zh-CN
---


## 在去中心化环境中进行报告

请记住，OP Stack 是由 Optimism Collective 构建的去中心化软件开发堆栈。OP Stack 的不同组件可能由不同的团队维护，这些团队可能有不同的报告流程。**本页面描述了报告漏洞的一般最佳实践，并提供了针对 [ethereum-optimism](https://github.com/ethereum-optimism) GitHub 组织中的 OP Stack 代码的具体报告准则**。

## 报告漏洞和漏洞

::: danger 🚫 不要公开披露漏洞

请不要公开披露漏洞，也不要在生产网络上执行漏洞。如果这样做，不仅会使用户面临风险，还将失去获得奖励的权利。请始终按照下面描述的适当报告途径进行操作。

- 请不要公开披露漏洞，例如提交公开工单。
- 请不要在公开可用的网络上测试漏洞，无论是测试网还是主网。

:::

### OP Stack 赏金计划

OP Stack 智能合约和区块链基础设施的安全至关重要。以下是各种 OP Stack 相关的赏金计划，以及如果您的漏洞不在现有赏金计划范围内，如何联系我们。

#### Optimism Mainnet 赏金计划

Optimism Mainnet 在 Immunefi 上有一个全面的[赏金计划](https://immunefi.com/bounty/optimism/)，这已经导致了[有史以来最大的赏金支付之一](https://medium.com/ethereum-optimism/disclosure-fixing-a-critical-bug-in-optimisms-geth-fork-a836ebdf7c94)。在列表中，您可以找到与范围、报告和支付流程相关的所有信息。由于 Optimism Mainnet 目前是 OP Stack 的主要用户，通常可以通过 Optimism Mainnet 赏金计划报告 OP Stack 软件中的漏洞。

#### 未涵盖的漏洞

如果您认为在 OP Stack 智能合约、基础设施等方面发现了重大漏洞或漏洞，即使该组件不在现有的赏金计划范围内，请通过 [Optimism Mainnet Immunefi 赏金计划](https://immunefi.com/bounty/optimism/)进行报告。我们将考虑所有报告问题的影响，并且该计划以前已经奖励安全研究人员发现的不在其规定范围内的漏洞。

### 其他漏洞

对于 OP Stack 中任何网站、电子邮件服务器或其他非关键基础设施的漏洞，请发送电子邮件至 [OP Labs](https://www.oplabs.co/)，并提供详细的确认和重现漏洞的说明。

## 漏洞披露

每个 OP Stack 组件的维护者可能会确定自己的漏洞披露流程。然而，以下是 [OP Labs](https://www.oplabs.co/) 目前使用的推荐披露流程：

1. 静默修复漏洞，并将修复内容包含在发布 X 中。

1. 经过 4-8 周后，披露发布 X 包含了一个安全修复。

1. 在额外的 4-8 周后，发布漏洞的详细信息，同时给予报告者的认可（在报告者的明确许可下）。

除此策略外，维护者还保留以下权利：

- 跳过此策略，并在更短的时间内发布详细信息。
- 在公开公告之前，直接通知一部分下游用户。

此策略基于 [Geth](https://geth.ethereum.org/) 团队的[静默修补策略](https://geth.ethereum.org/docs/vulnerabilities/vulnerabilities#why-silent-patches)。
