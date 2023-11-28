---
title: 使用 OP Stack Client SDK
lang: zh-CN
---


## 原生支持的链

[OP Stack Client SDK](https://sdk.optimism.io/) 原生支持多个 OP 链：OP、Base 等。
要查看特定的 OP 链是否直接支持，请参阅[文档](https://sdk.optimism.io/enums/l2chainid)。

## 非原生支持的链

如果您正在使用一个*非*原生支持的链，例如您刚刚创建的 OP Stack 链[（参见此处）](./getting-started.md)，您仍然可以使用[OP Stack Client SDK](https://sdk.optimism.io/)。
您只需要向 `CrossDomainMessenger` 提供一些合约地址，因为它们没有预配置。

### 获取合约地址

#### L1 合约地址

如果您按照[入门指南](./getting-started.md)中的说明操作，合约地址位于 `.../optimism/packages/contracts-bedrock/deployments/getting-started`，这是您部署 L1 合约时创建的。

| 创建 `CrossDomainMessenger` 时的合约名称 | 包含地址的文件 |
| - | - |
| `AddressManager`         | `Lib_AddressManager.json`
| `L1CrossDomainMessenger` | `Proxy__OVM_L1CrossDomainMessenger.json`
| `L1StandardBridge`       | `Proxy__OVM_L1StandardBridge.json`
| `OptimismPortal`         | `OptimismPortalProxy.json`
| `L2OutputOracle`         | `L2OutputOracleProxy.json`


#### 不需要的合约地址

SDK 需要某些合约作为健全性检查，但实际上并不使用这些合约。
对于这些合约，您只需指定零地址：

- `StateCommitmentChain`
- `CanonicalTransactionChain`
- `BondManager`

在 JavaScript 中，您可以使用表达式 `"0x".padEnd(42, "0")` 创建零地址。

### CrossChainMessenger 对象

这些步骤假设您在[Hardhat 控制台](https://hardhat.org/hardhat-runner/docs/guides/hardhat-console)中。
它们进一步假设您的项目已经包含了 Optimism SDK [`@eth-optimism/sdk`](https://www.npmjs.com/package/@eth-optimism/sdk)。

1. 导入 SDK

   ```js
   optimismSDK = require("@eth-optimism/sdk")
   ```

1. 设置配置参数。

   | 变量名 | 值 |
   | - | - |
   | `l1Url` | L1 的 RPC 提供程序的 URL，例如 `https://eth-goerli.g.alchemy.com/v2/<api key>` |
   | `l2Url` | 您的 OP Stack 的 URL。如果在同一台计算机上运行，则为 `http://localhost:8545` |
   | `privKey` | 在 L1 上有一些 ETH 的帐户的私钥 |


1. 创建[提供程序](https://docs.ethers.org/v5/api/providers/)和[签名者](https://docs.ethers.org/v5/api/signer/)。

   ```js
   l1Provider = new ethers.providers.JsonRpcProvider(l1Url)
   l2Provider = new ethers.providers.JsonRpcProvider(l2Url)
   l1Signer = new ethers.Wallet(privKey).connect(l1Provider)
   l2Signer = new ethers.Wallet(privKey).connect(l2Provider)
   ```

1. 创建 L1 合约结构。

   ```js
   zeroAddr = "0x".padEnd(42, "0")
   l1Contracts = {
      StateCommitmentChain: zeroAddr,
      CanonicalTransactionChain: zeroAddr,
      BondManager: zeroAddr,
      // 这些合约具有您之前找到的地址。
      AddressManager: "0x....",   // Lib_AddressManager.json
      L1CrossDomainMessenger: "0x....",   // Proxy__OVM_L1CrossDomainMessenger.json  
      L1StandardBridge: "0x....",   // Proxy__OVM_L1StandardBridge.json
      OptimismPortal: "0x....",   // OptimismPortalProxy.json
      L2OutputOracle: "0x....",   // L2OutputOracleProxy.json
   }                       
   ```

1. 创建标准桥接的数据结构。

   ```js
    bridges = { 
      Standard: { 
         l1Bridge: l1Contracts.L1StandardBridge, 
         l2Bridge: "0x4200000000000000000000000000000000000010", 
         Adapter: optimismSDK.StandardBridgeAdapter
      },
      ETH: {
         l1Bridge: l1Contracts.L1StandardBridge, 
         l2Bridge: "0x4200000000000000000000000000000000000010", 
         Adapter: optimismSDK.ETHBridgeAdapter
      }
   }
   ```


1. 创建[`CrossChainMessenger`](https://sdk.optimism.io/classes/crosschainmessenger) 对象。

   ```js
   crossChainMessenger = new optimismSDK.CrossChainMessenger({
      bedrock: true,
      contracts: {
         l1: l1Contracts
      },
      bridges: bridges,
      l1ChainId: await l1Signer.getChainId(),
      l2ChainId: await l2Signer.getChainId(),
      l1SignerOrProvider: l1Signer,
      l2SignerOrProvider: l2Signer,    
   })
   ```

### 验证 SDK 功能

为了验证 SDK 的功能，将一些 ETH 从 L1 转移到 L2。

1. 获取当前余额。

   ```js
   balances0 = [
      await l1Provider.getBalance(l1Signer.address),
      await l2Provider.getBalance(l1Signer.address)
   ]
   ```

1. 转移 1 gwei。

   ```js
   tx = await crossChainMessenger.depositETH(1e9)
   rcpt = await tx.wait()
   ```

1. 获取转移后的余额。

   ```js
   balances1 = [
      await l1Provider.getBalance(l1Signer.address),
      await l2Provider.getBalance(l1Signer.address)
   ]
   ```

1. 查看 L1 余额是否发生变化（可能远远超过 1 gwei，因为交易的成本）。

   ```js
   (balances0[0]-balances1[0])/1e9
   ```

1. 查看 L2 余额是否发生变化（可能需要几分钟）。

   ```js
   ((await l2Provider.getBalance(l1Signer.address))-balances0[1])/1e9
   ```
