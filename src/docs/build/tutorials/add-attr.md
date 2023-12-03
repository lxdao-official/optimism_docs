---
title: 向派生函数添加属性
lang: zh-CN
---

::: warning 🚧 OP Stack Hacks 是一些明确不适用于生产环境的 OP Stack 技巧

OP Stack Hacks 不适合新手。您将无法获得针对 OP Stack Hacks 的重要开发者支持 - 请准备好自己动手并在没有支持的情况下工作。

:::


## 概述

在本指南中，我们将修改 Bedrock Rollup。虽然有很多修改 OP Stack 的方法，但在本教程中，我们将专注于修改派生函数。具体而言，我们将更新派生函数以跟踪在 L1 上燃烧的 ETH 的数量！谁会告诉 [ultrasound.money](http://ultrasound.money) 他们应该用 OP Stack 链替换后端呢？

## 获取灵感

让我们快速回顾一下我们即将做的事情。`op-node` 负责生成引擎 API 负载，以触发 `op-geth` 生成区块和交易。`op-node` 已经为每个 L1 块生成了一个“系统交易”，用于向 L2 链传递有关当前 L1 状态的信息。我们将修改 `op-node`，添加一个新的系统交易，报告每个块中的总燃烧金额（基础费用乘以使用的 gas）。

虽然听起来可能很复杂，但整个过程只涉及部署一个智能合约，向 `op-node` 添加一个新文件，并修改 `op-node` 中的一个现有文件。这将是无痛的。让我们开始吧！

## 部署燃烧合约

我们将在 Rollup 上使用一个智能合约来存储 `op-node` 对 L1 燃烧的报告。以下是我们智能合约的代码：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title L1Burn
 * @notice L1Burn keeps track of the total amount of ETH burned on L1.
 */
contract L1Burn {
    /**
     * @notice Total amount of ETH burned on L1.
     */
    uint256 public total;

    /**
     * @notice Mapping of blocks numbers to total burn.
     */
    mapping (uint64 => uint256) public reports;

    /**
     * @notice Allows the system address to submit a report.
     *
     * @param _blocknum L1 block number the report corresponds to.
     * @param _burn     Amount of ETH burned in the block.
     */
    function report(uint64 _blocknum, uint64 _burn) external {
        require(
            msg.sender == 0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001,
            "L1Burn: reports can only be made from system address"
        );

        total += _burn;
        reports[_blocknum] = total;
    }

    /**
     * @notice Tallies up the total burn since a given block number.
     *
     * @param _blocknum L1 block number to tally from.
     *
     * @return Total amount of ETH burned since the given block number;
     */
    function tally(uint64 _blocknum) external view returns (uint256) {
        return total - reports[_blocknum];
    }
}
```

将这个智能合约部署到您的 L2（使用任何您方便的工具）。记下合约部署的地址，因为您一会儿会用到它。简单！

## 添加燃烧交易

现在我们需要在 `op-node` 中添加逻辑，以便在生成 L1 块时自动提交燃烧报告。由于这个交易与报告其他 L1 块信息的系统交易非常相似（在 [l1_block_info.go](https://github.com/ethereum-optimism/optimism/blob/c9cd1215b76111888e25ee27a49a0bc0c4eeb0f8/op-node/rollup/derive/l1_block_info.go) 中找到），我们将使用该交易作为起点。
1. 导航到 `op-node` 包：

    ```bash
    cd ~/optimism/op-node
    ```

1. 在 `rollup/derive` 文件夹中创建一个名为 `l1_burn_info.go` 的新文件：

    ```bash
    touch rollup/derive/l1_burn_info.go
    ```

1. 将以下内容粘贴到 `l1_burn_info.go` 文件中，并确保将 `YOUR_BURN_CONTRACT_HERE` 替换为您刚刚部署的 `L1Burn` 合约的地址。

    ```go
    package derive

    import (
        "bytes"
        "encoding/binary"
        "fmt"
        "math/big"

        "github.com/ethereum/go-ethereum/common"
        "github.com/ethereum/go-ethereum/core/types"
        "github.com/ethereum/go-ethereum/crypto"

        "github.com/ethereum-optimism/optimism/op-node/eth"
    )

    const (
        L1BurnFuncSignature = "report(uint64,uint64)"
        L1BurnArguments     = 2
        L1BurnLen           = 4 + 32*L1BurnArguments
    )

    var (
        L1BurnFuncBytes4 = crypto.Keccak256([]byte(L1BurnFuncSignature))[:4]
        L1BurnAddress    = common.HexToAddress("YOUR_BURN_CONTRACT_HERE")
    )

    type L1BurnInfo struct {
        Number uint64
        Burn   uint64
    }

    func (info *L1BurnInfo) MarshalBinary() ([]byte, error) {
        data := make([]byte, L1BurnLen)
        offset := 0
        copy(data[offset:4], L1BurnFuncBytes4)
        offset += 4
        binary.BigEndian.PutUint64(data[offset+24:offset+32], info.Number)
        offset += 32
        binary.BigEndian.PutUint64(data[offset+24:offset+32], info.Burn)
        return data, nil
    }

    func (info *L1BurnInfo) UnmarshalBinary(data []byte) error {
        if len(data) != L1InfoLen {
            return fmt.Errorf("data is unexpected length: %d", len(data))
        }
        var padding [24]byte
        offset := 4
        info.Number = binary.BigEndian.Uint64(data[offset+24 : offset+32])
        if !bytes.Equal(data[offset:offset+24], padding[:]) {
            return fmt.Errorf("l1 burn tx number exceeds uint64 bounds: %x", data[offset:offset+32])
        }
        offset += 32
        info.Burn = binary.BigEndian.Uint64(data[offset+24 : offset+32])
        if !bytes.Equal(data[offset:offset+24], padding[:]) {
            return fmt.Errorf("l1 burn tx burn exceeds uint64 bounds: %x", data[offset:offset+32])
        }
        return nil
    }

    func L1BurnDepositTxData(data []byte) (L1BurnInfo, error) {
        var info L1BurnInfo
        err := info.UnmarshalBinary(data)
        return info, err
    }

    func L1BurnDeposit(seqNumber uint64, block eth.BlockInfo, sysCfg eth.SystemConfig) (*types.DepositTx, error) {
        infoDat := L1BurnInfo{
            Number: block.NumberU64(),
            Burn:   block.BaseFee().Uint64() * block.GasUsed(),
        }
        data, err := infoDat.MarshalBinary()
        if err != nil {
            return nil, err
        }
        source := L1InfoDepositSource{
            L1BlockHash: block.Hash(),
            SeqNumber:   seqNumber,
        }
        return &types.DepositTx{
            SourceHash:          source.SourceHash(),
            From:                L1InfoDepositerAddress,
            To:                  &L1BurnAddress,
            Mint:                nil,
            Value:               big.NewInt(0),
            Gas:                 150_000_000,
            IsSystemTransaction: true,
            Data:                data,
        }, nil
    }

    func L1BurnDepositBytes(seqNumber uint64, l1Info eth.BlockInfo, sysCfg eth.SystemConfig) ([]byte, error) {
        dep, err := L1BurnDeposit(seqNumber, l1Info, sysCfg)
        if err != nil {
            return nil, fmt.Errorf("failed to create L1 burn tx: %w", err)
        }
        l1Tx := types.NewTx(dep)
        opaqueL1Tx, err := l1Tx.MarshalBinary()
        if err != nil {
            return nil, fmt.Errorf("failed to encode L1 burn tx: %w", err)
        }
        return opaqueL1Tx, nil
    }
    ```


    如果你感兴趣，可以随意查看这个文件。它相对简单，主要是定义了一个新的交易类型，并描述了如何对该交易进行编码。

## 插入燃烧交易

最后，我们需要更新 `~/optimism/op-node/rollup/derive/attributes.go` 文件，将新的燃烧交易插入到每个区块中。您需要进行以下更改：

1. 找到以下代码行：
    
    ```go
    l1InfoTx, err := L1InfoDepositBytes(seqNumber, l1Info, sysConfig)
    if err != nil {
          return nil, NewCriticalError(fmt.Errorf("failed to create l1InfoTx: %w", err))
    }
    ```
    
1. 在这些代码行之后，添加以下代码片段：
    
    ```go
    l1BurnTx, err := L1BurnDepositBytes(seqNumber, l1Info, sysConfig)
    if err != nil {
            return nil, NewCriticalError(fmt.Errorf("failed to create l1InfoTx: %w", err))
    }
    ```
    
1. 紧接着，更改以下行：
    
    ```go
    txs := make([]hexutil.Bytes, 0, 1+len(depositTxs))
    txs = append(txs, l1InfoTx)
    ```
    
    to
    
    ```go
    txs := make([]hexutil.Bytes, 0, 2+len(depositTxs))
    txs = append(txs, l1InfoTx)
    txs = append(txs, l1BurnTx)
    ```
    

我们在这里做的只是在每个 `l1InfoTx` 之后创建一个新的燃烧交易，并将其插入到每个区块中。

## 重新构建您的 op-node

在我们能够看到这个变化生效之前，您需要重新构建您的 `op-node`：

```bash
cd ~/optimism/op-node
make op-node
```

现在启动您的 `op-node`，如果它没有运行，请重新启动您的 `op-node`，如果它已经在运行中。您应该立即看到变化 - 新的区块将包含两个系统交易而不仅仅是一个！

## 检查结果

查询您的合约的 `total` 函数，您应该看到总数慢慢增加。尝试使用 `tally` 函数获取自某个 L2 区块以来燃烧的 gas 数量。您可以使用这个功能来实现一个以 OP Stack 作为后端的 [ultrasound.money](http://ultrasound.money) 版本。我们做到了，Reddit！

获取总数的一种方法是运行以下命令：

```bash
export ETH_RPC_URL=http://localhost:8545
cast call <YOUR_BURN_CONTRACT_HERE> "total()" | cast --from-wei
```

## 结论

通过对 `op-node` 进行一些微小的更改，您刚刚实现了对 OP Stack 的改变，使您能够跟踪 L1 ETH 在 L2 上的燃烧情况。通过一个实时的 Cannon 容错系统，您不仅能够在 L2 上跟踪 L1 的燃烧情况，还能够向 L1 上的合约 *证明* 这种燃烧。您可以在燃烧的 ETH 数量上建立一个无需信任的预测市场。这太疯狂了！

OP Stack 是一个非常强大的平台，可以让您以无需信任的方式执行大量计算。对于智能合约来说，这是一个超能力。跟踪 L1 的燃烧只是您可以在 OP Stack 上做的许多疯狂事情中的一种。如果您正在寻找灵感，或者想看看其他人在 OP Stack 上构建了什么，可以查看我们的 OP Stack Hacks 页面。也许您会找到一个您想要参与的项目，或者您会获得建立下一个杀手级智能合约所需的灵感。
