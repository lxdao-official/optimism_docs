---
title: 区块浏览器和索引器
lang: zh-CN
---

下一步是能够查看您的区块链中实际发生的情况。
一个简单的方法是使用 [Blockscout](https://www.blockscout.com/)。

## 先决条件

### 存档模式

Blockscout 期望与以[存档模式](https://www.alchemy.com/overviews/archive-nodes#archive-nodes)运行的以太坊执行客户端进行交互。
如果您的 `op-geth` 是以完整模式运行的，您可以创建一个单独的存档节点。
要这样做，请按照[添加节点的说明](./getting-started.md#adding-nodes)进行操作，但在启动 `op-geth` 的命令中替换为：

```sh
	--gcmode=full \
```

with

```sh
	--gcmode=archive \
```

### Docker

运行Blockscout最简单的方法是使用Docker。
下载并安装[Docker引擎](https://docs.docker.com/engine/install/#server)。


## 安装和配置

1. 克隆 Blockscout 仓库。

   ```sh
   cd ~
   git clone https://github.com/blockscout/blockscout.git
   cd blockscout/docker-compose
   ```

1. 根据您所使用的Docker版本，可能会出现环境路径的问题。
   运行以下命令来修复它：
   ```sh
   ln -s `pwd`/envs ..
   ```

1. 如果以存档模式运行的 `op-geth` 在不同的计算机上或端口不是8545，请编辑 `docker-compose-no-build-geth.yml` 文件，将 `ETHEREUM_JSONRPC_HTTP_URL` 设置为正确的URL。

2. 启动 Blockscout

   ```sh
   docker compose -f docker-compose-no-build-geth.yml up
   ```

## 使用方法

在docker容器启动后，浏览到 http://< *运行Blockscout的计算机* >:4000 查看用户界面。

您还可以使用[API](https://docs.blockscout.com/for-users/api)

### GraphQL

Blockscout的API支持在`/graphiql`下使用[GraphQL](https://graphql.org/)。
例如，这个查询查看地址。

```
query {
  addresses(hashes:[
   "0xcB69A90Aa5311e0e9141a66212489bAfb48b9340", 
   "0xC2dfA7205088179A8644b9fDCecD6d9bED854Cfe"])
```

GraphQL查询从顶层实体（或实体）开始。
在这种情况下，我们的[顶层查询](https://docs.blockscout.com/for-users/api/graphql#queries)是针对多个地址的查询。

请注意，您只能查询已建立索引的字段。
例如，在这里我们查询了地址。
然而，我们无法查询`contractCode`或`fetchedCoinBalance`。

```
 {
    hash
    contractCode
    fetchedCoinBalance
```

上述字段是从地址表中获取的。

```
    transactions(first:5) {
```

我们还可以获取包含该地址的交易（无论是作为源地址还是目标地址）。
由于API不允许我们获取无限数量的交易，因此在这里我们只请求了前5个。


```
      edges {
        node {
```

因为这是一个[图](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics))，连接两种类型（例如地址和交易）的实体被称为`边缘`。
在每个边缘的另一端，有一个单独的`节点`，代表一个交易。

```
          hash
          fromAddressHash
          toAddressHash
          input
        }
```

这些是我们读取每个交易的字段。

```
      }
    }
  }
}
```

最后，关闭所有的括号。
