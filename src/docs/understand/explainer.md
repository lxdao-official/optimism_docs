---
title: Superchain解释器
lang: zh-CN
image: /assets/logos/twitter-superchain.png
meta:
- name: twitter:image
  content: https://stack.optimism.io/assets/logos/twitter-superchain.png
- property: og:image
  content: https://stack.optimism.io/assets/logos/twitter-superchain.png
- name: twitter:title
  content: Superchain Explainer  
- property: og:title
  content: Superchain Explainer
- name: twitter:card
  content: summary_large_image
---

::: tip 保持更新

[通过订阅 Optimism 通讯，及时了解 Superchain 和 OP Stack 的最新动态](https://optimism.us6.list-manage.com/subscribe/post?u=9727fa8bec4011400e57cafcb&id=ca91042234&f_id=002a19e3f0)。

:::

在 [Bedrock](../releases/bedrock/) 之后，OP Stack 的下一个重大可扩展性改进是引入“超级链”的概念：一组共享桥接、去中心化治理、升级、通信层等功能的链网络，所有这些功能都是基于 OP Stack 构建的。

超级链的推出将把 Optimism Mainnet 和其他链合并为 OP Chains（即超级链内的链）的单一统一网络，并标志着可扩展和去中心化计算将带给世界重大进展。本文档的目标是描述可扩展性愿景、超级链概念以及使这一愿景成为现实所需的 OP Stack 的一些变化。

这是详细的解释。[点击此处查看更简介的介绍](https://app.optimism.io/superchain/)。

::: tip 注意

目前，超级链是一个概念和正在进行中的项目，并不是一个具体的现实。本文档代表我们目前对超级链的组成部分、特性和路线图的最佳猜测。最终的实现将取决于（并随着）整个 Optimism Collective 的贡献而发生变化。我们迫不及待地想看到它的发展。

:::

## 可扩展性愿景

### 当前的区块链技术无法满足去中心化网络的需求

不幸的是，区块链生态系统尚未实现创建去中心化网络的潜力，即通过无需许可的协议取代可信实体。这主要是因为大多数网络应用由于当前区块链技术的可扩展性限制而无法在链上运行，这个问题从区块链技术诞生以来就一直困扰着该行业。

事实上，在比特币白皮书的第一个回应中，就有人以非凡的远见写道：

> **我们非常非常需要这样一个系统，但是根据我对你的提议的理解，它似乎无法扩展到所需的规模。**

十多年过去了，情况并没有改变。

### 可扩展的去中心化计算的价值巨大...

想象一下，如果我们解决了区块链可扩展性问题，如果在链上交易与与集中式后端交互一样便宜，那么在这个世界上，我们将能做到什么？

- 开发人员不需要担心应用所依赖的后端基础设施，因为链保证了应用的正确执行、可用性和[水平扩展性](https://en.wikipedia.org/wiki/Scalability#Horizontal_(scale_out)_and_vertical_scaling_(scale_up))。
- 由于共享的智能合约执行环境，可组合性将远远超出传统 REST API 的能力。
- 通过标准化的燃料市场，开发人员不需要为用户的所有基础设施成本买单。对于应用开发者来说，支付一个病毒式应用程序不再是进入门槛，而且可以开启更多的货币化策略。

这些特性的结合将使得能够编写高度可扩展的 Web 应用程序，而无需涉及传统的后端软件堆栈。消除对后端的担忧是一个价值主张，不仅适用于去中心化爱好者，也适用于普通的应用程序开发人员，他们只想发布一个产品。通过可扩展性，区块链可以从一个小众兴趣变成每个开发人员工具包中的核心组件。

此外，在这个大部分应用都上链的世界中，更多的数据变得具有密码学验证性。这种密码学验证性使用户能够建立跨所有应用程序的声誉。然后，这个声誉可以用于投票、贷款和抵押，从而在互联网上促进信任。此外，用户不会失去访问权，因为他们保留了对自己的数据、应用程序和声誉的所有权。

毫无疑问，区块链的承诺可以改变我们所知的互联网。

### ...去中心化网络仍然可以实现

这个假设并不是一个梦想，而是一个有形的未来愿景，这个愿景激励着许多人，包括 Optimism，致力于追求它。由于这些集体的贡献，每年我们都会对区块链技术栈有更多的了解，并且离实现这个愿景越来越近。

在行业的支持下，我们认为如何构建一个真正可扩展的区块链的清晰图景开始显现出来。我们称之为“Superchain”。本文介绍了Superchain架构的核心技术原则，以及一系列具体的项目，我们相信当这些项目完成时，将最终实现区块链的可扩展性愿景。这将是一个多年甚至几十年的旅程。然而，如果我们大致知道我们要去哪里，我们会更快地到达那里。

## 基础Superchain概念

### 水平可扩展性需要多个链...

水平区块链可扩展性基本上需要多个链。这是因为同步链的硬件要求与链执行的计算量成线性增长。因此，为了实现水平可扩展性，我们必须并行运行多个链。


::: details Chains

一个状态[转换系统](https://en.wikipedia.org/wiki/Transition_system)，由初始状态、状态转换函数和输入列表（交易）组成，通过密码学方式进行承诺，并可以使用普通计算机硬件和互联网连接进行独立复制。

:::

### ...但传统的多链架构不足以满足需求

传统的“多链”架构方法存在两个根本问题：

1. 每个链引入了一个新的安全模型，导致随着新链的引入，系统性风险不断累积。（相关[链接](https://twitter.com/VitalikButerin/status/1479501366192132099?s=20)）
2. 启动新链的成本很高，因为它们需要新的验证者集和区块生产者。

这些问题源于缺乏一个共享的区块链（“L1”链），它作为多链系统中所有链（“L2”链）的共享真实性来源。通过使用共享的真实性来源，可以实现以下目标：

a）在所有链上强制执行标准的安全模型；

b）消除链部署需要新的验证者集的要求，因为每个L2链都使用L1共识。

### 不是多链，也不是单链... 超级链

通过使用L2链来构建多链生态系统，可以将链视为可互换的计算资源，从而实现链的商品化。这种链的商品化使开发人员能够构建跨链应用程序，而无需引入系统性风险，并且在部署新链时不会产生大量的开销。链本身的概念可以被抽象化，到达这一点时，可以将这个互操作链网络视为一个单一的单位：Superchain(下文中部分翻译将采用超级链进行表述，以更贴合语境)。

::: details Superchain

一个去中心化的区块链平台，由许多共享安全性和技术堆栈（OP Stack）的链组成。互操作性和标准化使得工具和钱包可以将各个链视为相同的实体。

:::

## 超级链概述

### 超级链一览

超级链是一个由L2链组成的网络，这些链被称为OP Chains，它们共享安全性、通信层和开源技术堆栈。然而，与多链设计不同的是，这些链是标准化的，并且旨在作为可互换的资源使用。这使得开发人员可以构建针对整个超级链的应用程序，并将底层链抽象化。

::: details OP Chain

Optimism Superchain中的一个单独的链。无论其具体属性如何，只要它由Optimism Collective正式管理，就被视为OP chains，因此是超级链的一部分。

::: 

![Superchain Explainer Diagram.png](../../assets/docs/understand/superchain-diag.png)

### 超级链的特性

为了使Optimism升级为超级链，它必须具备以下特性：

| 特性 | 目的 |
| - | - |
| 共享的L1区块链 | 提供跨所有OP Chains的交易的完全排序。
| 共享的桥接器用于所有OP Chains | 使OP Chains具有标准化的安全特性。
| 低成本的OP链部署 | 使得在OP Chains上部署和交易不需要高昂的L1交易费用。
| OP Chains的配置选项 | 使OP Chains能够配置其数据可用性提供者、序列器地址等。
| 安全的交易和跨链消息 | 使用户能够安全地在OP链之间迁移资产。

一旦Optimism满足了这些特性，它就可以被认为是一个超级链。

## 将Optimism升级为超级链

我们相信在Bedrock发布之后，需要进行以下更改，以创建一个初始的超级链，使得可以使用相同的桥接器部署和升级多个链：

### 将Bedrock桥接器升级为链工厂

Bedrock引入了[SystemConfig合约](https://github.com/ethereum-optimism/optimism/blob/74a63c94d881442b4edd4df6492513e0113eb064/packages/contracts-bedrock/contracts/L1/SystemConfig.sol)，它开始直接使用L1智能合约来定义L2链。可以通过扩展该合约，将定义L2链的*所有信息*都存储在链上。包括生成唯一的链ID、关键配置值（如区块的燃料限制）等。

一旦链的数据完全存储在链上，我们可以创建一个工厂，用于为每个链部署配置和所有其他所需的合约。通过使用CREATE2使合约地址具备确定性，可以根据链的配置确定与该链相关的所有桥接器地址。这还使得可以在不部署桥接器合约的情况下与链进行交互，使（虚拟的）链部署几乎免费，并允许链继承标准的安全属性。

### 使用链工厂派生OP Chain数据

[Bedrock引入了从L1链派生L2链的功能](../releases/bedrock/explainer/#block-derivation)，其中所有链数据可以基于L1块进行同步。通过L1链工厂将所有配置放在链上，Optimism节点应该能够在给定单个L1地址和与L1的连接的情况下确定性地同步*任何*OP Chain。

::: tip 📌 

当OP链同步时，链的状态是通过本地计算得出的。这意味着确定OP链的状态是完全无需权限且安全的。在节点执行的本地计算过程中，所有无效的交易都会被简单地忽略，因此不需要使用证明系统进行链派生。然而，仍然需要使用证明系统来实现超级链的提现功能。

:::

### 无需许可的证明系统以实现提现功能

在Bedrock中，有一个需要许可的实体（提议者），用户需要通过该实体提交提现请求。此外，提议者必须按照一定的时间间隔向L1提交提案。随着超级链中链的数量增加，这引入了线性开销，并且由于有限的L1资源，甚至对链的数量有上限。

为了解决这些问题，我们可以引入两个功能：

1. 提现声明（也称为无需许可的提案）- 允许任何人提交提现请求（也称为提案），而不仅仅是指定的提议者。这消除了系统中的许可实体，使用户能够提交自己的提现消息。
2. 移除提案提交间隔 - 仅在用户需要提现时才允许进行提现声明。这消除了部署新的OP链时产生的开销。

::: details 提现声明（Withdrawal claims）

在一条链上对另一条链的状态进行声明。例如，我可以声明在OP Mainnet上我已经销毁了我的代币，并打算将这些代币提现回L1。

:::

我们可以通过在Optimism桥接合约中引入无需许可的证明系统来实现这两个功能。在Bedrock中引入的模块化证明设计中，证明可以采用故障证明或有效性证明（例如零知识证明）的形式。然而，在有效性证明投入生产使用之前，我们假设提现将使用故障证明系统。

在设想的故障证明系统中，任何人都可以提交提现声明，并且这些提现声明可以随时提交。当声明附带有绑定时，提交提现声明可以是无需许可的，因为这些绑定充当了如果声明被证明无效时的抵押品。如果挑战者成功挑战了声明，绑定将支付给挑战者作为他们参与保护系统的报酬，从而在这个无需许可的系统中防止垃圾信息的产生。此外，无需定期提交它们，因为故障证明游戏可以高效地证明自创世以来链的整个历史。

故障证明的实现可能最初依赖于一组可信的链证明者来作为争议的最终仲裁者。挑战者必须向大量的链证明者请求证明，并将这些证明合并为一个称为证明的挑战证明。然后，挑战证明用于挑战无效的声明。

基于证明的故障证明应该优先考虑安全性而不是活性。这意味着如果这些链证明者是恶意的，他们不能单独破坏提现的安全性。他们可能造成的最严重故障是阻止提现被处理，直到下一次升级-一种活性故障。

将来，证明将逐步被不依赖信任的证明（如[Cannon证明系统](https://github.com/ethereum-optimism/cannon)）取代。

### 可配置的OP Chain序列器

Bedrock引入了在SystemConfig合约中设置序列器地址的功能。随着我们引入具有自己的SystemConfig合约的多个链，我们可以使序列器地址能够由OP Chain的部署者进行配置。我们将这种可配置的序列器设计称为模块化序列化。这使得OP Chain可以由不同的实体进行序列化，同时保留标准的[超级链桥接器]安全模型，这是实现序列化去中心化的关键一步。

::: details 模块化序列化

在OP Chain部署期间配置序列器地址的能力。这个值可以由OP Chain的部署者进行配置。

:::

::: details 超级链桥接器

管理超级链中所有OP Chain的L1桥接器合约。这个桥接器可以由Optimism Collective进行升级。

:::

在超级链桥接器的安全模型中，链的安全性（即有效性）和链的活性（即抗审查性）是得到保证的。安全性由证明系统保证，活性由能够直接向L1提交[交易](../releases/bedrock/explainer/#deposits)保证。安全性和活性的结合意味着如果一个OP Chain的序列器出现问题，用户始终可以提交交易到L1，将他们的使用迁移到一个具有正常运行序列器的新的OP链。

模块化序列化还可以实现无需许可的对不同序列化模型进行实验。开发者可以设想实现序列化协议，如轮询序列化、序列器共识协议、PGA排序或FIFO排序。我们可以预期，随着不同序列化协议之间的竞争，用户友好的序列化标准将逐渐出现。

### 为所有OP Chains提供一个共享的升级路径

为了以高度的安全性和去中心化性交付初始的超级链，应引入一个去中心化的安全委员会来管理升级。安全委员会应能够更新链证明者的集合，启动带有延迟的合约升级，并按下紧急桥接暂停按钮，该按钮还会取消待处理的升级。

在紧急情况下暂停桥接的能力意味着在最坏的情况下，如果安全委员会参与者的私钥泄露，提现将无限期暂停，桥接升级将永远被取消。换句话说，L1的资金将被冻结。这遵循了安全性优先于活性的设计原则，即无论如何都应该防止资金的损失（即强制安全性），即使这意味着资金被锁定（即牺牲活性）。

#### 通过L1软分叉解冻桥接

为了解决被冻结的资金问题，L2社区讨论了一个潜在的最终恢复机制，我们称之为“L1软分叉升级恢复”机制。该机制使得L1能够通过软分叉启动桥接升级，绕过超级链桥接合约中的所有其他权限。这种方法可能会对以太坊引入系统性风险，并且在实施之前需要进行研究和社区认可。这不是实现超级链所必需的，只是为了研究的完整性而记录下来。在进一步研究其影响和安全性之前，团队目前不支持这种方法。

该机制的步骤如下：

*任何人*都可以通过向特殊的桥接合约提交一笔交易，以及一个非常大的保证金来提出升级建议。这将开始一个为期两周的挑战期。在此挑战期间，任何人都可以提交挑战，立即取消升级并领取保证金。在正常情况下，由于任何人都有巨大的激励来取消升级，升级不可能在所需的两周内未被取消。然而，如果升级伴随着对以太坊L1验证器软件（即L1软分叉）的修改，该软分叉忽略包含取消交易的区块，那么升级可能会成功。

虽然这种类型的成功升级将代表以太坊L1的软分叉，但它不会给以太坊代码库带来长期的技术债务，因为一旦升级完成，软分叉逻辑可以被移除。

我们预计这个应急措施将永远不会被使用，但它的存在可能会阻止恶意行为。

### 这些功能的结合满足了超级链的核心属性

我们相信这些升级可以为所有OP Chains提供共享的桥接，廉价的OP Chain部署，OP Chain的重要配置选项，以及安全的交易和跨链消息。由于Bedrock版本已经提供了共享L1区块链的属性，在这些变化之后，我们将实现超级链所需的所有核心属性。

## 扩展超级链-实现愿景的增强功能

我们预计，如果成功，Bedrock版本之后的超级链发布将标志着Optimism可扩展性和去中心化的重要里程碑。然而，在实现完全可扩展的区块链愿景之前，仍然存在一些需要解决的重要问题。预计的问题包括：

1. 提现声明依赖于一组可信的链证明者。
2. 跨链交易速度慢，因为需要等待挑战期。
3. 跨链交易是异步的，破坏了执行原子跨链交易（如闪电贷）的能力。
4. 将交易提交到超级链不可扩展，因为交易数据必须提交到容量有限的L1。
5. 没有易于构建可扩展dApp的框架，可以利用多个OP Chains。
6. 没有易于管理多个OP Chains上的资产和dApp的钱包。

如果解决了这些问题中的每一个，就有可能构建去中心化的替代方案，甚至可以替代最复杂的Web2应用程序。

以下是潜在的未来增强功能的概述，当结合在一起时，可以解决每一个问题。

### 多重证明的安全性

#### 痛点：

1) 提现声明依赖于一组可信的链证明者。

#### 提议的解决方案：

可以通过引入无需许可的证明（例如Cannon），完全在链上解决争议，从而替代可信的链证明者。然而，完全在链上的证明存在一个问题，即如果它们出现问题，就没有备用机制。为了确保它们永远不会失败，可以引入多重证明系统，通过冗余提供安全性。有关多重证明设计的更多信息，请点击[这里](https://medium.com/ethereum-optimism/our-pragmatic-path-to-decentralization-cb5805ca43c1)。

### 低延迟的L2到L2消息传递

#### 痛点：

2) 跨链交易速度慢，因为需要等待挑战期。

#### 提议的解决方案：

故障证明引入了用户体验的负担，因为它们需要等待挑战期才能安全地完成。这意味着，根据挑战期的长度，用户需要在资产从一个OP链迁移到下一个OP链之前等待很长时间。

另一方面，有效性证明没有这个问题。有效性证明没有挑战期，因此可以立即从一个OP Chain提取资产到下一个OP Chain。如果用户预计频繁在链之间迁移，甚至在正常的dApp执行过程中，这一点非常重要。然而，有效性证明通常使用零知识证明（ZKP）来实现，这是昂贵且容易出错的。可能需要几年时间才能真正将ZKP投入生产，以使其成为主要的跨链通信协议。

然而，在ZKP投入生产的同时，使用OP Stack的模块化证明系统可以实现低延迟的L2到L2消息传递。通过模块化证明，可以在同一链上使用两个证明系统。这打开了提供低延迟桥接的可能性，同时在提供高安全性高延迟桥接的同时进行安全性的权衡。

这种异构桥接系统意味着开发人员可以使用多种桥接类型来构建他们的应用程序，例如：

1. 高安全性、高延迟的故障证明（标准高安全性桥接）
2. 低安全性、低延迟的故障证明（通过缩短挑战期来实现低延迟）
3. 低安全性、低延迟的有效性证明（使用可信链证明者代替ZKP）
4. 高安全性、低延迟的有效性证明（一旦ZKP准备就绪）

混合多个证明系统使开发人员能够为低价值资产提供低延迟桥接，为高价值资产提供高延迟。甚至可以通过使用高安全性高延迟的故障证明回退来证明资产的有效性，将低安全性资产转变为高安全性资产。这个构建模块使开发人员能够进行有趣的安全性权衡，例如使用高阈值证明与高安全性高延迟的故障证明回退。

### 同步跨链交易

#### 痛点：

3) 跨链交易是异步的，破坏了执行原子跨链交易（如闪电贷）的能力。

#### 提议的解决方案：

传统的跨链消息传递是异步的，这意味着跨链交易不是原子的。例如，如果用户想要执行一个跨链套利交易——在链A上购买代币A，在链B上卖出代币B——不能保证他们的交易会完整执行。用户可能会在没有卖出代币B的情况下购买了代币A。

通过在OP Chains上使用共享的排序协议，可以引入同步的跨链消息传递，并实现原子的跨链交互。在我们的例子中，链A和链B上的排序器将分别接收到套利交易，并就何时包含它们达成共识，然后将每个交易原子地包含在链接块中。只有当交易确实在每个链上被包含时，才需要支付手续费，这意味着排序器承担了同步风险，而不是用户在我们的初始例子中。这些共享的排序协议可以在基于后Bedrock超级链的模块化排序层之上无需许可地实施。

通过低延迟的L2到L2消息传递以及共享的排序，可以执行复杂的交易，如跨链闪电贷。甚至可以进一步创建一个EVM抽象，其中个别的智能合约（甚至是个别的存储槽）存在于不同的链上。

### Alt-Data Availability Layer — Plasma Protocol

#### 痛点：

4) 将交易提交到超级链不可扩展，因为交易数据必须提交到容量有限的L1。

#### 提议的解决方案：

目前，L1数据可用性（DA）的扩展性还远远不足以支持互联网级别的规模。然而，通过使用Plasma协议，可以扩展OP链可访问的数据可用性，从而使替代的DA提供者补充L1 DA的有限性。

通用的Plasma协议能够比L1更好地扩展，因为只有对交易数据感兴趣的用户才会下载Plasma数据，而在L1上，每个以太坊节点都会下载L1上的所有交易数据。这意味着Plasma数据非常廉价。然而，Plasma的安全模型比L1差一些——Plasma链的数据可能暂时不可用，这意味着用户必须从链上提取资产。请注意，这个安全模型仍然保证了Plasma链的安全性，只是无法保证连续性。

::: details Plasma Chain

一种将交易数据提交到L1但不直接提供给L1的链，具有数据可用性挑战的备用方案。

:::

**Plasma协议概述：**

- 数据可用性（DA）提供者从用户那里接收交易数据。
- DA提供者对交易数据进行哈希处理，并将哈希提交给Plasma合约。
- 一旦哈希被提交，DA提供者向用户发送一个证明，证明他们的交易数据包含在哈希中。如果DA提供者行为不端，他们将不会发送证明给用户。
- 如果DA提供者没有向用户发送证明，用户可以提交DA挑战。这将强制DA提供者将交易数据上链。如果DA提供者没有将证明提交到链上，哈希将被删除。这确保了用户始终可以（在挑战期结束后）同步Plasma链。
  - 在L1拥堵的情况下，DA挑战期可以延长。
- 用户还可以提交一个L1交易，从Plasma链中提取资产，以切换他们的DA提供者。
- Plasma链的结算使用与Rollup链几乎相同的故障证明系统，唯一的区别是使用在Plasma合约中最终确定的哈希从链中派生出额外的数据。

由于哈希能够将任意大小的数据减少为恒定大小的承诺，并且能够并行处理交易数据的哈希，使用Plasma DA可以实现几乎完美的水平可扩展性。这意味着可以将大规模可扩展的应用程序（如游戏或社交媒体）放在Plasma链上。

### 多链dApp框架

#### 痛点：

5) 没有易于构建可利用多个OP Chains的可扩展dApp的框架。

6) 没有易于管理多个OP Chains上的资产和dApp的钱包。

#### 提议的解决方案（草图）：

这不是一个核心协议的改变，而是可以构建在核心Superchain协议之上的工具。这里的建议旨在提供如何构建改进部署到Superchain的工具的粗略直觉。

以下是一些可以使在Superchain上开发变得更好的工具：

1. 内容可寻址的智能合约 - 这使得合约在所有链上具有相同的地址。这样，开发人员可以编写智能合约，这些合约在所有OP Chains上都以相同的地址进行事实上的部署。如果OP Chains上的用户想要使用尚未在其链上可用的智能合约，他们可以独立部署该代码。
2. 跨链合约状态管理标准 - 创建智能合约状态如何从一条链迁移到下一条链的标准，使开发人员能够在许多链上分片其应用程序。此外，这种逻辑可以在钱包中使用，以显示用户状态，就好像它们都在同一条链上。例如，如果用户的代币分布在许多链上，钱包可以使用跨链状态管理逻辑，知道应将用户余额显示为所有链上代币余额的总和。

  ::: tip 📌 

  对于以太坊可扩展性爱好者：这些框架可以通过使用户状态从臃肿的链迁移到新的链上变得容易来解决状态增长问题。旧的臃肿链可以以较低的gas限制维护，或者完全废弃。
    
  :::
  
3. Superchain RPC端点 - 创建一个单一的RPC端点，用户可以将其Superchain交易发送到，而不管它们打算用于哪个OP链，以使用户避免不断切换网络。

通过强大的多链dApp框架，部署跨链dApp可能会变得与部署针对单个链的dApp一样容易。

## 参与其中

我们相信扩展区块链将彻底去中心化互联网，并使创建水平可扩展、安全和去中心化的 Web 应用程序变得容易。我们认为 OP Stack 的 Superchain 发布可能是实现这一愿景的重要一步。然而，在发布之后，仍需要大量的工作来实现可扩展性愿景。

然而，伴随巨大的挑战也带来了巨大的机遇！为了实现这一目标，我们需要像您这样的开发者通过开源贡献来支持我们。在 OP Stack 的初始发布以及随之而来的生态系统中，将会有大量的低悬挂果实的贡献机会等待开发者们去发掘。我们无法独自完成这个任务！唯有通过像您这样的开源贡献者的支持，我们才有希望实现这一目标！而且，通过[追溯性公共物品资助](https://medium.com/ethereum-optimism/retroactive-public-goods-funding-33c9b7d00f0c)，您的开源贡献可能会得到回报！

前方充满了激动人心的时刻。

保持乐观 🔴✨

## 术语表

- **Attestation-Based Fault Proof**：一种错误证明，可以通过提供与原始提款声明不一致的证明来成功发起挑战。

- **Attestation-Based Validity Proof**: 一种可以通过提供与提款声明一致的证明来验证的有效性证明。

- **Attestation Proof**: 由预先约定的一组链证明者的一些签名组成的证明。

- **Cannon Fault Proof**: 使用一个在链上进行的游戏来评估挑战，该游戏保证在经济合理性假设下得出真实的结果的错误证明。

- **Chain**: 一个状态[转换系统](https://en.wikipedia.org/wiki/Transition_system)，包括初始状态、状态转换函数和输入（交易）列表，可以通过计算机硬件和互联网连接进行独立复制，并进行密码学承诺。

- **Chain Proof**: 对特定提款声明的有效性的难以伪造的证据。证明通常用于使链之间能够进行通信。

- **Challenge Period**: 可以对错误证明提出挑战以证明其错误的时间窗口。

- **Fault Proof**: 一种依赖于缺乏反证据来证明正确性的证明。

- **Modular Proof**: 可以使用多个证明系统来证明相同的OP Chains的能力。例如，可以使用错误证明或有效性证明来证明OP链。

- **Modular Sequencing**: 在OP链部署期间配置顺序器地址的能力。该值可以由OP链部署者配置。

- **OP Chain**: Optimism Superchain中的一个单独的链。所有链，无论其特定属性如何，只要它们受Optimism Collective的官方治理，就被视为OP Chains，因此是Superchain的一部分。

- **Plasma Chain**: 交易数据提交到L1，但不直接提供给L1的链，具有数据可用性挑战的备用方案。

- **Rollup Chain**: 所有交易数据都提交到L1的链。

- **Sequencer**: 在向OP链提交交易时具有优先权的特定实体或智能合约。

- **Superchain**: 一个去中心化的区块链平台，由许多共享安全性和技术堆栈（OP Stack）的链组成。互操作性和标准化使得可以将各个链视为工具和钱包中的相同实体。

- **Superchain Bridge**: 管理Superchain中所有OP Chains的L1桥接合约。该桥接合约可以由Optimism Collective进行升级。

- **Validity Proof**: 对提款声明的证明，可以立即验证，无需挑战期。

- **Withdrawal Claim**: 在另一条链上对一条链的状态的声明。例如，我可以声称在OP Mainnet上烧毁了我的代币，并打算将这些代币提取回L1。

- **Zero Knowledge Proof**: 一种依赖于密码学属性和低错误率的有效性证明。
