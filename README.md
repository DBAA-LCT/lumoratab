# Google 风格新标签页（Edge / Chrome）

一个无框架、无构建依赖的 Manifest V3 新标签页扩展，支持 Microsoft Edge 和 Google Chrome，视觉与交互参考现代浏览器新标签页。

## 为什么没有直接拉取 Google 的新标签页代码

Chromium 源码是开源的，但浏览器内置新标签页不是一个可单独安装的扩展。它依赖 Chromium 内部的 WebUI、C++/Mojo 接口和浏览器服务；Google Chrome 版本还包含品牌与在线服务部分。因此，本项目采用独立实现，而不是复制庞大的 Chromium 源码或引入来源不明的第三方项目。

## 当前功能

- 替换 Edge / Chrome 新标签页
- Google、百度、Bing 搜索与网址直达
- 使用浏览器 `topSites` API 读取常用网站
- 添加、编辑、分组和移除快捷方式
- 搜索浏览器收藏夹并选择网站作为快捷方式
- 使用浏览器 favicon API 显示站点图标
- 浅色与深色主题
- 必应壁纸、自定义图片和壁纸轮换
- 必应壁纸手动切换
- 壁纸模式下的液态玻璃快捷方式
- 所有设置保存在本地 `chrome.storage.local`

## 安装生产版本

GitHub Releases 提供以下安装包：

- 签名包：`custom-homepage-v<版本>.crx`
- Edge 解压包：`custom-homepage-edge-v<版本>.zip`
- Chrome 解压包：`custom-homepage-chrome-v<版本>.zip`

Windows 和 macOS 上的 Chrome/Edge 通常不允许普通用户直接安装非商店来源的 CRX。遇到限制时请下载对应 ZIP，然后：

1. Edge 打开 `edge://extensions/`；Chrome 打开 `chrome://extensions/`。
2. 开启“开发者模式”。
3. 点击“加载解压缩的扩展程序”。
4. 选择解压后的 `custom-homepage` 文件夹。

CRX 适合发布、企业策略部署和保留稳定的扩展 ID；ZIP 用于个人开发者模式安装。

## 从源码加载

1. 打开浏览器扩展管理页。
2. 开启“开发者模式”。
3. 点击“加载解压缩的扩展程序”。
4. 选择本项目目录。
5. 新建标签页进行测试。

修改代码后，在扩展管理页点击此扩展卡片上的“重新加载”。

## 构建生产包

在 PowerShell 中运行：

```powershell
.\build-release.ps1
```

默认情况下，脚本会在 `dist` 目录生成 Edge、Chrome 两个 ZIP 和 `SHA256SUMS.txt`。

使用固定 PEM 私钥还可以同时生成签名 CRX：

```powershell
python .\build-release.py --crx-key C:\安全目录\lumoratab.pem --require-crx
```

首次私钥可通过 Chrome 的“打包扩展程序”功能生成。必须安全保存并在所有后续版本中复用同一私钥，否则扩展 ID 会改变。不要把 `.pem` 提交到 Git。

推送与 `manifest.json` 版本一致的 `v*` 标签后，GitHub Actions 会自动构建并上传 ZIP、CRX 和校验文件。仓库需要配置 Base64 编码的 `CRX_PRIVATE_KEY_B64` Actions Secret。

## 文件结构

- `manifest.json`：Manifest V3 配置与权限
- `newtab.html`：页面结构与对话框
- `newtab.css`：界面和响应式布局
- `newtab.js`：搜索、快捷方式、主题和壁纸逻辑
- `build-release.ps1`：生产包构建脚本
- `dist/`：生成的浏览器安装包

## 发布注意

页面中的 Google、Microsoft、Bing 等名称及标识可能涉及相应权利人的商标。个人使用和界面原型可以保留；如发布到浏览器扩展商店，建议改成自有名称与标识，避免让用户误以为这是官方产品。

## Edge 开发预览脚本

双击 `preview-edge-dev.cmd` 会启动一个独立的 Edge 开发窗口。普通 Edge 可以保持运行；开发窗口使用 `%LocalAppData%\CustomHomepageEdgeDev` 作为独立资料目录，避免影响日常浏览器配置。

脚本首次运行会打开 `edge://extensions/`。请开启“开发人员模式”，点击“加载解压缩的扩展”，选择本项目目录一次；Edge 会在开发资料中记住该扩展。以后双击脚本会检测扩展已注册并直接打开自定义新标签页。

脚本首次运行时还会把默认 Edge 资料中的收藏夹复制到开发资料，因此可以测试收藏夹选择、常用网站、favicon 和本地设置；登录 Cookie 和浏览会话不会复制。修改 HTML、CSS 或 JavaScript 后刷新开发标签页即可，修改 `manifest.json` 后在扩展管理页点击“重新加载”。
