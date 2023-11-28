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

### Accessing L1 information

If you need the equivalent information from the latest L1 block, you can get it from [the `L1Block` contract](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/contracts/L2/L1Block.sol).
This contract is a predeploy at address [`0x4200000000000000000000000000000000000015`](https://goerli-optimism.etherscan.io/address/0x4200000000000000000000000000000000000015).
You can use [the getter functions](https://docs.soliditylang.org/en/v0.8.12/contracts.html#getter-functions) to get these parameters:

- `number`: The latest L1 block number known to L2
- `timestamp`: The timestamp of the latest L1 block
- `basefee`: The base fee of the latest L1 block
- `hash`: The hash of the latest L1 block
- `sequenceNumber`: The number of the L2 block within the epoch (the epoch changes when there is a new L1 block)

### Address Aliasing

<details>

Because of the behavior of the `CREATE` opcode, it is possible for a user to create a contract on L1 and on L2 that share the same address but have different bytecode.
This can break trust assumptions, because one contract may be trusted and another be untrusted (see below).
To prevent this problem the behavior of the `ORIGIN` and `CALLER` opcodes (`tx.origin` and `msg.sender`) differs slightly between L1 and L2.

The value of `tx.origin` is determined as follows:


| Call source                        | `tx.origin`                                |
| ---------------------------------- | ------------------------------------------ | 
| L2 user (Externally Owned Account) | The user's address (same as in Ethereum)   |
| L1 user (Externally Owned Account) | The user's address (same as in Ethereum)   |
| L1 contract (using `CanonicalTransactionChain.enqueue`) | `L1_contract_address + 0x1111000000000000000000000000000000001111` |


The value of `msg.sender` at the top-level (the very first contract being called) is always equal to `tx.origin`.
Therefore, if the value of `tx.origin` is affected by the rules defined above, the top-level value of `msg.sender` will also be impacted.

Note that in general, [`tx.origin` should *not* be used for authorization](https://docs.soliditylang.org/en/latest/security-considerations.html#tx-origin). 
However, that is a separate issue from address aliasing because address aliasing also affects `msg.sender`.



#### Why is address aliasing an issue?


The problem with two identical source addresses (the L1 contract and the L2 contract) is that we extend trust based on the address.
It is possible that we will want to trust one of the contracts, but not the other.

1. Helena Hacker forks [Uniswap](https://uniswap.org/) to create her own exchange (on L2), called Hackswap.

   **Note:** There are actually multiple contracts in Uniswap, so this explanation is a bit simplified.
   [See here if you want additional details](https://ethereum.org/en/developers/tutorials/uniswap-v2-annotated-code/).

1. Helena Hacker provides Hackswap with liquidity that appears to allow for profitable arbitrage opportunities.
   For example, she can make it so that you can spend 1 [DAI](https://www.coindesk.com/price/dai/)to buy 1.1 [USDT](https://www.coindesk.com/price/tether/).
   Both of those coins are supposed to be worth exactly $1. 

1. Nimrod Naive knows that if something looks too good to be true it probably is.
   However, he checks the Hackswap contract's bytecode and verifies it is 100% identical to Uniswap.
   He decides this means the contract can be trusted to behave exactly as Uniswap does.

1. Nimrod approves an allowance of 1000 DAI for the Hackswap contract.
   Nimrod expects to call the swap function on Hackswap and receive back nearly 1100 USDT.


1. Before Nimrod's swap transaction is sent to the blockchain, Helena Hacker sends a transaction from an L1 contract with the same address as Hackswap.
   This transaction transfers 1000 DAI from Nimrod's address to Helena Hacker's address.
   If this transaction were to come from the same address as Hackswap on L2, it would be able to transfer the 1000 DAI because of the allowance Nimrod *had* to give Hackswap in the previous step to swap tokens.
   
   Nimrod, despite his naivete, is protected because Optimism modified the transaction's `tx.origin` (which is also the initial `msg.sender`).
   That transaction comes from a *different* address, one that does not have the allowance.

**Note:** It is simple to create two different contracts on the same address in different chains. 
But it is nearly impossible to create two that are different by a specified amount, so Helena Hacker can't do that.

</details>


## Blocks

There are several differences in the way blocks are produced between L1 Ethereum and Optimism Bedrock.


| Parameter           | L1 Ethereum | Optimism Bedrock |
| - | - | - |
| Time between blocks | 12 seconds(1)  | 2 seconds |
| Block target size   | 15,000,000 gas | to be determined |
| Block maximum size  | 30,000,000 gas | to be determined | 

(1) This is the ideal. 
    If any blocks are missed it could be an integer multiple such as 24 seconds, 36 seconds, etc.

**Note:** The L1 Ethereum parameter values are taken from [ethereum.org](https://ethereum.org/en/developers/docs/blocks/#block-time). The Optimism Bedrock values are taken from [the Optimism specs](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/specs/guaranteed-gas-market.md#limiting-guaranteed-gas).



## Network specifications

### JSON-RPC differences

OP Stack codebase uses the same [JSON-RPC API](https://eth.wiki/json-rpc/API) as Ethereum.
Some additional OP Stack specific methods have been introduced.
See the full list of [custom JSON-RPC methods](https://community.optimism.io/docs/developers/build/json-rpc/) for more information.


### Pre-EIP-155 support

[Pre-EIP-155](https://eips.ethereum.org/EIPS/eip-155) transactions do not have a chain ID, which means a transaction on one Ethereum blockchain can be replayed on others.
This is a security risk, so pre-EIP-155 transactions are not supported on OP Stack by default.


## Transaction costs

[By default, transaction costs on OP Stack chains](https://community.optimism.io/docs/developers/build/transaction-fees/) include an [L2 execution fee](https://community.optimism.io/docs/developers/build/transaction-fees#the-l2-execution-fee) and an [L1 data fee](https://community.optimism.io/docs/developers/build/transaction-fees#the-l1-data-fee). 

