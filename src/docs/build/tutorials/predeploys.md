---
title: 修改预部署合约
lang: zh-CN
---

::: warning 🚧 OP Stack Hacks 是一些可以使用 OP Stack 进行的操作，目前并不适用于生产环境

OP Stack Hacks 不适合新手。您将无法获得针对 OP Stack Hacks 的重要开发者支持 - 请准备好亲自动手并在没有支持的情况下工作。

:::


OP Stack 区块链有许多[预部署合约](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/src/constants.ts)，提供重要的功能。
其中大部分合约都是代理合约，可以使用在网络初始部署时配置的 `proxyAdminOwner` 进行升级。

预部署合约由名为 [`ProxyAdmin`](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/contracts/universal/ProxyAdmin.sol) 的合约控制，其地址为 `0x4200000000000000000000000000000000000018`。
要调用的函数是 [`upgrade(address,address)`](https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/contracts/universal/ProxyAdmin.sol#L205-L229)。
第一个参数是要升级的代理合约，第二个参数是新实现的地址。

例如，旧版的 `L1BlockNumber` 合约位于 `0x420...013`。
为了禁用此功能，我们将实现设置为 `0x00...00`。
我们使用 [Foundry](https://book.getfoundry.sh/) 命令 `cast` 来完成此操作。

1. 我们需要几个常量。

   - 在您的终端中将这些地址设置为变量。

        ```sh
        L1BLOCKNUM=0x4200000000000000000000000000000000000013
        PROXY_ADMIN=0x4200000000000000000000000000000000000018
        ZERO_ADDR=0x0000000000000000000000000000000000000000
        ```

   - 将 `PRIVKEY` 设置为您的 ADMIN 账户的私钥。

   - 设置 `ETH_RPC_URL`。如果您在运行区块链的计算机上，请使用以下命令。

        ```sh
        export ETH_RPC_URL=http://localhost:8545
        ```

1. 验证 `L1BlockNumber` 正常工作。
   查看调用合约时是否返回一个区块号，十二秒后是否返回下一个区块号（L1上的区块时间为十二秒）。

   ```sh
   cast call $L1BLOCKNUM 'number()' | cast --to-dec
   sleep 12 && cast call $L1BLOCKNUM 'number()' | cast --to-dec
   ```

1. 获取合约的当前实现。

   ```sh
   L1BLOCKNUM_IMPLEMENTATION=`cast call $L1BLOCKNUM "implementation()" | sed 's/000000000000000000000000//'`
   echo $L1BLOCKNUM_IMPLEMENTATION 
   ```

1. 将实现更改为零地址   

   ```sh
   cast send --private-key $PRIVKEY $PROXY_ADMIN "upgrade(address,address)" $L1BLOCKNUM $ZERO_ADDR
   ```

1. 查看实现地址是否为零，并且调用失败。

   ```sh
   cast call $L1BLOCKNUM 'implementation()'
   cast call $L1BLOCKNUM 'number()'
   ```

1. 将预部署合约修复为先前的实现，并验证其是否正常工作。


   ```sh
   cast send --private-key $PRIVKEY $PROXY_ADMIN "upgrade(address,address)" $L1BLOCKNUM $L1BLOCKNUM_IMPLEMENTATION
   cast call $L1BLOCKNUM 'number()' | cast --to-dec
   ```