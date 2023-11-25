---
title: 配置
lang: zh-CN
---

OP Stack是一个灵活的平台，具有各种配置值，您可以根据自己的特定需求进行调整。如果您想要微调部署，请继续阅读。

::: warning 🚧 施工中

OP Stack配置正在积极进行中，并且随着时间的推移可能会有重大变化。如果您的配置有问题，请随时查看此页面以了解是否有任何更改。

:::

## 新的区块链配置

新的OP Stack区块链目前使用Optimism存储库中的JSON文件进行配置。该文件是`<optimism repository>/packages/contracts-bedrock/deploy-config/<chain name>.json`。例如，[这是教程区块链的配置文件](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/deploy-config/getting-started.json)。


### 管理员账户

| 键 | 类型 | 描述 | 默认值 / 推荐值 |
| --- | --- | --- | --- |
| `finalSystemOwner` | L1地址 | 部署完成后将拥有L1上所有可拥有合约的地址，包括`ProxyAdmin`合约。 | 推荐使用单个管理员账户以保持统一的安全模型。 |
| `controller` | L1地址 | 将拥有`SystemDictator`合约并因此可以控制部署或升级的地址。 | 推荐使用单个管理员账户以保持统一的安全模型。 |
| `proxyAdminOwner` | L2地址 | 将拥有L2上的`ProxyAdmin`合约的地址。L2 `ProxyAdmin`合约拥有范围在`0x42...0000`到`0x42..2048`之间的所有预部署合约的`Proxy`合约。这使得预部署合约可以轻松升级。 | 推荐使用单个管理员账户以保持统一的安全模型。 |


### 手续费接收者

| 键 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `baseFeeVaultRecipient` | L1或L2地址 | L2上所有交易的基础手续费可以提取到的地址。 | 推荐使用单个管理员账户以保持统一的安全模型。 |
| `l1FeeVaultRecipient` | L1或L2地址 | L2上所有交易的L1数据费用可以提取到的地址。 | 推荐使用单个管理员账户以保持统一的安全模型。 |
| `sequencerFeeVaultRecipient` | L1或L2地址 | L2上所有交易的小费可以提取到的地址。 | 推荐使用单个管理员账户以保持统一的安全模型。 |

### 最小提款金额

| 键 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `baseFeeVaultMinimumWithdrawalAmount` | 以wei为单位的数字 | `BaseFeeVault`合约进行手续费提款所需的最小金额。 | 10 ether |
| `l1FeeVaultMinimumWithdrawalAmount` | 以wei为单位的数字 | `L1FeeVault`合约进行手续费提款所需的最小金额。 | 10 ether |
| `sequencerFeeVaultWithdrawalAmount` | 以wei为单位的数字 | `SequencerFeeVault`合约进行手续费提款所需的最小金额。 | 10 ether |

### 提款网络

| 键 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `baseFeeVaultWithdrawalNetwork` | 表示网络枚举的数字 | 值为`0`将资金提取到L1上的接收地址，值为`1`将资金提取到L2上的接收地址。 |
| `l1FeeVaultWithdrawalNetwork` | 表示网络枚举的数字 | 值为`0`将资金提取到L1上的接收地址，值为`1`将资金提取到L2上的接收地址。 |
| `sequencerFeeVaultWithdrawalNetwork` | 表示网络枚举的数字 | 值为`0`将资金提取到L1上的接收地址，值为`1`将资金提取到L2上的接收地址。 |

### 杂项

| 键 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `numDeployConfirmations` | 区块数量 | 在部署智能合约到L1时等待的确认数。 | 1 |
| `l1StartingBlockTag` | 区块哈希 | L2链开始同步的L1区块标签。通常建议使用已经最终化的区块，以避免重组问题。 |  |
| `l1ChainID` | 数字 | L1链的链ID。 | 1表示L1以太坊主网，<br> 5表示Goerli测试网络。 <br> [点击此处查看其他区块链](https://chainlist.org/?testnets=true)。 |
| `l2ChainID` | 数字 | L2链的链ID。 | 42069 |


### 区块

这些字段适用于L2区块：它们的时间、何时需要写入L1以及如何写入。

| 键 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `l2BlockTime` | 秒数 | 每个L2区块之间的秒数。必须小于等于L1区块时间（主网和Goerli上为12秒）。 | 2 |
| `maxSequencerDrift` | 秒数 | L2时间戳与实际L1时间戳之间的最大差距。 | 600（10分钟） |
| `sequencerWindowSize` | 区块数量 | Sequencer可以等待将特定L1区块中的信息合并的最大L1区块数。例如，如果窗口为`10`，则必须在L1区块`n+10`之前将L1区块`n`中的信息合并。 | 3600（12小时） |
| `channelTimeout` | 区块数量 | 事务通道帧被视为有效的最大L1区块数。事务通道帧是一批压缩的事务的一部分。超过超时时间后，帧将被丢弃。 | 300（1小时） |
| `p2pSequencerAddress` | L1地址 | Sequencer在p2p网络上用于签署区块的密钥地址。 | Sequencer，您拥有私钥的地址 |
| `batchInboxAddress` | L1地址 | Sequencer事务批次发送到的L1地址。 | 0xff00…0042069 |
| `batchSenderAddress` | L1地址 | 节点在搜索发送到`batchInboxAddress`的Sequencer事务批次时要过滤的账户地址。可以通过L1上的`SystemConfig`合约稍后进行更新。 | Batcher，您拥有私钥的地址 |


### 提案字段

这些字段适用于输出根提案。

| 键 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `l2OutputOracleStartingBlockNumber` | 数字 | 第一个OP Stack块的区块号。通常应为零，但对于已从传统系统（如Optimism Mainnet）升级的网络可能为非零值。将在添加无权限提案时删除。 | 0 |
| `l2OutputOracleStartingTimestamp` | 数字 | 第一个OP Stack块的时间戳。这必须是与`l1StartingBlockTag`定义的块对应的时间戳。将在添加无权限提案时删除。 |  |

| `l2OutputOracleSubmissionInterval` | 区块数 | 提交给`L2OutputOracle`的提案之间的区块数。将在添加无权限提案时删除。 | 120（24分钟） |
| `finalizationPeriodSeconds` | 秒数 | 提案在被`OptimismPortal`合约认为已最终化之前，必须可供挑战的秒数。 | 我们建议在测试网络上为12秒，在生产网络上为七天 |
| `l2OutputOracleProposer` | L1地址 | 允许向`L2OutputOracle`合约提交输出提案的地址。在添加无权限提案时将被删除。 |  |
| `l2OutputOracleChallenger` | L1地址 | 允许挑战提交给`L2OutputOracle`的输出提案的地址。在添加无权限挑战时将被删除。 | 建议使用单个管理员帐户以保持统一的安全模型。 |



### L1数据费用

这些字段适用于[L2交易的L1数据费用](https://community.optimism.io/docs/developers/build/transaction-fees/#the-l1-data-fee)。

| 键 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `gasPriceOracleOverhead` | 数字 | 每笔交易的固定L1燃气开销。默认值可能会根据来自Optimism Goerli部署的更多信息进行调整。 | 2100 |
| `gasPriceOracleScalar` | 数字 | 每笔交易的动态L1燃气开销，以6位小数表示。默认值为1000000，表示动态燃气开销为1x（无开销）。 | 1000000 |


### EIP 1559 gas algorithm

这些字段适用于在区块链上用于[L2执行成本](https://community.optimism.io/docs/developers/build/transaction-fees/#the-l2-execution-fee)的[EIP 1559算法](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)。

| 键 | 类型 | 描述 | 默认值 | L1以太坊上的值 |
| --- | --- | --- | --- | --- |
| `eip1559Denominator` | 数字 | 用于[L2上的EIP1559燃气定价机制](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)的分母。较大的分母减少了基础费用在单个区块中的变化量。 | 50 | 8 |
| `eip1559Elasticity` | 数字 | 用于[L2上的EIP1559燃气定价机制](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)的弹性。较大的弹性增加了每个区块的最大允许燃气限制。 | 10 | 2 |
| `l2GenesisBlockGasLimit` | 字符串 | 初始区块燃气限制，表示为十六进制字符串。默认值为25m，与10倍弹性结合时，表示2.5m的目标。 | 0x17D7840 |  |
| `l2GenesisBlockBaseFeePerGas` | 字符串 | 初始基础费用，用于避免初始时不稳定的EIP1559计算。初始值为1 gwei。 | 0x3b9aca00 |  |


### 治理代币

治理代币是在Optimism Mainnet网络中使用OP Stack的副作用。未来的版本可能不会默认包含它。

| 键 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `governanceTokenOwner` | L2地址 | 拥有默认部署到每个OP Stack基于链上的代币合约的地址。  |  |
| `governanceTokenSymbol` | 字符串 | 默认部署到每个OP Stack链上的代币的符号。 | OP |
| `governanceTokenName` | 字符串 | 默认部署到每个OP Stack链上的代币的名称。 | Optimism |
