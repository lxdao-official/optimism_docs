# OP Stack中文文档

[![Discord](https://img.shields.io/discord/667044843901681675.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discord.gg/optimism)
[![Twitter Follow](https://img.shields.io/twitter/follow/optimismPBC.svg?label=optimismPBC&style=social)](https://twitter.com/optimismPBC)

OP Stack是一个开放的、集体维护的区块链生态系统开发堆栈。该存储库包含[OP Stack中文文档](https://stack.optimism.io)的源代码。

> 本仓库中文文档由LXDAO翻译，目前已翻译部分关键的入门文档，剩余的翻译工作仍在持续推进中。

## 开发

### 本地启动
```sh
yarn dev
```

然后在浏览器中访问 [http://localhost:8080](http://localhost:8080)。
如果链接无法打开，请仔细检查 `yarn dev` 的输出。
您可能已经在8080端口上运行了其他服务，网站可能在其他端口上（例如8081）。

### 构建生产环境的文档

```sh
yarn build
```

您可能不需要运行此命令，但现在您已经知道了。

### 编辑文档

直接在[src/docs](./src/docs)中编辑Markdown文件。

### 添加新文档

将您的Markdown文件添加到[src/docs](./src/docs)中。
如果您希望这些文档显示在侧边栏中，还需要更新[src/.vuepress/config.js](./src/.vuepress/config.js)。

### 更新主题

目前使用的是从[VuePress主题](https://vuepress-theme-hope.github.io/)中分离出来的版本。
由于我们使用的版本是从原始主题中分离出来的，所以您将看到一堆编译后的JavaScript文件，而不是原始的TypeScript文件。
目前我们无法解决这个问题，所以如果您需要进行主题调整，您只能编辑原始的JS文件。
我们计划在不久的将来转向其他文档生成工具，所以我们不会修复这个问题。
