# LumoraTab Privacy Policy / 微光新标签页隐私政策

**Effective date / 生效日期：2026-08-24**

LumoraTab（微光新标签页）是一款替换浏览器新标签页的扩展。本政策说明扩展访问、保存和传输哪些数据。

## 中文

### 1. 本地访问与存储

LumoraTab 可以访问浏览器收藏夹和常用网站，以便用户选择或生成快捷方式。扩展会在浏览器本地保存快捷方式、分组、搜索引擎选择、搜索历史、主题、壁纸设置、自定义图片以及站点图标缓存。这些数据保存在 `chrome.storage.local` 中，不会上传到开发者控制的服务器。

用户主动导出配置时，快捷方式、设置和本地图片会写入用户下载的 JSON 文件；导入只读取用户选择的本地文件，不会上传到 LumoraTab 服务器。

### 2. 网络请求

部分功能需要直接请求第三方服务：

- 用户输入搜索内容时，在线联想功能会把输入内容发送给当前选择的 Google、百度或 Bing 联想服务。按下搜索后，浏览器会导航到用户选择的搜索引擎。
- 用户主动选择豆包或 DeepSeek 并按下回车时，扩展会在当前浏览器会话内短暂保存该问题及用户选择的“深度思考”“联网搜索”开关，打开所选 AI 网页、应用网页能够识别的开关、填入问题并尝试发送。任务仅在网页确认发送后从扩展会话存储中删除；未发送任务最多可在十分钟内被目标网页领取，且不会写入 LumoraTab 搜索历史。登录、发送及后续处理由对应 AI 网站负责。
- 启用必应壁纸时，扩展会请求 Microsoft Bing 的壁纸列表和图片。
- 自动获取快捷网站图标时，扩展优先使用浏览器本地图标接口；如果本地图标不可用，可能把快捷网站的域名发送给 Clearbit、Google、Icon Horse 或 DuckDuckGo 的图标服务。
- 用户设置自定义图标网址时，浏览器会直接向该网址请求图片。

这些第三方服务会按照各自的隐私政策处理请求。LumoraTab 不会在这些请求中主动附加浏览器 Cookie、身份凭据或开发者自定义的用户标识。

### 3. 开发者不收集的数据

开发者不运营用于接收扩展用户数据的服务器，不收集身份信息、认证信息、财务信息、健康信息、精确位置、私人通信或浏览记录，不出售用户数据，不将用户数据用于广告，也不使用分析或跟踪 SDK。

### 4. 数据控制与删除

用户可以在扩展界面中修改快捷方式、搜索历史和设置。卸载扩展或在浏览器扩展设置中清除其存储数据，会删除 LumoraTab 保存在本地的数据。发送到第三方服务的请求受相应服务政策约束。

### 5. 权限用途

- `bookmarks`：供用户搜索浏览器收藏夹并添加快捷方式。
- `favicon`：读取浏览器保存的站点图标。
- `storage`：在本地保存设置和内容。
- `topSites`：首次使用时读取常用网站并生成快捷方式。
- `unlimitedStorage`：支持保存用户选择的自定义壁纸和图标文件。
- 网站访问权限：用于搜索联想、必应壁纸，以及仅在用户主动选择时向豆包或 DeepSeek 网页填写并发送纯文字问题。

### 6. 联系方式

如有隐私问题，请通过 [LumoraTab GitHub Issues](https://github.com/DBAA-LCT/lumoratab/issues) 联系开发者。

## English

### 1. Local access and storage

LumoraTab can access browser bookmarks and top sites so users can select or create shortcuts. Shortcuts, groups, search-engine selection, local search history, theme and wallpaper settings, user-selected images, and favicon cache entries are stored locally in `chrome.storage.local`. They are not uploaded to a server controlled by the developer.

When a user explicitly exports configuration, shortcuts, settings, and local images are written to a downloaded JSON file. Import reads only the local file selected by the user and does not upload it to a LumoraTab server.

### 2. Network requests

Some optional features communicate directly with third-party services:

- Online suggestions send the text being typed to the suggestion endpoint of the selected provider (Google, Baidu, or Bing). Submitting a search navigates to that provider.
- When the user explicitly selects Doubao or DeepSeek and presses Enter, the question and the selected Deep Thinking and Web Search options are held briefly in browser-session memory while LumoraTab opens the selected AI website, applies options that the page exposes, fills the question, and attempts to send it. The task is removed only after the page confirms that it was sent; an unsent task remains claimable for up to ten minutes and is never added to LumoraTab search history. Authentication, delivery, and subsequent processing are handled by the selected AI website.
- Bing wallpaper mode requests wallpaper metadata and images from Microsoft Bing.
- Automatic shortcut icons use the browser favicon API first. If no usable local icon is available, a shortcut hostname may be sent to Clearbit, Google, Icon Horse, or DuckDuckGo favicon services.
- A custom icon URL selected by the user is requested directly by the browser.

Those services process requests under their own privacy policies. LumoraTab does not intentionally attach browser cookies, credentials, or a developer-defined user identifier to these requests.

### 3. Data not collected by the developer

The developer operates no server that receives extension user data. LumoraTab does not collect identifying information, authentication information, financial or health information, precise location, private communications, or browsing history. It does not sell user data, use data for advertising, or include analytics or tracking SDKs.

### 4. User control and deletion

Users can edit shortcuts, search history, and settings within the extension. Uninstalling LumoraTab or clearing its extension storage removes locally stored LumoraTab data. Requests already sent to third-party services remain subject to those services' policies.

### 5. Permission purposes

- `bookmarks`: lets users search their browser bookmarks and create shortcuts.
- `favicon`: reads favicons already available to the browser.
- `storage`: stores settings and user-created content locally.
- `topSites`: creates initial shortcuts from frequently visited sites.
- `unlimitedStorage`: supports locally selected wallpaper and icon files.
- Host access: used for search suggestions, Bing wallpaper, and—only after an explicit user action—filling and submitting a plain-text question on Doubao or DeepSeek.

### 6. Contact

For privacy questions, contact the developer through [LumoraTab GitHub Issues](https://github.com/DBAA-LCT/lumoratab/issues).
