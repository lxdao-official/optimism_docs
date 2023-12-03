---
title: Bedrock Explainer 
lang: en-US
meta:
    - name: og:image
      content: https://dev.optimism.io/content/images/size/w2000/2022/12/bedrock-BLUE.jpg
---

![Bedrock](https://dev.optimism.io/content/images/size/w2000/2022/12/bedrock-BLUE.jpg)

::: tip 保持更新

[通过订阅Optimism通讯了解Superchain和OP Stack的最新动态](https://optimism.us6.list-manage.com/subscribe/post?u=9727fa8bec4011400e57cafcb&id=ca91042234&f_id=002a19e3f0)。

:::

Bedrock是OP Stack代码库的首个正式发布版本，它是一组自由开源的模块化组件，共同驱动着Optimism。

- 要了解Bedrock发布版本中的内容，请继续阅读。
- 要在Optimism Mainnet上进行开发（该网络将升级为Bedrock版本），请阅读文档。
- 要为OP Stack做出贡献，请参阅ethereum-optimism monorepo上的贡献指南。

## 改进摘要

Bedrock通过使用优化的批量[压缩](#optimized-data-compression)和以太坊作为数据可用性层来降低交易费用，缩短将L1交易包含在Rollup中的延迟，通过代码重用实现模块化的证明系统，并通过消除技术债务来提高节点性能，改进了其前身。

### 降低手续费

此外，Bedrock实现了一种优化的数据[压缩](#optimized-data-compression)策略，以最小化数据成本。我们目前正在对此更改的影响进行基准测试，但我们预计它将显著降低手续费。

Bedrock还在将数据提交到L1时消除了与EVM执行相关的所有燃气成本。这使得手续费比协议的先前版本再降低10%。

### 缩短存款时间

Bedrock在节点软件中引入了对L1重组的支持，这显著减少了用户等待存款的时间。协议的早期版本可能需要长达10分钟才能确认存款。使用Bedrock，我们预计存款将在3分钟内确认。

### 改进的证明模块化

Bedrock将证明系统从OP Stack中抽象出来，以便Rollup可以使用故障证明或有效性证明（例如zk-SNARK）来证明在Rollup上对输入的正确执行。这种抽象使得像[Cannon](https://github.com/ethereum-optimism/cannon)这样的系统可以用于证明系统中的故障。

### 改进的节点性能

通过允许在单个Rollup“块”中执行多个交易，节点软件的性能得到了显着改进，而不是先前版本中的“每个块一个交易”的模型。这样可以将默克尔树更新的成本分摊到多个交易中。在当前的交易量下，这将使状态增长每年减少约15GB。

通过消除先前版本协议中的技术债务，进一步提高了节点性能。这包括消除了需要一个单独的“数据传输层”节点来索引L1的需求，并更新了节点软件以有效地从L1查询交易数据。

### 改进的以太坊等效性

Bedrock从一开始就被设计得尽可能接近以太坊。已经消除了先前版本协议中与以太坊的多个偏差，包括：

1. 每个块一个交易的模型。
2. 获取L1块信息的自定义操作码。
3. JSON-RPC API中单独的L1/L2费用字段。
4. ETH余额的自定义ERC20表示。

Bedrock还增加了对EIP-1559、链重组和其他在L1上存在的以太坊功能的支持。

## 设计原则

Bedrock的设计目标是模块化和可升级，重用以太坊的现有代码，并尽可能与以太坊保持100%的等效性。

### 模块化

Bedrock通过使用明确定义的接口和版本控制方案，使得在OP Stack代码库中交换不同组件和添加新功能变得容易。这样可以实现灵活的架构，以适应以太坊生态系统未来的发展。

示例：
- [Rollup节点](#rollup-node)和执行客户端的分离
- 模块化的故障证明设计

### 代码重用

Bedrock尽可能使用现有的以太坊架构和基础设施。这种方法使得OP Stack能够继承在以太坊主网上使用的经过实战验证的代码库的安全性和"lindy"效益。在设计中可以找到这方面的示例，包括：

示例：
- [最小修改的执行客户端](https://op-geth.optimism.io/)
- 使用EVM合约而不是预编译客户端代码

### 与以太坊等效性

Bedrock的设计目标是与现有的以太坊开发者体验最大程度兼容。由于L1和Rollup之间存在基本差异（如改变的费用模型、更快的区块时间（2秒对比12秒）以及用于包含L1 [存款](#deposits)交易的特殊交易类型），因此存在一些例外情况。

示例：
- 故障证明设计用于证明最小修改的以太坊[执行客户端](#execution-client)的故障
- 使用以太坊[执行客户端](#execution-client)的代码重用，供L2网络中的节点和序列器使用

## 协议

Rollup是从数据可用性源（通常是像以太坊这样的L1区块链）派生出来的。在最常见的配置中，Rollup协议从两个主要信息源派生出一个**“规范的L2链”**：

1. 由序列器发布到L1的交易数据；
2. 由账户和合约发布到L1上的[存款](#deposits)交易。

以下是协议的基本组成部分：

* [存款](#deposits)是通过直接与L1上的智能合约进行交互，将数据写入规范的L2链。
* [提款](#deposits)是将数据写入规范的L2链，隐式触发与L1上的合约和账户进行交互。
* 批次是对应于Rollup上批次的数据写入。
* 区块派生是解释L1上的数据读取，以理解规范的L2链。
* 证明系统定义了在L1上发布的输出根的**确定性**，以便可以对其进行**执行**（例如执行提款）。

### 存款

**存款**是在L1上的交易，将被包含在Rollup中。根据定义，[存款](#deposits)是**保证**被包含在[规范的L2链](#protocol)中，以防止对L2的审查或控制。

#### 从L1进行任意消息传递

**存款交易**是作为[存款](#deposits)的一部分在Rollup上进行的交易。在Bedrock中，[存款](#deposits)是完全通用的以太坊交易。例如，以太坊上的账户或合约可以“存款”一个合约创建。

Bedrock定义了一个在L1上可用的**存款合约**：这是一个智能合约，L1上的账户和合约可以与之交互，将数据写入L2。在L2上，[存款交易](#arbitrary-message-passing-from-l1)是根据该[存款](#deposits)合约发出的事件中的值派生的，其中包括预期的参数，如from、to和data。

有关详细信息，请参阅协议规范中的[存款合约](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/deposits.md#deposit-contract)部分。

#### Purchasing guaranteed L2 gas on L1

Bedrock also specifies a gas burn mechanism and a fee market for [deposits](#deposits). The gas that [deposited transactions](#arbitrary-message-passing-from-l1) spend on an L2 is bought on L1 via a gas burn. This gas is purchased on a fee market and there is a hard cap on the amount of gas provided to all [deposits](#deposits) in a single L1 block. This mechanism is used to prevent denial of service attacks that could occur by writing transactions to L2 from L1 that are extremely gas-intensive on L2, but cheap on L1.

The gas provided to [deposited transactions](#arbitrary-message-passing-from-l1) is sometimes called "guaranteed gas." Guaranteed gas is unique in that it is paid for by burning gas on L1 and is therefore not refundable. The total amount of L1 gas that must be burned per unit of guaranteed L2 gas requested depends on the price of L2 gas reported by a EIP-1559 style fee mechanism. Furthermore, users receive a dynamic gas stipend based on the amount of L1 gas spent to compute updates to the fee mechanism.

For a deeper explanation, read the [deposits section](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/deposits.md#deposits) of the protocol specifications.
### 提现

**提现**是在L2上发起并通过在L1上执行的交易来完成的跨域交易。值得注意的是，提现可以由L2账户调用L1合约，或者将ETH从L2账户转移到L1账户。

提现是通过调用**Message Passer**预部署合约在L2上发起的，该合约将消息的重要属性记录在其存储中。提现是通过调用[OptimismPortal](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/withdrawals.md#the-optimism-portal-contract)合约在L1上完成的，该合约证明了该提现消息的包含。因此，提现与[存款](#deposits)不同。提现交易不依赖于[块派生](#block-derivation)，而是必须使用L1上的智能合约进行最终化。

#### 两步提现

提现证明验证漏洞是过去几年中许多最大桥梁黑客攻击的根本原因。Bedrock版本引入了提现过程的额外步骤，旨在为这些类型的漏洞提供额外的防御层。在两步提现过程中，必须在提现之前提交与提现相对应的Merkle证明，而这个过程需要7天的时间才能完成。这个新的安全机制给了监控工具整整7天的时间来发现和检测无效的提现证明。如果[提现](#withdrawals)证明被发现无效，可以在资金丢失之前部署合约修复。这大大降低了桥梁被攻击的风险。

有关详细信息，请参阅协议规范的[提现](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/withdrawals.md)部分。

### 批次

在Bedrock中，定义了L1和L2之间进行消息传递的一种线路格式（即L2从L1派生块和L2向L1写入交易）。这种线路格式旨在最大限度地减少向L1写入的成本和软件复杂性。

#### 优化的数据压缩

为了优化数据压缩，将L2交易的列表称为**序列器批次**，并将其组织成称为**通道**的对象组的形式，每个通道都有一个最大大小，该大小在[可配置参数](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/derivation.md#channel-format)中定义，初始设置为约9.5MB。这些[通道](#optimized-data-compression)预计将使用压缩函数进行压缩，并提交到L1。

#### 并行批次提交

为了并行化从序列器发送[压缩](#optimized-data-compression)的[通道](#optimized-data-compression)数据到L1的消息，将[通道](#optimized-data-compression)进一步分解为称为**通道帧**的块，这些块是可以适应单个L1交易中的[压缩](#optimized-data-compression)的[通道](#optimized-data-compression)数据的块。由于[通道帧](#parallelized-batch-submission)是相互独立的且顺序已知，序列器发送到L1的以太坊交易可以并行发送，从而最大限度地减少序列器软件的复杂性，并允许填充L1上的所有可用数据空间。

#### 最小化以太坊燃气的使用

Bedrock从将[L1系统](#block-derivation)使用的所有执行燃气从提交[通道](#optimized-data-compression)数据到L1的交易中移除。之前在L1上发生的所有验证逻辑都被移入到[块派生](#block-derivation)逻辑中。相反，[批次交易](#minimized-usage-of-ethereum-gas)被发送到以太坊上的单个EOA，称为**批次收件箱地址**。

批次仍然需要进行有效性检查（即它们必须正确编码），因此批次中的单个交易（例如签名必须有效）也需要进行有效性检查。无效的[批次](#optimized-data-compression)和在否则有效的批次中的无效的单个交易被视为被丢弃和与系统无关。

> 注意：以太坊将很快升级以包括[EIP-4844](https://eip4844.com/)，该协议引入了一个用于写入数据的单独费用市场，并增加了以太坊协议愿意存储的数据量的上限。这个变化预计进一步降低将数据发布到L1的成本。

有关更详细的解释，请阅读[线路格式规范](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/derivation.md#overview)。
### 块派生

在Bedrock中，协议旨在确保L1上的[存款](#deposits)的时间与[块派生](#block-derivation)的[规范L2链](#protocol)相一致。这是通过序列器写入L1的数据、[存款](#deposits)和L1块属性的纯函数来实现的。为了实现这一点，协议定义了保证存款包含、处理L1和L2时间戳以及在流水线中处理排序窗口的策略，以确保正确的排序。

#### 存款的保证包含

[block derivation](#block-derivation) 协议的目标是定义每隔“L2块时间”秒必须有一个L2块，并且L2块的时间戳与L1的时间戳保持同步（即确保[存款](#deposits)按照逻辑时间顺序包含在内）。

在Bedrock中，引入了**序列化时期**的概念：它是从一系列L1块派生的一系列L2块。每个[时期](#guaranteed-inclusion-of-deposits)由一个**时期号**标识，该号码等于序列化窗口中第一个L1块的块号。时期的大小可以有所不同，但受到一些约束。

批次派生流水线将与[时期号](#guaranteed-inclusion-of-deposits)相关联的L1块的时间戳视为确定L2上交易顺序的锚点。协议保证[时期](#guaranteed-inclusion-of-deposits)的第一个L2块永远不会落后于与[时期](#guaranteed-inclusion-of-deposits)匹配的L1块的时间戳。[时期](#guaranteed-inclusion-of-deposits)的第一个块必须包含L1上的存款，以确保存款将被处理。

请注意，Bedrock版本中L2的目标配置块时间为2秒。

#### 处理L1和L2的时间戳

Bedrock试图解决在L2上与[存款交易](#arbitrary-message-passing-from-l1)中的L1时间戳相一致的问题。它通过允许在[时期](#guaranteed-inclusion-of-deposits)之间的短时间窗口内自由地应用L2交易的时间戳来实现这一点。

一个**序列化窗口**是一系列L1块，可以从中派生一个[时期](#guaranteed-inclusion-of-deposits)。一个[序列化窗口](#handling-l1-and-l2-timestamps)的第一个L1块的编号为`N`，其中包含了[时期](#guaranteed-inclusion-of-deposits) `N` 的[批次交易](#minimized-usage-of-ethereum-gas)。

[序列化窗口](#handling-l1-and-l2-timestamps)包含块`[N, N + SWS)`，其中`SWS`是**序列化窗口大小**：一个固定的Rollup级别配置参数。该参数必须至少为2。增加它可以为序列器提供更多机会来根据[存款](#deposits)对L2交易进行排序，而降低它则会引入更严格的时间窗口，以便序列器提交批次交易。这是在创建MEV机会和增加软件复杂性之间的权衡。

一个名为**最大序列器漂移**的协议常量控制了块在其时期内可以具有的最大时间戳。有了这个漂移，序列器可以在连接到L1时出现临时问题时保持活动状态。每个L2块的时间戳都在以下范围内：

#### 块派生流水线

可以通过从L2创世状态开始，将L2链的起始设置为第一个时期，然后按顺序处理所有序列化窗口来处理[规范L2链](#protocol)。根据以下简化的流水线确定[批次交易](#minimized-usage-of-ethereum-gas)和[存款](#deposits)的正确顺序：

| **阶段** | **说明** |
| --- | --- |
| 从L1读取 | 时期由L1块定义。L2块中包含有关[批次交易](#minimized-usage-of-ethereum-gas)或[存款](#deposits)的数据，这些数据必须包含在[规范L2链](#protocol)中。 |
| 缓冲区和解码为[通道](#optimized-data-compression) | 来自L1块的数据包含无序的[通道帧](#parallelized-batch-submission)，在将它们重构为通道之前，必须收集所有的通道帧。 |
| 将[通道](#optimized-data-compression)解压缩为[批次](#optimized-data-compression) | 由于[通道](#optimized-data-compression)在L1上进行了[压缩](#optimized-data-compression)以最小化数据费用，因此它们必须进行解压缩。 |
| 将[批次](#optimized-data-compression)排队为顺序 | 根据来自L1的最新信息，可以验证和顺序处理[批次](#optimized-data-compression)。关于正确顺序与[L2时期](#guaranteed-inclusion-of-deposits)和L2时间戳的关系的一些细微差别，请参阅完整规范[此处](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/derivation.md#batch-queue)。 |
| 解释为L2块 | 此时，可以确定[批次](#optimized-data-compression)的正确顺序。<br><br>随后，[执行客户端](#execution-client)可以将它们解释为L2块。有关与[执行客户端](#execution-client)相关的实现细节，请参阅协议规范的[引擎队列](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/derivation.md#engine-queue)部分。 |

### 故障证明

在序列器处理一个或多个L2块之后，执行这些块中的交易所计算出的输出需要与L1一起写入，以实现L2到L1的可信执行，例如[提款](#withdrawals)。

在Bedrock中，输出以树形结构的形式进行哈希处理，以最小化证明输出中任何数据的成本。提议者定期提交整个[规范L2链](#protocol)的Merkle根，称为**输出根**，到L1上。

OP Stack代码库的未来升级应包括一种带有绑定的故障证明变体的规范，以激励提议者提出正确的输出根。

有关详细信息，请阅读协议规范中的[L2输出根提议部分](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/proposals.md#l2-output-root-proposals-specification)。

## 实现

在Bedrock中，OP Stack代码库严格遵循以太坊规范中指定的技术分离原则，通过模拟以太坊执行层和共识层之间的分离来实现。Bedrock以同样的方式引入了执行客户端和Rollup节点的分离。

### 执行客户端

**执行客户端**是顺序器和其他类型的节点运营者用来确定[规范L2链](#protocol)状态的系统。它还执行其他功能，如处理传入的交易并进行点对点通信，以及处理系统状态以进行查询。

在Bedrock中，OP Stack旨在重用[Ethereum自己的执行客户端规范](https://github.com/ethereum/execution-specs)及其众多实现。在此版本中，Bedrock对go-ethereum进行了极少量的修改，这是使用Go编写的最流行的以太坊客户端，[代码差异不到2000行](https://op-geth.optimism.io/)。

存在任何差异的根本原因有两个：处理存款交易和收取交易费用。

#### 处理存款交易

为了在Rollup中表示[存款交易](#arbitrary-message-passing-from-l1)，引入了一种额外的交易类型。[执行客户端](#execution-client)根据[EIP-2718类型化交易](https://eips.ethereum.org/EIPS/eip-2718)标准实现了这种[新的交易类型](https://github.com/ethereum-optimism/optimism/blob/7f5b9ea7bf6dce12dbf709c27c25ee1681df7f7e/specs/deposits.md#the-deposited-transaction-type)。

#### 收取交易费用

Rollup中的交易基本上有两种与之相关的费用：

**序列器费用**

运营序列器的成本使用与以太坊相同的gas表和[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)算法计算。这些费用归协议所有，根据网络的拥堵程度而波动。

**数据可用性费用**

数据可用性费用与将[批次交易](#minimized-usage-of-ethereum-gas)写入L1相关。这些费用旨在覆盖序列器需要支付的将[批次交易](#minimized-usage-of-ethereum-gas)提交到L1的成本。

在Bedrock中，数据可用性费用的部分是根据Rollup上的系统合约中的信息确定的，该合约称为[GasPriceOracle](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/predeploys.md#gaspriceoracle)。该合约在[块派生](#block-derivation)期间从L1块属性中检索的燃气定价信息进行更新，这些信息在每个[时期](#guaranteed-inclusion-of-deposits)开始时插入。

Bedrock规定，当使用JSON-RPC时，这两种费用将累加到一个名为`gasPrice`的字段中。

### Rollup Node

Unlike Ethereum, Bedrock does not have proof-of-stake consensus. Instead, the consensus of the [canonical L2 chain](#protocol) is defined by [block derivation](#block-derivation). An [execution client](#execution-client) of the OP Stack communicates to a new component that implements [block derivation](#block-derivation) called a **rollup node**. This node communicates to the [execution client](#execution-client) using the exact same [Engine API](https://github.com/ethereum/execution-apis/tree/main/src/engine) that Ethereum uses.

[Rollup节点](#rollup-node)是一个无状态的组件，负责通过读取L1上的数据和[存款](#deposits)来推导系统的状态。在Bedrock中，[Rollup节点](#rollup-node)可以用于对来自用户或其他[Rollup节点](#rollup-node)的传入交易进行排序，也可以通过仅依赖L1来验证在L1上发布的已确认交易。

下面概述了Rollup节点的多种用途。

#### 验证规范的L2链

运行[Rollup节点](#rollup-node)的最简单模式是仅跟随[规范的L2链](#protocol)。在此模式下，[Rollup节点](#rollup-node)没有对等节点，且严格用于从L1读取数据并根据[块派生](#block-derivation)协议规则进行解释。

此类节点的一个目的是验证其他节点共享的任何输出根或在L1上发布的输出根是否符合协议定义。此外，打算自己将输出根提交到L1的提议者可以使用节点的[optimism_outputAtBlock](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/rollup-node.md#l2-output-rpc-method)生成所需的输出根，该方法返回对应于L2输出根的32字节哈希值。

为此，节点只需跟随已最终确定的头部。术语“最终确定”指的是以太坊的权益证明共识（即规范且几乎不可逆转）-最终确定的L2头部是仅从已最终确定的L1块派生的[规范的L2链](#protocol)的头部。

#### 参与L2网络

使用[Rollup节点](#rollup-node)的最常见方式是参与其他[Rollup节点](#rollup-node)的网络，跟踪L2的进展和状态。在此模式下，[Rollup节点](#rollup-node)既从L1读取数据和[存款](#deposits)，将其解释为块，并接受来自用户和其他[Rollup节点](#rollup-node)的传入交易。

参与网络的节点可以使用L2的安全头部和不安全头部。

- **安全的L2头部**表示可以构建的Rollup，其中包括从参考L1链派生的每个块，而L1尚未最终确定（即L1仍可能发生重组）。
- **不安全的L2头部**包括尚未从L1派生的[不安全块](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/glossary.md#unsafe-l2-block)。这些块可以来自将[Rollup节点](#rollup-node)作为序列器运行，或者来自与序列器的[不安全同步](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/glossary.md#unsafe-sync)。这也被称为“最新”头部。在发生冲突时，将始终选择安全L2头部。当发生冲突时，链的不安全部分将重新组织。

对于大多数情况，L2网络中的节点将参考不安全的L2头部用于面向最终用户的应用程序。

#### 交易排序

使用[Rollup节点](#rollup-node)的第三种方式是进行交易排序。在此模式下，[Rollup节点](#rollup-node)将在不安全的L2头部之上创建新的区块。目前，每个OP Stack网络只有一个序列器。

序列器还负责将批次发布到L1，以供网络中的其他节点进行同步。

### 批处理器

序列器的角色是生成[批次](#batches)。为此，序列器可以运行[Rollup节点](#rollup-node)，并具有单独的进程，通过从其运行的可信[Rollup节点](#rollup-node)读取数据来执行[批处理](#batches)。这需要OP Stack的另一个组件，称为[批处理器](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/glossary.md#batcher)，它从[Rollup节点](#rollup-node)读取事务数据，并将其解释为要写入L1的[批处理器事务](#minimized-usage-of-ethereum-gas)。批处理器组件负责读取由序列器运行的[Rollup节点](#rollup-node)的不安全L2头部，创建批处理器事务，并将其写入L1。

### 标准桥接合约

Bedrock还包括一对用于最常见类型的[存款](#deposits)的桥接合约，称为[标准桥接](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/bridges.md#standard-bridges)。这些合约包装了[存款](#deposits)和[提款](#withdrawals)合约，以提供简单的接口用于[存款](#deposits)和[提款](#withdrawals)ETH和ERC-20代币。

这些桥接合约旨在涉及桥接的一侧是本地代币，而另一侧是可以管理铸造和销毁的包装代币。桥接本地代币涉及将本地代币锁定在合约中，然后在桥接的另一侧铸造相等数量的可铸造代币。

有关详细信息，请参阅协议规范的[标准桥接](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/bridges.md#standard-bridges)部分。

### Cannon

尽管[Cannon](https://github.com/ethereum-optimism/cannon)项目中实现了故障证明的构建和验证，但故障证明游戏规范和将输出根挑战者集成到Rollup节点中是后续规范里程碑的一部分。

## 进一步阅读

### 协议规范

协议规范定义了OP Stack代码库的技术细节。它是协议内部工作原理的最新真实来源。协议规范位于ethereum-optimism的[monorepo](https://github.com/ethereum-optimism/optimism/blob/d69cb12f6dcbe3d5355beca8997fbac611b7fe37/specs/README.md)中。

### Bedrock的差异

要深入了解Bedrock与协议之前版本之间的差异，请参阅[Bedrock有何不同？](https://community.optimism.io/docs/developers/bedrock/differences/)页面。
