---
title: 从 OP Stack 区块链中强制提取资产
lang: zh-CN
---


## 这是什么？

你在 OP Stack 区块链上拥有的任何资产都是由底层 L1 上的等值资产支持的，锁定在一个桥梁中。
在本文中，您将学习如何直接从 L1 提取这些资产。

请注意，这里的步骤需要访问 L2 端点。
但是，该 L2 端点可以是只读副本。


## 设置

与本文一起使用的代码可在[我们的教程存储库](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/op-stack/forced-withdrawal)中找到。

1. 克隆存储库，进入正确的目录并安装所需的依赖项。

   ```sh
   git clone https://github.com/ethereum-optimism/optimism-tutorial.git
   cd optimism-tutorial/op-stack/forced-withdrawal
   npm install
   ```

1. 复制环境设置变量。

   ```sh
   cp .env.example .env
   ```

1. 编辑 `.env` 文件以设置这些变量：

   | 变量                 | 含义 |
   | -------------------- | ------- |
   | L1URL                | L1 的 URL（如果您按照本网站上的说明进行操作，则为 Goerli）
   | L2URL                | 正在提取资产的 L2 的 URL
   | PRIV_KEY             | 拥有 L2 上 ETH 的账户的私钥。它还需要在 L1 上拥有 ETH 以提交交易
   | OPTIMISM_PORTAL_ADDR | L1 上 `OptimismPortalProxy` 的地址。


## 提款

### ETH 提款

将 ETH 提款到 L2 最简单的方法是将其发送到桥接器或跨域信使。

1. 进入 Hardhat 控制台。

   ```sh
   npx hardhat console --network l1
   ```

2. 指定要转移的 ETH 数量。
   以下代码将转移 0.01 个 ETH。

   ```js
   transferAmt = BigInt(0.01 * 1e18)
   ``` 

3. 为 [`OptimismPortal`](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/contracts/L1/OptimismPortal.sol) 合约创建一个合约对象。

   ```js
   optimismContracts = require("@eth-optimism/contracts-bedrock")
   optimismPortalData = optimismContracts.getContractDefinition("OptimismPortal")
   optimismPortal = new ethers.Contract(process.env.OPTIMISM_PORTAL_ADDR, optimismPortalData.abi, await ethers.getSigner())
   ```

4. 发送交易。

   ```js
   txn = await optimismPortal.depositTransaction(
      optimismContracts.predeploys.L2StandardBridge,
      transferAmt,
      1e6, false, []
   )
   rcpt = await txn.wait()
   ```

5. 要[证明](https://sdk.optimism.io/classes/crosschainmessenger#proveMessage-2)和[完成](https://sdk.optimism.io/classes/crosschainmessenger#finalizeMessage-2)消息，我们需要哈希值。
   Optimism 的[core-utils 包](https://www.npmjs.com/package/@eth-optimism/core-utils)中有必要的函数。

   ```js
   optimismCoreUtils = require("@eth-optimism/core-utils")
   withdrawalData = new optimismCoreUtils.DepositTx({
      from: (await ethers.getSigner()).address,
      to: optimismContracts.predeploys.L2StandardBridge,
      mint: 0,
      value: ethers.BigNumber.from(transferAmt),
      gas: 1e6,
      isSystemTransaction: false,
      data: "",
      domain: optimismCoreUtils.SourceHashDomain.UserDeposit,
      l1BlockHash: rcpt.blockHash,
      logIndex: rcpt.logs[0].logIndex,
   })
   withdrawalHash = withdrawalData.hash()
   ```

6. 根据[文档](../build/sdk.md)创建 L1 合约对象。
   创建一个类似下面的对象：

   ```js
   L1Contracts = {
      StateCommitmentChain: '0x0000000000000000000000000000000000000000',
      CanonicalTransactionChain: '0x0000000000000000000000000000000000000000',
      BondManager: '0x0000000000000000000000000000000000000000',
      AddressManager: '0x432d810484AdD7454ddb3b5311f0Ac2E95CeceA8',
      L1CrossDomainMessenger: '0x27E8cBC25C0Aa2C831a356bbCcc91f4e7c48EeeE',
      L1StandardBridge: '0x154EaA56f8cB658bcD5d4b9701e1483A414A14Df',
      OptimismPortal: '0x4AD19e14C1FD57986dae669BE4ee9C904431572C',
      L2OutputOracle: '0xE6Dfba0953616Bacab0c9A8ecb3a9BBa77FC15c0'
   }
   ```

7. 创建标准桥接器的数据结构。

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

8. 创建[跨域信使](https://sdk.optimism.io/classes/crosschainmessenger)。
   这一步以及后续的 ETH 提款步骤在[此教程](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/cross-dom-bridge-eth)中有详细说明。

   ```js
   optimismSDK = require("@eth-optimism/sdk")
   l2Provider = new ethers.providers.JsonRpcProvider(process.env.L2URL)
   await l2Provider._networkPromise
   crossChainMessenger = new optimismSDK.CrossChainMessenger({
      l1ChainId: ethers.provider.network.chainId,
      l2ChainId: l2Provider.network.chainId,
      l1SignerOrProvider: await ethers.getSigner(),
      l2SignerOrProvider: l2Provider,
      bedrock: true,
      contracts: {
         l1: l1Contracts
      },
      bridges: bridges
   })   
   ```

9. 等待提款消息的状态变为 `READY_TO_PROVE`。
   默认情况下，状态根每四分钟写入一次，所以你可能需要等待。

   ```js
   await crossChainMessenger.waitForMessageStatus(withdrawalHash, 
       optimismSDK.MessageStatus.READY_TO_PROVE)
   ```

10. 提交提款证明。

    ```js
    await crossChainMessenger.proveMessage(withdrawalHash)
    ```

11. 等待提款消息的状态变为 `READY_FOR_RELAY`。
    这等待挑战期（在生产环境中为 7 天，在测试网络中较短）。

    ```js
    await crossChainMessenger.waitForMessageStatus(withdrawalHash, 
       optimismSDK.MessageStatus.READY_FOR_RELAY)
    ```

12. 完成提款。
    查看你的余额是否减少了提款金额。

    ```js
    myAddr = (await ethers.getSigner()).address
    balance0 = await ethers.provider.getBalance(myAddr)
    finalTxn = await crossChainMessenger.finalizeMessage(withdrawalHash)
    finalRcpt = await finalTxn.wait()
    balance1 = await ethers.provider.getBalance(myAddr)
    withdrawnAmt = BigInt(balance1)-BigInt(balance0)
    ```

::: tip transferAmt > withdrawnAmt

由于 `crossChainMessenger.finalizeMessage` 的成本（提交交易），你的 L1 余额不会增加整个 `transferAmt`。

:::
