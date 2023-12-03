---
title: 快速开始
lang: zh-CN
---

::: tip
请**准备大约一小时的时间**来正确运行所有内容，并**仔细阅读指南**。
您不想错过任何重要的步骤，可能会在后续过程中引起问题。
:::

本教程**专为开发人员设计**，旨在通过启动一个OP Stack测试网络链来了解OP Stack的所有组件，并教授完整的部署过程。
您将拥有自己的OP Stack测试网络。

您可以使用此测试网络进行实验和测试，或者选择修改链以适应自己的需求。
**OP Stack是完全基于MIT许可的自由和开源软件**。
您无需获得任何人的许可即可自由修改或部署堆栈的任何配置。

::: tip
对OP Stack的修改可能会导致链无法从[Optimism Superchain](/op-stack/explainer)的某些方面受益。
请务必查看[Superchain Explainer](/op-stack/explainer)以了解更多信息。
:::

## 我们将要部署的内容

在部署OP Stack链时，您将设置四个不同的组件。
在开始部署链之前，了解每个组件的功能非常有用。

### 智能合约

OP Stack使您能够部署自己的Rollup链，该链使用Layer 1区块链来托管和排序交易数据。
OP Stack链使用L1区块链上的多个智能合约来管理Rollup的各个方面。
每个OP Stack链在创建时部署自己的一组L1智能合约。
我们将使用[Optimism Monorepo](https://github.com/ethereum-optimism/optimism)中的[`contracts-bedrock`包](https://github.com/ethereum-optimism/optimism/tree/develop/packages/contracts-bedrock)中的L1智能合约。

### Sequencer节点

OP Stack链使用Sequencer节点从用户那里收集交易并将其发布到L1区块链。
原始（未修改的）OP Stack链依赖于至少一个这样的Sequencer节点，因此我们需要运行一个。
如果需要，您还可以运行其他非Sequencer节点（本教程不包括在内）。

#### 共识客户端

OP Stack节点，就像以太坊节点一样，具有共识客户端。
共识客户端负责确定属于您的区块链的区块和交易的列表和顺序。
OP Stack共识客户端有多个实现，包括由OP Labs维护的`op-node`和由a16z维护的[`magi`](https://github.com/a16z/magi)。
在本教程中，我们将使用[Optimism Monorepo](https://github.com/ethereum-optimism/optimism)中的[`op-node`实现](https://github.com/ethereum-optimism/optimism/tree/develop/op-node)。

#### 执行客户端

OP Stack节点，就像以太坊节点一样，还具有执行客户端。
执行客户端负责执行交易并存储/更新区块链的状态。
OP Stack执行客户端有多个实现，包括由OP Labs维护的`op-geth`，由Test in Prod维护的[`op-erigon`](https://github.com/testinprod-io/op-erigon)和即将推出的`op-nethermind`。
在本教程中，我们将使用[`op-geth`实现](https://github.com/ethereum-optimism/op-geth)，该实现位于[`op-geth`存储库](https://github.com/ethereum-optimism/op-geth)中。

### 批处理器

批处理器是从Sequencer到L1区块链发布交易的实体。
批处理器与Sequencer连续运行，并定期批量发布交易。
我们将使用[Optimism Monorepo](https://github.com/ethereum-optimism/optimism)中的[`op-batcher`实现](https://github.com/ethereum-optimism/optimism/tree/develop/op-batcher)作为批处理器组件。

### 提议者

提议者是负责将交易*结果*（以L2状态根的形式）发布到L1区块链的实体。
这允许L1上的智能合约读取L2的状态，这对于跨链通信和用户提款是必要的。
未来可能会删除提议者，但目前它是OP Stack的必要组件。
我们将使用[Optimism Monorepo](https://github.com/ethereum-optimism/optimism)中的[`op-proposer`实现](https://github.com/ethereum-optimism/optimism/tree/develop/op-proposer)作为提议者组件。

## 软件依赖

| 依赖项 | 版本 | 版本检查命令 |
| --- | --- | --- |
| [git](https://git-scm.com/) | `^2` | `git --version` |
| [go](https://go.dev/) | `^1.21` | `go version` |
| [node](https://nodejs.org/en/) | `^20` | `node --version` |
| [pnpm](https://pnpm.io/installation) | `^8` | `pnpm --version` |
| [foundry](https://github.com/foundry-rs/foundry#installation) | `^0.2.0` | `forge --version` |
| [make](https://linux.die.net/man/1/make) | `^4` | `make --version` |
| [jq](https://github.com/jqlang/jq) | `^1.6` | `jq --version` |
| [direnv](https://direnv.net) | `^2` | `direnv --version` |

### 特定依赖项说明

#### `node`

我们建议使用最新的LTS版本的Node.js（目前为v20）。
[`nvm`](https://github.com/nvm-sh/nvm)是一个有用的工具，可以帮助您在计算机上管理多个Node.js版本。
在旧版本的Node.js上可能会遇到意外错误。

#### `direnv`

本教程的部分内容使用[`direnv`](https://direnv.net)来从`.envrc`文件中加载环境变量到您的shell中。
这意味着您无需每次使用环境变量时都手动导出它们。
`direnv`只能访问您明确允许其查看的文件。

在[安装`direnv`](https://direnv.net/docs/installation.html)之后，您需要**确保[`direnv`已连接到您的shell](https://direnv.net/docs/hook.html)**。
Make sure you've followed [the guide on the `direnv` website](https://direnv.net/docs/hook.html), then **close your terminal and reopen it** so that the changes take effect (or `source` your config file if you know how to do that).

::: warning
确保您已正确将`direnv`连接到您的shell，通过修改您的shell配置文件（如`~/.bashrc`或`~/.zshrc`）。
如果您没有编辑配置文件，那么您可能没有正确配置`direnv`（并且后续可能无法正常工作）。
:::

## 获取Sepolia节点访问权限

我们将部署一个使用Layer 1区块链来托管和排序交易数据的OP Stack Rollup链。
OP Stack Rollup旨在使用EVM等效的区块链，如以太坊、OP Mainnet或标准以太坊测试网络作为它们的L1链。

**本指南使用Sepolia测试网络作为L1链**。
我们建议您也使用Sepolia。
您也可以使用其他兼容EVM的区块链，但可能会遇到意外错误。
如果您想使用其他网络，请仔细检查每个命令，并将任何Sepolia特定的值替换为您网络的值。

由于我们将部署OP Stack链到Sepolia，您需要访问Sepolia节点。
您可以使用类似[Alchemy](https://www.alchemy.com/)的节点提供商（更简单），或者运行自己的Sepolia节点（更困难）。

## 构建源代码

我们将直接从源代码启动OP Stack链，而不是使用像[Docker](https://www.docker.com/)这样的容器系统。
尽管这增加了一些额外的步骤，但这意味着如果您想修改堆栈的行为，您将更容易做到。
如果您想了解我们将使用的各个组件的摘要，请再次查看上面的[我们将部署什么](#what-were-going-to-deploy)部分。

::: warning
为了简单起见，本教程将使用主目录`~/`作为工作目录。
您可以使用任何目录，但使用主目录将使您能够复制/粘贴本指南中的命令。
如果选择使用其他目录，请确保在本教程的所有命令中使用正确的目录。
:::

### 构建Optimism Monorepo

#### 1. 克隆Optimism Monorepo

```bash
cd ~
git clone https://github.com/ethereum-optimism/optimism.git
```

#### 2. 进入Optimism Monorepo

```bash
cd optimism
```

#### 3. 检查依赖项

::: warning
不要跳过这一步！在继续之前，请确保您已安装所有所需的依赖项。
:::

运行以下脚本，并仔细检查您是否已安装了所有所需的版本。
如果您没有安装正确的版本，可能会遇到意外错误。

```bash
./packages/contracts-bedrock/scripts/getting-started/versions.sh
```

#### 4. 安装依赖

```bash
pnpm install
```

#### 5. 在 Optimism Monorepo 中构建各个包。

```bash
make op-node op-batcher op-proposer
pnpm build
```

### 构建 `op-geth`

#### 1. 克隆 op-geth

```bash
cd ~
git clone https://github.com/ethereum-optimism/op-geth.git
```

#### 2. 进入 op-geth 目录

```bash
cd op-geth
```

#### 3. 构建 op-geth

```bash
make geth
```


## 填写环境变量

在我们开始部署链之前，您需要填写一些环境变量。

#### 1. 进入 Optimism Monorepo

```bash
cd ~/optimism
```

#### 2. 复制示例环境变量文件

```bash
cp .envrc.example .envrc
```

#### 3. 填写环境变量文件

打开环境变量文件并填写以下变量：

| 变量名称 | 描述 |
| --- | --- |
| `L1_RPC_URL` | L1节点的URL（在本例中为Sepolia节点）。 |
| `L1_RPC_KIND` | 连接的L1 RPC的类型，用于获取最佳的交易收据。有效选项：`alchemy`、`quicknode`、`infura`、`parity`、`nethermind`、`debug_geth`、`erigon`、`basic`、`any`。 |

## 生成账户

在设置链时，您将需要四个账户及其私钥：

- `Admin`账户具有升级合约的能力。
- `Batcher`账户将Sequencer事务数据发布到L1。
- `Proposer`账户将L2事务结果（状态根）发布到L1。
- `Sequencer`账户在p2p网络上签署区块。

#### 1. 进入Optimism Monorepo

```bash
cd ~/optimism
```

#### 2. 生成新的账户

::: danger
对于生产环境的部署，您不应该使用 `wallets.sh` 工具。
如果您要将基于 OP Stack 的链部署到生产环境中，您应该使用硬件安全模块和硬件钱包的组合。
:::

```bash
./packages/contracts-bedrock/scripts/getting-started/wallets.sh
```

#### 3. 检查输出

确保您看到类似以下内容的输出：

```text
Copy the following into your .envrc file:
 
# Admin account
export GS_ADMIN_ADDRESS=0x9625B9aF7C42b4Ab7f2C437dbc4ee749d52E19FC
export GS_ADMIN_PRIVATE_KEY=0xbb93a75f64c57c6f464fd259ea37c2d4694110df57b2e293db8226a502b30a34
 
# Batcher account
export GS_BATCHER_ADDRESS=0xa1AEF4C07AB21E39c37F05466b872094edcf9cB1
export GS_BATCHER_PRIVATE_KEY=0xe4d9cd91a3e53853b7ea0dad275efdb5173666720b1100866fb2d89757ca9c5a
 
# Proposer account
export GS_PROPOSER_ADDRESS=0x40E805e252D0Ee3D587b68736544dEfB419F351b
export GS_PROPOSER_PRIVATE_KEY=0x2d1f265683ebe37d960c67df03a378f79a7859038c6d634a61e40776d561f8a2
 
# Sequencer account
export GS_SEQUENCER_ADDRESS=0xC06566E8Ec6cF81B4B26376880dB620d83d50Dfb
export GS_SEQUENCER_PRIVATE_KEY=0x2a0290473f3838dbd083a5e17783e3cc33c905539c0121f9c76614dda8a38dca
```

#### 4. 保存账户

将上一步的输出复制并按照指示粘贴到您的 `.envrc` 文件中。

#### 5. 给账户充值

**您需要向 `Admin`、`Proposer` 和 `Batcher` 账户发送 ETH。**
所需的 ETH 金额取决于使用的 L1 网络。
**您无需向 `Sequencer` 账户发送任何 ETH，因为它不发送交易。**

我们建议在使用 Sepolia 时，按照以下金额给账户充值：

- `Admin` — 0.2 ETH
- `Proposer` — 0.2 ETH
- `Batcher` — 0.1 ETH

## 加载环境变量

现在我们已经填写了环境变量文件，我们需要将这些变量加载到我们的终端中。

#### 1. 进入 Optimism Monorepo

```bash
cd ~/optimism
```

#### 2. 使用 direnv 加载这些变量。

::: warning
我们将使用 `direnv` 来将环境变量从 `.envrc` 文件加载到我们的终端中。
请确保您已经[安装了 `direnv`](https://direnv.net/docs/installation.html)，并且已经正确地[将 `direnv` 集成到您的 shell](#configuring-direnv)中。
:::

接下来，您需要使用以下命令允许 `direnv` 读取此文件并将变量加载到您的终端中。

```bash
direnv allow
```

::: warning
警告：每当您的 `.envrc` 文件发生更改时，`direnv` 将自动卸载自身。
**您必须每次更改 `.envrc` 文件后重新运行以下命令。**
:::

#### 3. 确认变量已加载

运行 `direnv allow` 后，您应该看到类似以下内容的输出（实际输出会根据您设置的变量而有所不同，如果不完全相同也不用担心）：


```bash
direnv: loading ~/optimism/.envrc                                                            
direnv: export +DEPLOYMENT_CONTEXT +ETHERSCAN_API_KEY +GS_ADMIN_ADDRESS +GS_ADMIN_PRIVATE_KEY +GS_BATCHER_ADDRESS +GS_BATCHER_PRIVATE_KEY +GS_PROPOSER_ADDRESS +GS_PROPOSER_PRIVATE_KEY +GS_SEQUENCER_ADDRESS +GS_SEQUENCER_PRIVATE_KEY +IMPL_SALT +L1_RPC_KIND +L1_RPC_URL +PRIVATE_KEY +TENDERLY_PROJECT +TENDERLY_USERNAME
```

**如果您没有看到这个输出，那么您可能没有[正确配置`direnv`](#configuring-direnv)。**
请确保您已经正确配置了`direnv`并再次运行`direnv allow`，以便看到所需的输出。

## 配置您的网络

一旦您构建了这两个存储库，您将需要返回到 Optimism Monorepo 来设置链的配置文件。
目前，链的配置文件位于 [`contracts-bedrock`](https://github.com/ethereum-optimism/optimism/tree/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock) 包中，以 JSON 文件的形式存在。

#### 1. 进入 Optimism Monorepo

```bash
cd ~/optimism
```

#### 2. 进入 contracts-bedrock 包

```bash
cd packages/contracts-bedrock
```

#### 3. 生成配置文件

运行以下脚本，在 `deploy-config` 目录下生成 `getting-started.json` 配置文件。


```bash
./scripts/getting-started/config.sh
```

#### 4. 查看配置文件（可选）

如果您愿意，您可以通过在您喜欢的文本编辑器中打开 `deploy-config/getting-started.json` 来查看刚刚生成的配置文件。
我们建议您暂时保持此文件不变，以避免遇到任何意外错误。

## 部署 L1 合约

一旦您配置了网络，就可以部署链的功能所必需的 L1 合约。

#### 1. 部署 L1 合约

```bash
forge script scripts/Deploy.s.sol:Deploy --private-key $GS_ADMIN_PRIVATE_KEY --broadcast --rpc-url $L1_RPC_URL
```

::: warning
如果您看到一个包含 `EvmError: Revert` 和 `Script failed` 的不明确的错误，那么您可能需要更改 `IMPL_SALT` 环境变量。
这个变量确定了通过 [CREATE2](https://eips.ethereum.org/EIPS/eip-1014) 部署的各种智能合约的地址。
如果使用相同的 `IMPL_SALT` 部署相同的合约两次，第二次部署将失败。
**您可以通过在 Optimism Monorepo 的任何位置运行 `direnv allow` 来生成一个新的 `IMPL_SALT`。**
:::

#### 2. 生成合约构件

```bash
forge script scripts/Deploy.s.sol:Deploy --sig 'sync()' --rpc-url $L1_RPC_URL
```

## 生成 L2 配置文件

现在我们已经设置了 L1 智能合约，我们可以自动生成用于共识客户端和执行客户端的几个配置文件。

我们需要生成三个重要的文件：

1. `genesis.json` 包含执行客户端的创世状态链。
2. `rollup.json` 包含共识客户端的配置信息。
3. `jwt.txt` 是一个 [JSON Web Token](https://jwt.io/introduction)，用于确保只有共识客户端和执行客户端之间可以进行通信。
    您可以使用以下命令生成 JWT：

#### 1. 进入 op-node 包

```bash
cd ~/optimism/op-node
```

#### 2. 创建创世文件

现在我们将在 `op-node` 文件夹中生成 `genesis.json` 和 `rollup.json` 文件：

```bash
go run cmd/main.go genesis l2 \
    --deploy-config ../packages/contracts-bedrock/deploy-config/getting-started.json \
    --deployment-dir ../packages/contracts-bedrock/deployments/getting-started/ \
    --outfile.l2 genesis.json \
    --outfile.rollup rollup.json \
    --l1-rpc $L1_RPC_URL
```

#### 3. 创建身份验证密钥

接下来，您将创建一个 [JSON Web Token](https://jwt.io/introduction)，用于对共识客户端和执行客户端进行身份验证。
该令牌用于确保只有共识客户端和执行客户端之间可以进行通信。
您可以使用以下命令生成 JWT：

```bash
openssl rand -hex 32 > jwt.txt
```

#### 4. 将创世文件复制到 op-geth 目录中

最后，我们需要将 `genesis.json` 文件和 `jwt.txt` 文件复制到 `op-geth` 目录中，以便我们可以用它来初始化和运行 `op-geth`：

```bash
cp genesis.json ~/op-geth
cp jwt.txt ~/op-geth
```

## 初始化 `op-geth`

我们即将准备好运行我们的链！
现在我们只需要运行几个命令来初始化 `op-geth`。
我们将运行一个 Sequencer 节点，所以我们需要导入之前生成的 `Sequencer` 私钥。
这个私钥将用于我们的 Sequencer 签署新的区块。

#### 1. 进入 op-geth 目录

```bash
cd ~/op-geth
```

#### 2. 创建一个数据目录文件夹
```bash
mkdir datadir
```

#### 3. 初始化 `op-geth`
```bash
build/bin/geth init --datadir=datadir genesis.json
```

## 启动 `op-geth`

现在我们将启动 `op-geth`，我们的执行客户端。
请注意，在下一步启动共识客户端之前，您不会看到任何交易。

#### 1. 打开一个新的终端

我们需要一个终端窗口来运行 `op-geth`。

#### 2. 切换到 op-geth 目录

```bash
cd ~/op-geth
```

#### 3. 运行 op-geth

::: tip
在这里我们使用 `--gcmode=archive` 来运行 `op-geth`，因为这个节点将充当我们的 Sequencer。
在归档模式下运行 Sequencer 是有用的，因为 `op-proposer` 需要访问完整的状态。
如果您想节省磁盘空间，可以随意在其他（非 Sequencer）节点上运行全模式。
:::

```bash
./build/bin/geth \
    --datadir ./datadir \
    --http \
    --http.corsdomain="*" \
    --http.vhosts="*" \
    --http.addr=0.0.0.0 \
    --http.api=web3,debug,eth,txpool,net,engine \
    --ws \
    --ws.addr=0.0.0.0 \
    --ws.port=8546 \
    --ws.origins="*" \
    --ws.api=debug,eth,txpool,net,engine \
    --syncmode=full \
    --gcmode=archive \
    --nodiscover \
    --maxpeers=0 \
    --networkid=42069 \
    --authrpc.vhosts="*" \
    --authrpc.addr=0.0.0.0 \
    --authrpc.port=8551 \
    --authrpc.jwtsecret=./jwt.txt \
    --rollup.disabletxpoolgossip=true
```

## 启动 `op-node`

一旦我们成功运行了 `op-geth`，我们需要运行 `op-node`。
与以太坊类似，OP Stack 有一个共识客户端（`op-node`）和一个执行客户端（`op-geth`）。
共识客户端通过 Engine API "驱动" 执行客户端。

#### 1. 打开一个新的终端

我们需要一个终端窗口来运行 `op-node`。

#### 2. 切换到 op-node 目录

```bash
cd ~/optimism/op-node
```

#### 3. 运行 op-node

```bash
./bin/op-node \
	--l2=http://localhost:8551 \
	--l2.jwt-secret=./jwt.txt \
	--sequencer.enabled \
	--sequencer.l1-confs=5 \
	--verifier.l1-confs=4 \
	--rollup.config=./rollup.json \
	--rpc.addr=0.0.0.0 \
	--rpc.port=8547 \
	--p2p.disable \
	--rpc.enable-admin \
	--p2p.sequencer.key=$GS_SEQUENCER_PRIVATE_KEY \
	--l1=$L1_RPC_URL \
	--l1.rpckind=$L1_RPC_KIND
```

运行此命令后，您将开始看到 `op-node` 开始从 L1 链同步 L2 块。
一旦 `op-node` 追上了 L1 链的最新块，它将开始将块发送给 `op-geth` 进行执行。
此时，您将开始在 `op-geth` 中看到创建的块。

::: tip
**默认情况下，您的 `op-node` 将尝试使用点对点网络加速同步过程。**
如果您使用的是其他人也在使用的链 ID，例如本教程的默认链 ID（42069），您的 `op-node` 将接收到其他序列器签名的块。
这些请求将失败并浪费时间和网络资源。
**为了避免这种情况，我们在开始时禁用了点对点同步（`--p2p.disable`）。**

一旦您拥有多个节点，您可能希望启用点对点同步。
您可以在 `op-node` 命令中添加以下选项以与特定节点启用点对点同步：

```
	--p2p.static=<nodes> \
	--p2p.listen.ip=0.0.0.0 \
	--p2p.listen.tcp=9003 \
	--p2p.listen.udp=9003 \
```

您还可以选择删除 `--p2p.static` 选项，但是您可能会看到来自使用相同链ID的其他链的请求失败。
:::

## 启动 `op-batcher`

`op-batcher` 从序列器获取交易，并将这些交易发布到 L1。
一旦这些序列器交易被包含在一个最终的 L1 块中，它们就正式成为规范链的一部分。
`op-batcher` 是至关重要的！

最好给 `Batcher` 账户至少 1 个 Sepolia ETH，以确保它可以继续运行而不会因为燃料不足而停止。
请密切关注 `Batcher` 账户的余额，因为如果有大量交易需要发布，它可能会快速消耗 ETH。

#### 1. 打开一个新的终端

我们需要一个终端窗口来运行 `op-batcher`。

#### 2. 切换到 op-batcher 目录

```bash
cd ~/optimism/op-batcher
```

#### 3. 运行 op-batcher

```bash
./bin/op-batcher \
    --l2-eth-rpc=http://localhost:8545 \
    --rollup-rpc=http://localhost:8547 \
    --poll-interval=1s \
    --sub-safety-margin=6 \
    --num-confirmations=1 \
    --safe-abort-nonce-too-low-count=3 \
    --resubmission-timeout=30s \
    --rpc.addr=0.0.0.0 \
    --rpc.port=8548 \
    --rpc.enable-admin \
    --max-channel-duration=1 \
    --l1-eth-rpc=$L1_RPC_URL \
    --private-key=$GS_BATCHER_PRIVATE_KEY
```

::: tip
`--max-channel-duration=n` 设置告诉批处理器将所有数据写入 L1 每 `n` 个 L1 块。
当值较低时，交易频繁写入 L1，其他节点可以快速从 L1 同步。
当值较高时，交易较少频繁写入 L1，批处理器消耗的 ETH 较少。
如果您想降低成本，可以将此值设置为 0 禁用它，或者将其增加到较高的值。
:::

## 启动 `op-proposer`

现在启动 `op-proposer`，它将提议新的状态根。

#### 1. 打开一个新的终端

我们需要一个终端窗口来运行 `op-proposer`。

#### 2. 切换到 op-proposer 目录

```bash
cd ~/optimism/op-proposer
```

#### 3. 运行 op-proposer

```bash
./bin/op-proposer \
    --poll-interval=12s \
    --rpc.port=8560 \
    --rollup-rpc=http://localhost:8547 \
    --l2oo-address=$(cat ../packages/contracts-bedrock/deployments/getting-started/L2OutputOracleProxy.json | jq -r .address) \
    --private-key=$GS_PROPOSER_PRIVATE_KEY \
    --l1-eth-rpc=$L1_RPC_URL
```

## 连接您的钱包到您的链

您现在拥有一个完全功能的 OP Stack Rollup，其中 Sequencer 节点正在运行在 `http://localhost:8545`。
您可以像连接其他任何 EVM 链一样将您的钱包连接到这个链上。
如果您需要一个简单的方法来连接到您的链，只需[点击这里](https://chainid.link?network=opstack-getting-started)。

## 在您的链上获取 ETH

一旦您连接了您的钱包，您可能会注意到您的链上没有任何 ETH 来支付燃料费。
将 Sepolia ETH 存入您的链的最简单方法是直接将资金发送到 `L1StandardBridge` 合约。

#### 1. 导航到 contracts-bedrock 目录

```bash
cd ~/optimism/packages/contracts-bedrock
```

#### 2. 获取 L1StandardBridgeProxy 合约的地址

```bash
cat deployments/getting-started/L1StandardBridgeProxy.json | jq -r .address
```

#### 3. 将一些 Sepolia ETH 发送到 L1StandardBridgeProxy 合约

获取 L1 桥接代理合约地址，并使用您希望在 Rollup 上拥有 ETH 的钱包，向该地址发送一小笔 Sepolia ETH（0.1 或更少即可）。
这将触发一笔存款，将在 L2 中铸造 ETH 到您的钱包中。
这可能需要最多 5 分钟，才能在 L2 上的钱包中看到这些 ETH。

## 观察您的 Rollup 运行

您可以像与任何其他 EVM 链交互一样与您的 Rollup 进行交互。
发送一些交易，部署一些合约，看看会发生什么！

## 下一步

- 您可以像使用任何其他测试区块链一样使用此 Rollup。
- 您可以[以各种方式修改区块链](hacks/overview)。
- 如果遇到任何问题，请访问[链操作员故障排除指南](chain-troubleshooting)寻求帮助。
