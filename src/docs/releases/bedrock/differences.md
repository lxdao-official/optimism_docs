---
title: Bedrock与L1以太坊之间的差异
lang: zh-CN
---

需要注意的是，在Optimism和以太坊之间存在一些细微差异。
在构建基于Optimism或OP Stack代码库的应用程序时，您应该了解这些差异。

## 操作码差异


| 操作码  | Solidity等效操作 | 行为 |
| - | - | - |
| `COINBASE`	| `block.coinbase`   | 未定义 |
| `DIFFICULTY` | `block.difficulty` | 随机值。由于该值由序列器设置，因此其随机性不如L1等效操作码可靠。 |
| `NUMBER`     | `block.number`     | L2块编号 |
| `TIMESTAMP`  | `block.timestamp`  | L2块的时间戳 |
| `ORIGIN`     | `tx.origin`        | 如果交易是L1⇒L2交易，则`tx.origin`设置为触发L1⇒L2交易的地址的[别名地址](#address-aliasing)。否则，此操作码的行为与正常情况下相同。 |
| `CALLER`     | `msg.sender`      | 如果交易是L1⇒L2交易，并且这是初始调用（而不是一个合约之间的内部交易），则同样适用[地址别名](#address-aliasing)行为。

::: tip `tx.origin == msg.sender`

在L1以太坊上，只有当智能合约直接从外部拥有的账户（EOA）调用时，`tx.origin`等于`msg.sender`。
然而，在Optimism上，`tx.origin`是在Optimism上的原始地址。
它可以是一个EOA。
然而，在来自L1的消息的情况下，一个来自L1上的智能合约的消息可能在L2上出现，其中`tx.origin == msg.origin`。
这不太可能产生重大影响，因为L1智能合约不能直接操作L2状态。
然而，可能存在我们没有考虑到的边界情况，这可能会有所影响。

:::

### 访问L1信息

如果您需要从最新的L1区块获取等效信息，可以从[L1Block合约](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/contracts/L2/L1Block.sol)中获取。
该合约是一个预部署合约，地址为[`0x4200000000000000000000000000000000000015`](https://goerli-optimism.etherscan.io/address/0x4200000000000000000000000000000000000015)。
您可以使用[getter函数](https://docs.soliditylang.org/en/v0.8.12/contracts.html#getter-functions)获取这些参数：

- `number`：L2已知的最新L1区块号
- `timestamp`：最新L1区块的时间戳
- `basefee`：最新L1区块的基础费用
- `hash`：最新L1区块的哈希值
- `sequenceNumber`：L2区块在时期内的编号（当有新的L1区块时，时期会更改）

### 地址别名

<details>

由于`CREATE`操作码的行为，用户可以在L1和L2上创建具有相同地址但具有不同字节码的合约。
这可能会破坏信任假设，因为一个合约可能被信任，而另一个合约可能不被信任（见下文）。
为了防止这个问题，在L1和L2之间，`ORIGIN`和`CALLER`操作码（`tx.origin`和`msg.sender`）的行为略有不同。

`tx.origin`的值如下确定：

| 调用来源                           | `tx.origin`                                |
| ---------------------------------- | ------------------------------------------ | 
| L2用户（外部拥有的账户）           | 用户的地址（与以太坊相同）                 |
| L1用户（外部拥有的账户）           | 用户的地址（与以太坊相同）                 |
| L1合约（使用`CanonicalTransactionChain.enqueue`） | `L1_contract_address + 0x1111000000000000000000000000000000001111` |

在顶层（即第一个被调用的合约）的`msg.sender`的值始终等于`tx.origin`。
因此，如果`tx.origin`的值受到上述规则的影响，顶层的`msg.sender`值也会受到影响。

请注意，通常情况下，[`tx.origin`不应用于授权](https://docs.soliditylang.org/en/latest/security-considerations.html#tx-origin)。
然而，这与地址别名是一个独立的问题，因为地址别名也会影响`msg.sender`。


#### 为什么地址别名是一个问题？

两个相同的源地址（L1合约和L2合约）的问题在于我们基于地址来扩展信任。
我们可能希望信任其中一个合约，但不信任另一个合约。

1. Helena Hacker分叉[Uniswap](https://uniswap.org/)创建了自己的交易所（在L2上），名为Hackswap。

   **注意：**实际上Uniswap中有多个合约，所以这个解释有点简化。
   [如果您想要更多详细信息，请参阅此处](https://ethereum.org/en/developers/tutorials/uniswap-v2-annotated-code/)。

2. Helena Hacker为Hackswap提供了流动性，看起来可以进行有利可图的套利机会。
   例如，她可以使您可以花费1个[DAI](https://www.coindesk.com/price/dai/)购买1.1个[USDT](https://www.coindesk.com/price/tether/)。
   这两种代币都应该价值正好1美元。

3. Nimrod Naive知道如果某事看起来太好了，那可能就是假的。
   然而，他检查了Hackswap合约的字节码，并验证它与Uniswap完全相同。
   他决定这意味着该合约可以被信任，行为与Uniswap完全相同。

4. Nimrod为Hackswap合约批准了1000个DAI的津贴。
   Nimrod期望调用Hackswap的交换函数，并收到近1100个USDT。

5. 在Nimrod的交换交易发送到区块链之前，Helena Hacker从与Hackswap在L2上相同地址的L1合约发送了一笔交易。
   该交易将1000个DAI从Nimrod的地址转移到Helena Hacker的地址。
   如果这笔交易来自与之前步骤中Nimrod必须给Hackswap授权的相同地址，它将能够转移这1000个DAI。
   
   尽管Nimrod很天真，但他受到了Optimism修改的交易的保护，其中的`tx.origin`（也是初始的`msg.sender`）被修改了。
   该交易来自一个*不同的*地址，该地址没有这个津贴。

**注意：**在不同的链上创建两个不同的合约很简单。
但是几乎不可能创建两个相差指定数量的不同合约，所以Helena Hacker无法做到这一点。

</details>


## 区块

在L1以太坊和Optimism Bedrock之间，区块的生成方式有几个不同之处。


| 参数                | L1以太坊     | Optimism Bedrock |
| ------------------- | ------------ | ---------------- |
| 区块之间的时间间隔  | 12秒(1)      | 2秒              |
| 区块目标大小        | 15,000,000 gas | 待确定           |
| 区块最大大小        | 30,000,000 gas | 待确定           | 

(1) 这是理想情况。
    如果有任何区块被错过，可能是12秒的整数倍，如24秒、36秒等。

**注意：**L1以太坊的参数值取自[ethereum.org](https://ethereum.org/en/developers/docs/blocks/#block-time)。
Optimism Bedrock的参数值取自[Optimism规范](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/specs/guaranteed-gas-market.md#limiting-guaranteed-gas)。



## 网络规范

### JSON-RPC差异

OP Stack代码库使用与以太坊相同的[JSON-RPC API](https://eth.wiki/json-rpc/API)。
还引入了一些OP Stack特定的方法。
有关更多信息，请参阅[自定义JSON-RPC方法的完整列表](https://community.optimism.io/docs/developers/build/json-rpc/)。


### Pre-EIP-155支持

[Pre-EIP-155](https://eips.ethereum.org/EIPS/eip-155)交易没有链ID，这意味着在一个以太坊区块链上的交易可以在其他区块链上重放。
这是一个安全风险，因此默认情况下OP Stack不支持Pre-EIP-155交易。


## 交易成本

[默认情况下，OP Stack链上的交易成本](https://community.optimism.io/docs/developers/build/transaction-fees/)包括[L2执行费用](https://community.optimism.io/docs/developers/build/transaction-fees#the-l2-execution-fee)和[L1数据费用](https://community.optimism.io/docs/developers/build/transaction-fees#the-l1-data-fee)。

