if(!self.define){let s,e={};const a=(a,c)=>(a=new URL(a+".js",c).href,e[a]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=a,s.onload=e,document.head.appendChild(s)}else s=a,importScripts(a),e()})).then((()=>{let s=e[a];if(!s)throw new Error(`Module ${a} didn’t register its module`);return s})));self.define=(c,i)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let d={};const f=s=>a(s,r),b={module:{uri:r},exports:d,require:f};e[r]=Promise.all(c.map((s=>b[s]||f(s)))).then((s=>(i(...s),d)))}}define(["./workbox-cc3410a0"],(function(s){"use strict";s.setCacheNameDetails({prefix:"mr-hope"}),self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.clientsClaim(),s.precacheAndRoute([{url:"assets/css/0.styles.05d6b1d5.css",revision:"bff670e9d65725ea4165eaca5afc3331"},{url:"assets/img/danger-dark.7b1d6aa1.svg",revision:"7b1d6aa1bdcf013d0edfe316ab770f8e"},{url:"assets/img/danger.b143eda2.svg",revision:"b143eda243548a9982491dca4c81eed5"},{url:"assets/img/default-skin.b257fa9c.svg",revision:"b257fa9c5ac8c515ac4d77a667ce2943"},{url:"assets/img/info-dark.f8a43cf6.svg",revision:"f8a43cf67fa96a27a078530a3a43253c"},{url:"assets/img/info.88826912.svg",revision:"88826912d81d91c9e2d03164cd1481a1"},{url:"assets/img/search.83621669.svg",revision:"83621669651b9a3d4bf64d1a670ad856"},{url:"assets/img/tip-dark.075a244c.svg",revision:"075a244c83d1403c167defe81b4d7fe7"},{url:"assets/img/tip.a2b80aa5.svg",revision:"a2b80aa50b769a26da12fe352322a657"},{url:"assets/img/warning-dark.aac7e30c.svg",revision:"aac7e30c5fafc6748e21f7a9ef546698"},{url:"assets/img/warning.ec428b6d.svg",revision:"ec428b6d6d45ac5d0c610f08d757f40f"},{url:"assets/js/41.f0f3702e.js",revision:"d1149e33e214c5df379ea4c266001bab"},{url:"assets/js/app.a10c3567.js",revision:"cfbc4125dc80af2acf391718b47d1c63"},{url:"assets/js/layout-Blog.a994568e.js",revision:"ab4ae0992979494ae66c53809972f10a"},{url:"assets/js/layout-Blog~layout-Layout~layout-NotFound.3f9ea462.js",revision:"8b6e021bacf00c037889337b3e4948fe"},{url:"assets/js/layout-Layout.203bc08b.js",revision:"8661f0bcb6bc66f5d265860c8b50069f"},{url:"assets/js/layout-NotFound.1ba9c6f7.js",revision:"1c787d492e38390b18869c42bb759a00"},{url:"assets/js/layout-Slide.84c3cb7a.js",revision:"12193586db361214f1c5e6371675a9b1"},{url:"assets/js/page-BedrockExplainer.94d12776.js",revision:"4434f83accedbda3b01da95cc274f0cd"},{url:"assets/js/page-Bedrock与L1以太坊之间的差异.8cd91997.js",revision:"a42720d9c2bfb37376def148f7b00357"},{url:"assets/js/page-OPStackDocs.59efd7a5.js",revision:"b66d6adc1c9bc3c80f152f1eec4916d1"},{url:"assets/js/page-OPStackHacks简介.f30301fb.js",revision:"23c6a13c9919f98b4204c620e3cabaa3"},{url:"assets/js/page-OPStack代码库V1-Bedrock.3aa1884a.js",revision:"a8c33e2343855b7eab5d303bdfce78b3"},{url:"assets/js/page-OPStack全貌.61392c30.js",revision:"ac88a85b84099f9033988441e19f455f"},{url:"assets/js/page-Rollup操作.0d703b3b.js",revision:"ae9f8916b1600b0d25362d37e2cd58f0"},{url:"assets/js/page-Superchain解释器.89242b1c.js",revision:"b1ab59da9ee15372043884348954cbf2"},{url:"assets/js/page-WelcometotheOPStack.b8bd9ef7.js",revision:"bd69caaa0b3026a37715224a46c6a4db"},{url:"assets/js/page-为有用软件而设计的原则.2fc5fb96.js",revision:"d0345a18d82c86532f7e29d194b91de8"},{url:"assets/js/page-从OPStack区块链中强制提取资产.9051bd64.js",revision:"631808f88890215d30de2f0119a35808"},{url:"assets/js/page-使用OPStackClientSDK.b54e1490.js",revision:"a502fbea35f681552fa472713d9f1bfc"},{url:"assets/js/page-使用OPStack进行构建.bdc6fc4a.js",revision:"4e349ea4f234bf7f8aed270c5a92cb8d"},{url:"assets/js/page-修改预部署合约.c797a1aa.js",revision:"5ee2ab9dfa38bac26ce51a4629801693"},{url:"assets/js/page-区块浏览器和索引器.c803de8a.js",revision:"59915295979a143e2a320bc4c20149a7"},{url:"assets/js/page-发布历史.69ab2491.js",revision:"7221cd7a9f85ca33c7d5b2b9111640b0"},{url:"assets/js/page-向派生函数添加属性.96209ab2.js",revision:"d23a126febe09c834d29358e515ef4e3"},{url:"assets/js/page-安全策略、漏洞报告和赏金计划.41700a4f.js",revision:"a7de192f0a9ae8bac41fd3815b751952"},{url:"assets/js/page-常见安全问题.4686caaa.js",revision:"8bf4886f25fa9c551f19ea94e0d12c09"},{url:"assets/js/page-常见的安全问题.12aaeb7b.js",revision:"1ccb44c3d8a4c2abda806230b74406f8"},{url:"assets/js/page-快速开始.4118c74c.js",revision:"fb7bbd404360b56347aed534b270f9eb"},{url:"assets/js/page-执行技巧.afc3d4ed.js",revision:"484496e87f7c45d63f04c499f0c1aae5"},{url:"assets/js/page-数据可用性技巧.be17871a.js",revision:"5c7813a5cdc5da021cd9409c37abecc9"},{url:"assets/js/page-暂停和恢复桥接.cd2944e7.js",revision:"6414df1b9f0c21b5cb3cc0900a410784"},{url:"assets/js/page-添加一个预编译合约.8a6381b1.js",revision:"eddd8f4f06d4a499ee7a0aa5fe53487f"},{url:"assets/js/page-特色黑客技巧.dec0ea51.js",revision:"3ab1fdbf714827435da65b395c047b58"},{url:"assets/js/page-结算层技巧.9da9c0a8.js",revision:"df35ca3c58cc937110d13f0feb919d03"},{url:"assets/js/page-衍生技巧.9334377a.js",revision:"859e00796799bc7409fa28e49fe2fdf9"},{url:"assets/js/page-贡献指南.da66b8ad.js",revision:"2a89652b455412becf2fb780f3723c08"},{url:"assets/js/page-配置.fe26aa4e.js",revision:"96c3af729919e7b7d943ce4a14c1066c"},{url:"assets/js/vendors~docsearch.9346ec91.js",revision:"9695f91f1b7b3ef43efbf9ac63ea02c3"},{url:"assets/js/vendors~layout-Blog~layout-Layout~layout-NotFound.aa392ad9.js",revision:"046e42f91c026731f46a4a7745241472"},{url:"assets/js/vendors~layout-Layout.668d9695.js",revision:"291fc0d64ce40e7605cafdf7425801a5"},{url:"assets/js/vendors~photo-swipe.b538c7ab.js",revision:"c110b6c7956edd8744f926a3b3f15328"},{url:"index.html",revision:"c9e10737707f8bca920a48d7a15b3b2d"},{url:"404.html",revision:"4b91ca4775d6c74dfc3f23589d213346"}],{}),s.cleanupOutdatedCaches()}));
//# sourceMappingURL=service-worker.js.map
addEventListener("message", (event) => {
  const replyPort = event.ports[0];
  const message = event.data;
  if (replyPort && message && message.type === "skip-waiting")
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        (error) => replyPort.postMessage({ error })
      )
    );
});
