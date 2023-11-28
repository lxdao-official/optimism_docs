---
title: 暂停和恢复桥接
lang: zh-CN
---


## 为什么要这样做？

`OptimismPortal` 是一个桥接合约，它使得在你的L1和L2 OP Stack链之间发送消息成为可能。
`OptimismPortal` 可以被暂停，作为一种备用的安全机制，允许特定的 `GUARDIAN` 地址在必要时暂时停止存款和提款，以减轻安全问题。
如果一个OP Stack链不想使 `OptimismPortal` 合约可暂停，它可以指定一个诸如零的地址，而不必指定一个可用的 `GUARDIAN` 地址。


## 谁可以这样做？

[`OptimismPortal`](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/contracts/L1/OptimismPortal.sol) 有一个不可变的 `GUARDIAN` 地址。
该地址可以调用 [`pause`](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/contracts/L1/OptimismPortal.sol#L171-L178) 和 [`unpause`](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/contracts/L1/OptimismPortal.sol#L180-L187) 方法。


### 更改 guardian

由设置脚本创建的 guardian 是管理员账户。
这对于测试来说已经足够了，但对于生产系统，您希望 guardian 是一个具有受信任的安全委员会的多签名账户。

`GUARDIAN` 变量是不可变的，但 `OptimismPortal` 合约位于一个代理后面，因此可以通过将 `OptimismPortal` 代理指向一个新的实现合约来修改 `GUARDIAN`。
您可以使用L1 [`ProxyAdmin`](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/contracts/universal/ProxyAdmin.sol) 合约来完成这个操作。

<!--
## Seeing it in action

1. Set these environment variables

   | Variable | Meaning
   | - | - |
   | `PRIV_KEY` | Private key for your ADMIN account
   | `ADMIN_ADDR` | Address of the ADMIN account
   | `PORTAL_ADDR` | Portal proxy address, get from `.../optimism/packages/contracts-bedrock/deployments/getting-started/OptimismPortalProxy.json`
   | `GOERLI_RPC` | URL for an RPC to the L1 Goerli network 

1.  For using Foundry, set `ETH_RPC_URL`.

    ```sh
    export ETH_RPC_URL=$GOERLI_RPC
    ```

1. Check the balance of the ADMIN account.
   If it is too low you will not be able to submit transactions.

   ```sh
   cast balance $ADMIN_ADDR
   ```

1. Send a deposit to L2.

   ```sh
   cast send --private-key $PRIV_KEY --value 1gwei $PORTAL_ADDR
   ```

   Note the transaction hash.

1. Pause the portal.

   ```sh
   cast send --private-key $PRIV_KEY $PORTAL_ADDR "pause()"
   ```

1. Send a deposit to L2.

   ```sh
   cast send --private-key $PRIV_KEY --value 1gwei $PORTAL_ADDR
   ```

   Note the transaction hash.

1. Wait ten minutes and see which transaction(s) have been relayed using the [SDK](../build/sdk.md). 
   Use [`getMessageStatus`](https://sdk.optimism.io/classes/crosschainmessenger#getMessageStatus) to get the information.



1. Unpause the portal.

   ```sh
   cast send --private-key $PRIV_KEY $PORTAL_ADDR "pause()"
   ```
-->
