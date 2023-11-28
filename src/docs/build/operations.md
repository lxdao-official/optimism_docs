---
title: Rollup操作
lang: zh-CN
---

## 停止Rollup

有序关闭的顺序与组件启动的顺序相反：

1. 停止batcher，请使用以下命令：

    ```sh
    curl -d '{"id":0,"jsonrpc":"2.0","method":"admin_stopBatcher","params":[]}' \
         -H "Content-Type: application/json" http://localhost:8548 | jq
    ```

    这样，batcher会知道将其缓存的任何数据保存到L1。在停止进程之前，请等待在batcher的输出中看到`Batch Submitter stopped`。

2. 停止op-node。
    该组件是无状态的，所以可以直接停止进程。

3. 停止op-geth。
    请确保使用**CTRL-C**来避免数据库损坏。



## 启动Rollup

要重新启动区块链，请按照初始化时的组件顺序进行操作。

1. `op-geth`
2. `op-node`
3. `op-batcher`

   如果`op-batcher`仍在运行，并且您刚刚使用RPC停止了它，您可以使用以下命令启动它：

   ```sh
   curl -d '{"id":0,"jsonrpc":"2.0","method":"admin_startBatcher","params":[]}' \
       -H "Content-Type: application/json" http://localhost:8548 | jq   
   ```

::: tip 同步需要时间

`op-batcher`可能会出现类似以下的警告消息：

## 添加节点

要向Rollup添加节点，您需要初始化`op-node`和`op-geth`，与您为第一个节点所做的操作类似。
不应该添加`op-batcher`，只应该有一个。

1. 配置操作系统和先决条件，与您为第一个节点所做的操作相同。
2. 构建Optimism monorepo和`op-geth`，与您为第一个节点所做的操作相同。
3. 从第一个节点复制以下文件：

    ```bash
    ~/op-geth/genesis.json
    ~/optimism/op-node/rollup.json
    ```

4. 创建一个新的`jwt.txt`文件作为共享密钥：

    ```bash
    cd ~/op-geth
    openssl rand -hex 32 > jwt.txt
    cp jwt.txt ~/optimism/op-node
    ```

5. 初始化新的op-geth：

    ```bash
    cd ~/op-geth
    ./build/bin/geth init --datadir=./datadir ./genesis.json
    ```

6. 要启用L2节点直接同步，而不是等待事务写入L1，请打开[点对点同步](./getting-started/#op-node)。
   如果您已经有点对点同步，请将新节点添加到`--p2p.static`列表中以进行同步。

7. 启动`op-geth`（使用与初始节点相同的命令行）
8. 启动`op-node`（使用与初始节点相同的命令行，但删除`--sequencer.enabled`和`--sequencer.l1-confs`标志以禁用序列器模式）
