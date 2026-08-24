# 微光新标签页 LumoraTab（Edge / Chrome）

LumoraTab 是一个无框架、无构建依赖的 Manifest V3 新标签页扩展，为 Microsoft Edge 和 Google Chrome 提供简洁、快速、可自定义的起始页面。

项目采用独立实现，不包含或复制浏览器厂商的专有新标签页代码，也不代表 Google、Microsoft、Bing 或其他第三方官方产品。

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

从 GitHub Releases 下载对应安装包并解压：

- Edge：`lumoratab-edge-v<版本>.zip`
- Chrome：`lumoratab-chrome-v<版本>.zip`

然后：

1. Edge 打开 `edge://extensions/`；Chrome 打开 `chrome://extensions/`。
2. 开启“开发者模式”。
3. 点击“加载解压缩的扩展程序”。
4. 选择解压后的 `lumoratab` 文件夹。

浏览器通常不允许直接安装非商店来源的 CRX，因此个人使用采用 ZIP +“加载解压缩”方式。

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

脚本会在 `dist` 目录生成 Edge、Chrome 两个 ZIP 和 `SHA256SUMS.txt`。

## 文件结构

- `manifest.json`：Manifest V3 配置与权限
- `newtab.html`：页面结构与对话框
- `newtab.css`：界面和响应式布局
- `newtab.js`：搜索、快捷方式、主题和壁纸逻辑
- `build-release.ps1`：生产包构建脚本
- `store/`：双语商店文案、隐私政策、权限说明和发布检查清单
- `dist/`：生成的浏览器安装包

## 发布注意

页面中的 Google、Microsoft、Bing 等名称及标识可能涉及相应权利人的商标。个人使用和界面原型可以保留；如发布到浏览器扩展商店，建议改成自有名称与标识，避免让用户误以为这是官方产品。

## Edge 开发预览脚本

双击 `preview-edge-dev.cmd` 会启动一个独立的 Edge 开发窗口。普通 Edge 可以保持运行；开发窗口使用 `%LocalAppData%\CustomHomepageEdgeDev` 作为独立资料目录，避免影响日常浏览器配置。

脚本首次运行会打开 `edge://extensions/`。请开启“开发人员模式”，点击“加载解压缩的扩展”，选择本项目目录一次；Edge 会在开发资料中记住该扩展。以后双击脚本会检测扩展已注册并直接打开自定义新标签页。

脚本首次运行时还会把默认 Edge 资料中的收藏夹复制到开发资料，因此可以测试收藏夹选择、常用网站、favicon 和本地设置；登录 Cookie 和浏览会话不会复制。修改 HTML、CSS 或 JavaScript 后刷新开发标签页即可，修改 `manifest.json` 后在扩展管理页点击“重新加载”。
