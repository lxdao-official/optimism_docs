(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{655:function(e,t,r){"use strict";r.r(t);var _=r(2),v=Object(_.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("p",[e._v("需要注意的是，在Optimism和以太坊之间存在一些细微差异。\n在构建基于Optimism或OP Stack代码库的应用程序时，您应该了解这些差异。")]),e._v(" "),r("h2",{attrs:{id:"操作码差异"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#操作码差异"}},[e._v("#")]),e._v(" 操作码差异")]),e._v(" "),r("table",[r("thead",[r("tr",[r("th",[e._v("操作码")]),e._v(" "),r("th",[e._v("Solidity等效操作")]),e._v(" "),r("th",[e._v("行为")])])]),e._v(" "),r("tbody",[r("tr",[r("td",[r("code",[e._v("COINBASE")])]),e._v(" "),r("td",[r("code",[e._v("block.coinbase")])]),e._v(" "),r("td",[e._v("未定义")])]),e._v(" "),r("tr",[r("td",[r("code",[e._v("DIFFICULTY")])]),e._v(" "),r("td",[r("code",[e._v("block.difficulty")])]),e._v(" "),r("td",[e._v("随机值。由于该值由序列器设置，因此其随机性不如L1等效操作码可靠。")])]),e._v(" "),r("tr",[r("td",[r("code",[e._v("NUMBER")])]),e._v(" "),r("td",[r("code",[e._v("block.number")])]),e._v(" "),r("td",[e._v("L2块编号")])]),e._v(" "),r("tr",[r("td",[r("code",[e._v("TIMESTAMP")])]),e._v(" "),r("td",[r("code",[e._v("block.timestamp")])]),e._v(" "),r("td",[e._v("L2块的时间戳")])]),e._v(" "),r("tr",[r("td",[r("code",[e._v("ORIGIN")])]),e._v(" "),r("td",[r("code",[e._v("tx.origin")])]),e._v(" "),r("td",[e._v("如果交易是L1⇒L2交易，则"),r("code",[e._v("tx.origin")]),e._v("设置为触发L1⇒L2交易的地址的"),r("a",{attrs:{href:"#address-aliasing"}},[e._v("别名地址")]),e._v("。否则，此操作码的行为与正常情况下相同。")])]),e._v(" "),r("tr",[r("td",[r("code",[e._v("CALLER")])]),e._v(" "),r("td",[r("code",[e._v("msg.sender")])]),e._v(" "),r("td",[e._v("如果交易是L1⇒L2交易，并且这是初始调用（而不是一个合约之间的内部交易），则同样适用"),r("a",{attrs:{href:"#address-aliasing"}},[e._v("地址别名")]),e._v("行为。")])])])]),e._v(" "),r("div",{staticClass:"custom-block tip"},[r("p",{staticClass:"custom-block-title"},[e._v("`tx.origin == msg.sender`")]),e._v(" "),r("p",[e._v("在L1以太坊上，只有当智能合约直接从外部拥有的账户（EOA）调用时，"),r("code",[e._v("tx.origin")]),e._v("等于"),r("code",[e._v("msg.sender")]),e._v("。\n然而，在Optimism上，"),r("code",[e._v("tx.origin")]),e._v("是在Optimism上的原始地址。\n它可以是一个EOA。\n然而，在来自L1的消息的情况下，一个来自L1上的智能合约的消息可能在L2上出现，其中"),r("code",[e._v("tx.origin == msg.origin")]),e._v("。\n这不太可能产生重大影响，因为L1智能合约不能直接操作L2状态。\n然而，可能存在我们没有考虑到的边界情况，这可能会有所影响。")])]),e._v(" "),r("h3",{attrs:{id:"访问l1信息"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#访问l1信息"}},[e._v("#")]),e._v(" 访问L1信息")]),e._v(" "),r("p",[e._v("如果您需要从最新的L1区块获取等效信息，可以从"),r("a",{attrs:{href:"https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/contracts/L2/L1Block.sol",target:"_blank",rel:"noopener noreferrer"}},[e._v("L1Block合约"),r("OutboundLink")],1),e._v("中获取。\n该合约是一个预部署合约，地址为"),r("a",{attrs:{href:"https://goerli-optimism.etherscan.io/address/0x4200000000000000000000000000000000000015",target:"_blank",rel:"noopener noreferrer"}},[r("code",[e._v("0x4200000000000000000000000000000000000015")]),r("OutboundLink")],1),e._v("。\n您可以使用"),r("a",{attrs:{href:"https://docs.soliditylang.org/en/v0.8.12/contracts.html#getter-functions",target:"_blank",rel:"noopener noreferrer"}},[e._v("getter函数"),r("OutboundLink")],1),e._v("获取这些参数：")]),e._v(" "),r("ul",[r("li",[r("code",[e._v("number")]),e._v("：L2已知的最新L1区块号")]),e._v(" "),r("li",[r("code",[e._v("timestamp")]),e._v("：最新L1区块的时间戳")]),e._v(" "),r("li",[r("code",[e._v("basefee")]),e._v("：最新L1区块的基础费用")]),e._v(" "),r("li",[r("code",[e._v("hash")]),e._v("：最新L1区块的哈希值")]),e._v(" "),r("li",[r("code",[e._v("sequenceNumber")]),e._v("：L2区块在时期内的编号（当有新的L1区块时，时期会更改）")])]),e._v(" "),r("h3",{attrs:{id:"地址别名"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#地址别名"}},[e._v("#")]),e._v(" 地址别名")]),e._v(" "),r("details",[r("p",[e._v("由于"),r("code",[e._v("CREATE")]),e._v("操作码的行为，用户可以在L1和L2上创建具有相同地址但具有不同字节码的合约。\n这可能会破坏信任假设，因为一个合约可能被信任，而另一个合约可能不被信任（见下文）。\n为了防止这个问题，在L1和L2之间，"),r("code",[e._v("ORIGIN")]),e._v("和"),r("code",[e._v("CALLER")]),e._v("操作码（"),r("code",[e._v("tx.origin")]),e._v("和"),r("code",[e._v("msg.sender")]),e._v("）的行为略有不同。")]),e._v(" "),r("p",[r("code",[e._v("tx.origin")]),e._v("的值如下确定：")]),e._v(" "),r("table",[r("thead",[r("tr",[r("th",[e._v("调用来源")]),e._v(" "),r("th",[r("code",[e._v("tx.origin")])])])]),e._v(" "),r("tbody",[r("tr",[r("td",[e._v("L2用户（外部拥有的账户）")]),e._v(" "),r("td",[e._v("用户的地址（与以太坊相同）")])]),e._v(" "),r("tr",[r("td",[e._v("L1用户（外部拥有的账户）")]),e._v(" "),r("td",[e._v("用户的地址（与以太坊相同）")])]),e._v(" "),r("tr",[r("td",[e._v("L1合约（使用"),r("code",[e._v("CanonicalTransactionChain.enqueue")]),e._v("）")]),e._v(" "),r("td",[r("code",[e._v("L1_contract_address + 0x1111000000000000000000000000000000001111")])])])])]),e._v(" "),r("p",[e._v("在顶层（即第一个被调用的合约）的"),r("code",[e._v("msg.sender")]),e._v("的值始终等于"),r("code",[e._v("tx.origin")]),e._v("。\n因此，如果"),r("code",[e._v("tx.origin")]),e._v("的值受到上述规则的影响，顶层的"),r("code",[e._v("msg.sender")]),e._v("值也会受到影响。")]),e._v(" "),r("p",[e._v("请注意，通常情况下，"),r("a",{attrs:{href:"https://docs.soliditylang.org/en/latest/security-considerations.html#tx-origin",target:"_blank",rel:"noopener noreferrer"}},[r("code",[e._v("tx.origin")]),e._v("不应用于授权"),r("OutboundLink")],1),e._v("。\n然而，这与地址别名是一个独立的问题，因为地址别名也会影响"),r("code",[e._v("msg.sender")]),e._v("。")]),e._v(" "),r("h4",{attrs:{id:"为什么地址别名是一个问题"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#为什么地址别名是一个问题"}},[e._v("#")]),e._v(" 为什么地址别名是一个问题？")]),e._v(" "),r("p",[e._v("两个相同的源地址（L1合约和L2合约）的问题在于我们基于地址来扩展信任。\n我们可能希望信任其中一个合约，但不信任另一个合约。")]),e._v(" "),r("ol",[r("li",[r("p",[e._v("Helena Hacker分叉"),r("a",{attrs:{href:"https://uniswap.org/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Uniswap"),r("OutboundLink")],1),e._v("创建了自己的交易所（在L2上），名为Hackswap。")]),e._v(" "),r("p",[e._v("**注意：**实际上Uniswap中有多个合约，所以这个解释有点简化。\n"),r("a",{attrs:{href:"https://ethereum.org/en/developers/tutorials/uniswap-v2-annotated-code/",target:"_blank",rel:"noopener noreferrer"}},[e._v("如果您想要更多详细信息，请参阅此处"),r("OutboundLink")],1),e._v("。")])]),e._v(" "),r("li",[r("p",[e._v("Helena Hacker为Hackswap提供了流动性，看起来可以进行有利可图的套利机会。\n例如，她可以使您可以花费1个"),r("a",{attrs:{href:"https://www.coindesk.com/price/dai/",target:"_blank",rel:"noopener noreferrer"}},[e._v("DAI"),r("OutboundLink")],1),e._v("购买1.1个"),r("a",{attrs:{href:"https://www.coindesk.com/price/tether/",target:"_blank",rel:"noopener noreferrer"}},[e._v("USDT"),r("OutboundLink")],1),e._v("。\n这两种代币都应该价值正好1美元。")])]),e._v(" "),r("li",[r("p",[e._v("Nimrod Naive知道如果某事看起来太好了，那可能就是假的。\n然而，他检查了Hackswap合约的字节码，并验证它与Uniswap完全相同。\n他决定这意味着该合约可以被信任，行为与Uniswap完全相同。")])]),e._v(" "),r("li",[r("p",[e._v("Nimrod为Hackswap合约批准了1000个DAI的津贴。\nNimrod期望调用Hackswap的交换函数，并收到近1100个USDT。")])]),e._v(" "),r("li",[r("p",[e._v("在Nimrod的交换交易发送到区块链之前，Helena Hacker从与Hackswap在L2上相同地址的L1合约发送了一笔交易。\n该交易将1000个DAI从Nimrod的地址转移到Helena Hacker的地址。\n如果这笔交易来自与之前步骤中Nimrod必须给Hackswap授权的相同地址，它将能够转移这1000个DAI。")]),e._v(" "),r("p",[e._v("尽管Nimrod很天真，但他受到了Optimism修改的交易的保护，其中的"),r("code",[e._v("tx.origin")]),e._v("（也是初始的"),r("code",[e._v("msg.sender")]),e._v("）被修改了。\n该交易来自一个"),r("em",[e._v("不同的")]),e._v("地址，该地址没有这个津贴。")])])]),e._v(" "),r("p",[e._v("**注意：**在不同的链上创建两个不同的合约很简单。\n但是几乎不可能创建两个相差指定数量的不同合约，所以Helena Hacker无法做到这一点。")])]),e._v(" "),r("h2",{attrs:{id:"区块"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#区块"}},[e._v("#")]),e._v(" 区块")]),e._v(" "),r("p",[e._v("在L1以太坊和Optimism Bedrock之间，区块的生成方式有几个不同之处。")]),e._v(" "),r("table",[r("thead",[r("tr",[r("th",[e._v("参数")]),e._v(" "),r("th",[e._v("L1以太坊")]),e._v(" "),r("th",[e._v("Optimism Bedrock")])])]),e._v(" "),r("tbody",[r("tr",[r("td",[e._v("区块之间的时间间隔")]),e._v(" "),r("td",[e._v("12秒(1)")]),e._v(" "),r("td",[e._v("2秒")])]),e._v(" "),r("tr",[r("td",[e._v("区块目标大小")]),e._v(" "),r("td",[e._v("15,000,000 gas")]),e._v(" "),r("td",[e._v("待确定")])]),e._v(" "),r("tr",[r("td",[e._v("区块最大大小")]),e._v(" "),r("td",[e._v("30,000,000 gas")]),e._v(" "),r("td",[e._v("待确定")])])])]),e._v(" "),r("p",[e._v("(1) 这是理想情况。\n如果有任何区块被错过，可能是12秒的整数倍，如24秒、36秒等。")]),e._v(" "),r("p",[e._v("**注意：**L1以太坊的参数值取自"),r("a",{attrs:{href:"https://ethereum.org/en/developers/docs/blocks/#block-time",target:"_blank",rel:"noopener noreferrer"}},[e._v("ethereum.org"),r("OutboundLink")],1),e._v("。\nOptimism Bedrock的参数值取自"),r("a",{attrs:{href:"https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/specs/guaranteed-gas-market.md#limiting-guaranteed-gas",target:"_blank",rel:"noopener noreferrer"}},[e._v("Optimism规范"),r("OutboundLink")],1),e._v("。")]),e._v(" "),r("h2",{attrs:{id:"网络规范"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#网络规范"}},[e._v("#")]),e._v(" 网络规范")]),e._v(" "),r("h3",{attrs:{id:"json-rpc差异"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#json-rpc差异"}},[e._v("#")]),e._v(" JSON-RPC差异")]),e._v(" "),r("p",[e._v("OP Stack代码库使用与以太坊相同的"),r("a",{attrs:{href:"https://eth.wiki/json-rpc/API",target:"_blank",rel:"noopener noreferrer"}},[e._v("JSON-RPC API"),r("OutboundLink")],1),e._v("。\n还引入了一些OP Stack特定的方法。\n有关更多信息，请参阅"),r("a",{attrs:{href:"https://community.optimism.io/docs/developers/build/json-rpc/",target:"_blank",rel:"noopener noreferrer"}},[e._v("自定义JSON-RPC方法的完整列表"),r("OutboundLink")],1),e._v("。")]),e._v(" "),r("h3",{attrs:{id:"pre-eip-155支持"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#pre-eip-155支持"}},[e._v("#")]),e._v(" Pre-EIP-155支持")]),e._v(" "),r("p",[r("a",{attrs:{href:"https://eips.ethereum.org/EIPS/eip-155",target:"_blank",rel:"noopener noreferrer"}},[e._v("Pre-EIP-155"),r("OutboundLink")],1),e._v("交易没有链ID，这意味着在一个以太坊区块链上的交易可以在其他区块链上重放。\n这是一个安全风险，因此默认情况下OP Stack不支持Pre-EIP-155交易。")]),e._v(" "),r("h2",{attrs:{id:"交易成本"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#交易成本"}},[e._v("#")]),e._v(" 交易成本")]),e._v(" "),r("p",[r("a",{attrs:{href:"https://community.optimism.io/docs/developers/build/transaction-fees/",target:"_blank",rel:"noopener noreferrer"}},[e._v("默认情况下，OP Stack链上的交易成本"),r("OutboundLink")],1),e._v("包括"),r("a",{attrs:{href:"https://community.optimism.io/docs/developers/build/transaction-fees#the-l2-execution-fee",target:"_blank",rel:"noopener noreferrer"}},[e._v("L2执行费用"),r("OutboundLink")],1),e._v("和"),r("a",{attrs:{href:"https://community.optimism.io/docs/developers/build/transaction-fees#the-l1-data-fee",target:"_blank",rel:"noopener noreferrer"}},[e._v("L1数据费用"),r("OutboundLink")],1),e._v("。")])])}),[],!1,null,null,null);t.default=v.exports}}]);