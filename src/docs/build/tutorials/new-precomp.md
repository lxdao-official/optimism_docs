---
title: 添加一个预编译合约
lang: zh-CN
---

::: warning 🚧 OP Stack Hacks 是一些明确不适用于生产环境的 OP Stack 的用法

OP Stack Hacks 不适合新手。您将无法获得针对 OP Stack Hacks 的重要开发者支持 - 请准备好自己动手并在没有支持的情况下工作。

:::

OP Stack 的一个可能用途是为运行 EVM 提供一个新的预编译合约，以加速当前不支持的计算。在这种情况下，我们将创建一个简单的预编译合约，如果使用四个或更少的字节调用它，则返回一个常量值；如果使用超过四个字节调用它，则返回一个错误。

要创建一个新的预编译合约，请修改文件 [`op-geth/core/vm/contracts.go`](https://github.com/ethereum-optimism/op-geth/blob/optimism-history/core/vm/contracts.go)。

1. 在第82行（或以后的分叉，如果预编译合约列表再次更改）的 `PrecompiledContractsBerlin` 中添加一个以您的新预编译合约命名的结构体，并使用一个不太可能与标准预编译合约冲突的地址（例如0x100）：

    ```go
    common.BytesToAddress([]byte{1,0}): &retConstant{},
    ```

1. 添加预编译合约的代码行。

    ```go
    type retConstant struct{}

    func (c *retConstant) RequiredGas(input []byte) uint64 {
        return uint64(1024)
    }

    var (
        errConstInvalidInputLength = errors.New("invalid input length")
    )

    func (c *retConstant) Run(input []byte) ([]byte, error) {
        // Only allow input up to four bytes (function signature)
        if len(input) > 4 {
            return nil, errConstInvalidInputLength
        }

        output := make([]byte, 6)
        for i := 0; i < 6; i++ {
            output[i] = byte(64+i)
        }
        return output, nil
    }
    ```

1. 停止 `op-geth` 并重新编译：

    ```bash
    cd ~/op-geth
    make geth
    ```

1. 重新启动 `op-geth`。

1. 运行以下命令以查看成功调用预编译合约的结果以及错误的结果：

    ```bash
    cast call 0x0000000000000000000000000000000000000100 "whatever()"
    cast call 0x0000000000000000000000000000000000000100 "whatever(string)" "fail"
    ```
## 它是如何工作的？

这是预编译接口的定义：
```go
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64  // RequiredPrice calculates the contract gas use
	Run(input []byte) ([]byte, error) // Run runs the precompiled contract
}
```

这意味着对于每个预编译合约，我们需要两个函数：

- `RequiredGas` 函数返回调用的燃料成本。该函数接受一个字节数组作为输入，并返回一个值，即燃料成本。
- `Run` 函数运行实际的预编译合约。该函数也接受一个字节数组作为输入，但它返回两个值：调用的输出（一个字节数组）和一个错误。

对于每个更改预编译合约的分叉，我们都有一个从地址到 `PrecompiledContract` 定义的 [`map`](https://www.w3schools.com/go/go_maps.php)：

```go
// PrecompiledContractsBerlin contains the default set of pre-compiled Ethereum
// contracts used in the Berlin release.
var PrecompiledContractsBerlin = map[common.Address]PrecompiledContract{
  common.BytesToAddress([]byte{1}): &ecrecover{},
  .
  .
  .
  common.BytesToAddress([]byte{9}): &blake2F{},
  common.BytesToAddress([]byte{1,0}): &retConstant{},
}
```

该映射的键是一个地址。我们使用`common.BytesToAddress([]byte{<要转换为地址的字节>})`将字节转换为地址。在这种情况下，我们有两个字节，`0x01`和`0x00`。将它们组合在一起，我们得到地址`0x0…0100`。

预编译合约接口的语法是`&<变量名>{}`。

下一步是定义预编译合约本身。

```go
type retConstant struct{}
```

首先，我们为预编译创建一个结构体。

```go
func (c *retConstant) RequiredGas(input []byte) uint64 {
    return uint64(1024)
}
```

然后，我们定义了一个作为结构体一部分的函数。在这里，我们只需要一个固定数量的燃料，但是当然计算可以更加复杂。

```go
var (
    errConstInvalidInputLength = errors.New("invalid input length")
)

```

接下来，我们为错误定义了一个变量。

```go
func (c *retConstant) Run(input []byte) ([]byte, error) {
```

这是实际执行预编译的函数。

```go

    // Only allow input up to four bytes (function signature)
    if len(input) > 4 {
        return nil, errConstInvalidInputLength
    }
```

如果需要的话，返回一个错误。这个预编译允许最多四个字节的输入，原因是任何标准调用（例如使用`cast`）都会有至少四个字节的函数签名。

`return a, b` 是在Go中返回函数的两个值的方式。正常的输出是`nil`，什么都没有，因为我们返回了一个错误。

```go
    output := make([]byte, 6)
    for i := 0; i < 6; i++ {
        output[i] = byte(64+i)
    }
    return output, nil
}
```

最后，我们创建输出缓冲区，填充它，然后返回它。

## 结论

具有额外预编译合约的OP Stack链可以很有用，例如，通过将加密操作从解释的EVM代码移动到编译的Go代码，进一步减少计算工作量。
