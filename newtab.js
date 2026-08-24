const SEARCH_ENGINES = {
  google: {
    name: 'Google',
    searchUrl: 'https://www.google.com/search?q=',
    suggestUrl: (query) => `https://suggestqueries.google.com/complete/search?client=chrome&hl=zh-CN&q=${encodeURIComponent(query)}`,
    parseSuggestions: (data) => Array.isArray(data?.[1]) ? data[1] : [],
    recommendations: ['今日天气', '热点新闻', '在线翻译', '附近餐厅'],
    logo: '<span class="engine-logo google-logo" aria-hidden="true"><span class="blue">G</span><span class="red">o</span><span class="yellow">o</span><span class="blue">g</span><span class="green">l</span><span class="red">e</span></span>'
  },
  baidu: {
    name: '百度',
    searchUrl: 'https://www.baidu.com/s?wd=',
    suggestUrl: (query) => `https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&action=opensearch&ie=utf-8`,
    parseSuggestions: (data) => Array.isArray(data?.[1]) ? data[1] : [],
    recommendations: ['百度热搜', '今日天气', '最新新闻', '影视榜单'],
    logo: '<span class="engine-logo baidu-logo" aria-hidden="true"><span class="baidu-latin">Bai</span><svg class="baidu-paw" viewBox="0 0 76 68"><g fill="#2932e1"><ellipse cx="16" cy="17" rx="7" ry="11" transform="rotate(-18 16 17)"/><ellipse cx="31" cy="10" rx="7" ry="11"/><ellipse cx="47" cy="10" rx="7" ry="11"/><ellipse cx="61" cy="18" rx="7" ry="11" transform="rotate(18 61 18)"/><path d="M38 22c-12 0-25 15-25 28 0 11 10 15 25 15s25-4 25-15c0-13-13-28-25-28Z"/></g><text x="38" y="58" text-anchor="middle" fill="#fff" font-family="Arial" font-size="25" font-weight="700">du</text></svg><span class="baidu-hanzi">百度</span></span>'
  },
  bing: {
    name: '必应',
    searchUrl: 'https://www.bing.com/search?q=',
    suggestUrl: (query) => `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(query)}`,
    parseSuggestions: (data) => Array.isArray(data?.[1]) ? data[1] : [],
    recommendations: ['今日新闻', '图片搜索', 'AI 工具', '旅行攻略'],
    logo: '<span class="engine-logo bing-logo" aria-hidden="true"><svg class="microsoft-mark" viewBox="0 0 46 46"><path fill="#f25022" d="M1 1h21v21H1z"/><path fill="#7fba00" d="M24 1h21v21H24z"/><path fill="#00a4ef" d="M1 24h21v21H1z"/><path fill="#ffb900" d="M24 24h21v21H24z"/></svg><span class="bing-copy"><span class="microsoft-label">Microsoft</span><span class="bing-name">Bing</span></span></span>'
  },
  sogou: {
    name: '搜狗',
    searchUrl: 'https://www.sogou.com/web?query=',
    recommendations: ['搜狗热搜', '今日天气', '新闻资讯', '微信文章'],
    logo: '<span class="engine-logo sogou-logo" aria-hidden="true"><svg class="sogou-mark" viewBox="0 0 64 64"><circle cx="32" cy="32" r="25" fill="none" stroke="currentColor" stroke-width="6"/><path d="M43 21c-4-4-17-4-21 1-5 7 2 11 10 11 8 0 13 4 9 9-4 5-15 4-20 0" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg><span>搜狗搜索</span></span>'
  },
  so360: {
    name: '360',
    searchUrl: 'https://www.so.com/s?q=',
    suggestUrl: (query) => `https://sug.so.360.cn/suggest?word=${encodeURIComponent(query)}&encodein=utf-8&encodeout=utf-8`,
    parseSuggestions: (data) => Array.isArray(data?.result) ? data.result.map((item) => item?.word).filter(Boolean) : [],
    recommendations: ['360热搜', '今日天气', '最新资讯', '实用工具'],
    logo: '<span class="engine-logo so360-logo" aria-hidden="true"><span class="so360-mark"><i></i></span><span>360搜索</span></span>'
  },
  doubao: {
    name: '豆包',
    type: 'ai',
    chatUrl: 'https://www.doubao.com/chat/',
    recommendations: [],
    logo: '<span class="engine-logo ai-engine-logo" aria-hidden="true"><img src="icons/sites/doubao.com.png" alt=""><span>问豆包</span></span>'
  },
  deepseek: {
    name: 'DeepSeek',
    type: 'ai',
    chatUrl: 'https://chat.deepseek.com/',
    recommendations: [],
    logo: '<span class="engine-logo ai-engine-logo deepseek-engine-logo" aria-hidden="true"><img src="icons/sites/chat.deepseek.com.png" alt=""><span>问 DeepSeek</span></span>'
  }
};
const SEARCH_ENGINE_ORDER = Object.keys(SEARCH_ENGINES);

const NATIVE_ICONS = {
  voice: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm-1 4.9A7 7 0 0 1 5 12h2a5 5 0 0 0 10 0h2a7 7 0 0 1-6 6.9V22h-2v-3.1Z"/></svg>',
  visual: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9H2V5a3 3 0 0 1 3-3h4v2H5a1 1 0 0 0-1 1v4Zm18 0h-2V5a1 1 0 0 0-1-1h-4V2h4a3 3 0 0 1 3 3v4ZM9 22H5a3 3 0 0 1-3-3v-4h2v4a1 1 0 0 0 1 1h4v2Zm10 0h-4v-2h4a1 1 0 0 0 1-1v-4h2v4a3 3 0 0 1-3 3ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg>',
  attachment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 18.5a5 5 0 0 1 0-7.1l7.8-7.8a4 4 0 0 1 5.7 5.7l-8.5 8.5a3 3 0 0 1-4.2-4.2l7.8-7.8 1.4 1.4-7.8 7.8a1 1 0 0 0 1.4 1.4l8.5-8.5a2 2 0 1 0-2.8-2.8L9 12.8a3 3 0 0 0 4.2 4.2l7.1-7.1 1.4 1.4-7.1 7.1a5 5 0 0 1-7.1.1Z"/></svg>',
  image: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14Zm-2-2H7l2.8-3.6 2.2 2.7 1.5-1.9L17 17ZM9 10.5A1.5 1.5 0 1 0 9 7a1.5 1.5 0 0 0 0 3.5Z"/></svg>',
  ai: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 4a5.5 5.5 0 1 0 3.5 9.7l4.6 4.6 1.4-1.4-4.6-4.6A5.5 5.5 0 0 0 9.5 4Zm0 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm8-4 .8 2.2L20.5 5l-2.2.8L17.5 8l-.8-2.2-2.2-.8 2.2-.8L17.5 2Z"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2Zm6 11 .9 2.6L22 17l-3.1 1.4L18 21l-.9-2.6L14 17l3.1-1.4L18 13ZM5 14l1.1 3.1L9 18l-2.9.9L5 22l-1.1-3.1L1 18l2.9-.9L5 14Z"/></svg>'
};

const NATIVE_SEARCH_BOXES = {
  google: {
    leadingAction: 'add',
    placeholder: '',
    showSearchIcon: false,
    actions: [
      { id: 'voice', label: '语音搜索' },
      { id: 'visual', label: 'Google Lens' },
      { id: 'ai', label: 'AI 模式', text: true }
    ]
  },
  baidu: {
    placeholder: '日本新财年预算显著增加',
    showSearchIcon: false,
    submitLabel: '百度一下',
    actions: [
      { id: 'voice', label: '语音搜索' },
      { id: 'attachment', label: '上传图片或文件到百度识图' },
      { id: 'visual', icon: 'image', label: '百度图片搜索' }
    ]
  },
  bing: {
    placeholder: '搜索网页',
    showSearchIcon: true,
    externalAction: 'copilot',
    actions: [
      { id: 'voice', label: '语音搜索' },
      { id: 'visual', label: 'Bing 视觉搜索' }
    ]
  },
  sogou: {
    placeholder: '搜狗搜索',
    showSearchIcon: false,
    submitLabel: '搜索',
    actions: []
  },
  so360: {
    placeholder: '搜你想搜的',
    showSearchIcon: false,
    submitLabel: '搜索',
    actions: [
      { id: 'ai', icon: 'sparkle', label: '问AI', text: true }
    ]
  },
  doubao: {
    placeholder: '输入问题，按 Enter 发送给豆包',
    showSearchIcon: false,
    submitLabel: '发送',
    actions: []
  },
  deepseek: {
    placeholder: '输入问题，按 Enter 发送给 DeepSeek',
    showSearchIcon: false,
    submitLabel: '发送',
    actions: []
  }
};

const SHORTCUT_GAP = 8;
const SHORTCUT_DESKTOP_WIDTH = 104;
const SHORTCUT_COMPACT_WIDTH = 88;

const DEFAULT_SHORTCUTS = [
  { name: 'Gmail', url: 'https://mail.google.com/' },
  { name: 'YouTube', url: 'https://www.youtube.com/' },
  { name: '地图', url: 'https://maps.google.com/' },
  { name: '云端硬盘', url: 'https://drive.google.com/' }
];

const SHORTCUT_LIBRARY = [
  { name: '百度', url: 'https://www.baidu.com/', category: '工具' },
  { name: '哔哩哔哩', url: 'https://www.bilibili.com/', category: '影音' },
  { name: '知乎', url: 'https://www.zhihu.com/', category: '社区' },
  { name: '微博', url: 'https://weibo.com/', category: '社区' },
  { name: '淘宝', url: 'https://www.taobao.com/', category: '购物' },
  { name: '京东', url: 'https://www.jd.com/', category: '购物' },
  { name: '拼多多', url: 'https://www.pinduoduo.com/', category: '购物' },
  { name: '小红书', url: 'https://www.xiaohongshu.com/', category: '社区' },
  { name: '豆瓣', url: 'https://www.douban.com/', category: '社区' },
  { name: '什么值得买', url: 'https://www.smzdm.com/', category: '购物' },
  { name: '虎扑', url: 'https://www.hupu.com/', category: '社区' },
  { name: '百度贴吧', url: 'https://tieba.baidu.com/', category: '社区' },
  { name: 'ChatGPT', url: 'https://chatgpt.com/', category: 'AI' },
  { name: 'DeepSeek', url: 'https://chat.deepseek.com/', category: 'AI' },
  { name: '通义千问', url: 'https://www.tongyi.com/', category: 'AI' },
  { name: '豆包', url: 'https://www.doubao.com/', category: 'AI' },
  { name: 'Claude', url: 'https://claude.ai/', category: 'AI' },
  { name: 'Gemini', url: 'https://gemini.google.com/', category: 'AI' },
  { name: 'Kimi', url: 'https://www.kimi.com/', category: 'AI' },
  { name: '腾讯元宝', url: 'https://yuanbao.tencent.com/', category: 'AI' },
  { name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com/', category: 'AI' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai/', category: 'AI' },
  { name: '秘塔AI搜索', url: 'https://metaso.cn/', category: 'AI' },
  { name: '可灵AI', url: 'https://klingai.kuaishou.com/', category: 'AI' },
  { name: 'GitHub', url: 'https://github.com/', category: '开发' },
  { name: 'Gitee', url: 'https://gitee.com/', category: '开发' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com/', category: '开发' },
  { name: 'MDN', url: 'https://developer.mozilla.org/', category: '开发' },
  { name: 'Vercel', url: 'https://vercel.com/', category: '开发' },
  { name: 'Cloudflare', url: 'https://www.cloudflare.com/', category: '开发' },
  { name: 'npm', url: 'https://www.npmjs.com/', category: '开发' },
  { name: 'Docker Hub', url: 'https://hub.docker.com/', category: '开发' },
  { name: 'LeetCode', url: 'https://leetcode.cn/', category: '开发' },
  { name: '掘金', url: 'https://juejin.cn/', category: '开发' },
  { name: 'CSDN', url: 'https://www.csdn.net/', category: '开发' },
  { name: 'SegmentFault', url: 'https://segmentfault.com/', category: '开发' },
  { name: 'Gmail', url: 'https://mail.google.com/', category: '办公' },
  { name: 'Google Drive', url: 'https://drive.google.com/', category: '办公' },
  { name: '腾讯文档', url: 'https://docs.qq.com/', category: '办公' },
  { name: '飞书', url: 'https://www.feishu.cn/', category: '办公' },
  { name: 'Notion', url: 'https://www.notion.so/', category: '办公' },
  { name: '钉钉', url: 'https://www.dingtalk.com/', category: '办公' },
  { name: 'WPS云文档', url: 'https://www.kdocs.cn/', category: '办公' },
  { name: 'Microsoft 365', url: 'https://www.microsoft365.com/', category: '办公' },
  { name: 'OneDrive', url: 'https://onedrive.live.com/', category: '办公' },
  { name: 'Dropbox', url: 'https://www.dropbox.com/', category: '办公' },
  { name: 'Canva', url: 'https://www.canva.com/', category: '办公' },
  { name: '石墨文档', url: 'https://shimo.im/', category: '办公' },
  { name: 'YouTube', url: 'https://www.youtube.com/', category: '影音' },
  { name: '腾讯视频', url: 'https://v.qq.com/', category: '影音' },
  { name: '爱奇艺', url: 'https://www.iqiyi.com/', category: '影音' },
  { name: '网易云音乐', url: 'https://music.163.com/', category: '影音' },
  { name: '优酷', url: 'https://www.youku.com/', category: '影音' },
  { name: '芒果TV', url: 'https://www.mgtv.com/', category: '影音' },
  { name: 'QQ音乐', url: 'https://y.qq.com/', category: '影音' },
  { name: 'Spotify', url: 'https://open.spotify.com/', category: '影音' },
  { name: '抖音', url: 'https://www.douyin.com/', category: '影音' },
  { name: 'AcFun', url: 'https://www.acfun.cn/', category: '影音' },
  { name: 'Google翻译', url: 'https://translate.google.com/', category: '工具' },
  { name: '百度翻译', url: 'https://fanyi.baidu.com/', category: '工具' },
  { name: '高德地图', url: 'https://www.amap.com/', category: '工具' },
  { name: '百度地图', url: 'https://map.baidu.com/', category: '工具' },
  { name: '铁路12306', url: 'https://www.12306.cn/', category: '工具' },
  { name: '携程旅行', url: 'https://www.ctrip.com/', category: '工具' },
  { name: '中国天气网', url: 'https://www.weather.com.cn/', category: '工具' },
  { name: '快递100', url: 'https://www.kuaidi100.com/', category: '工具' },
  { name: 'ProcessOn', url: 'https://www.processon.com/', category: '工具' },
  { name: 'TinyPNG', url: 'https://tinypng.com/', category: '工具' },
  { name: 'Unsplash', url: 'https://unsplash.com/', category: '工具' },
  { name: 'Internet Archive', url: 'https://archive.org/', category: '工具' }
];

const BUNDLED_SITE_ICON_HOSTS = new Set(SHORTCUT_LIBRARY.map((resource) => new URL(resource.url).hostname.replace(/^www\./, '')));
const BUNDLED_SITE_ICON_ALIASES = {
  'office.com': 'microsoft365.com',
  'chat.openai.com': 'chatgpt.com'
};

const state = {
  searchEngine: 'google',
  searchHistory: [],
  shortcuts: [],
  iconSourceCache: {},
  resourceOverrides: {},
  customization: {
    theme: 'light',
    wallpaper: { mode: 'none', image: '' },
    shortcutRows: 3
  }
};

const elements = {
  searchArea: document.querySelector('#search-area'),
  searchBoxRow: document.querySelector('#search-box-row'),
  searchEngineSwitch: document.querySelector('#search-engine-switch'),
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('#search-input'),
  searchLeadingAction: document.querySelector('#search-leading-action'),
  searchIcon: document.querySelector('#search-icon'),
  searchNativeActions: document.querySelector('#search-native-actions'),
  searchSubmit: document.querySelector('#search-submit'),
  searchExternalAction: document.querySelector('#search-external-action'),
  searchAddMenu: document.querySelector('#search-add-menu'),
  searchSuggestions: document.querySelector('#search-suggestions'),
  suggestionList: document.querySelector('#suggestion-list'),
  suggestionStatus: document.querySelector('#suggestion-status'),
  shortcuts: document.querySelector('#shortcuts'),
  shortcutPagination: document.querySelector('#shortcut-pagination'),
  shortcutSettingsMenu: document.querySelector('#shortcut-settings-menu'),
  shortcutEditAction: document.querySelector('#shortcut-edit-action'),
  shortcutMovePrevAction: document.querySelector('#shortcut-move-prev-action'),
  shortcutMoveNextAction: document.querySelector('#shortcut-move-next-action'),
  shortcutDeleteAction: document.querySelector('#shortcut-delete-action'),
  groupItemSettingsMenu: document.querySelector('#group-item-settings-menu'),
  groupItemOpenAction: document.querySelector('#group-item-open-action'),
  groupItemMoveoutAction: document.querySelector('#group-item-moveout-action'),
  groupItemDeleteAction: document.querySelector('#group-item-delete-action'),
  shortcutDialog: document.querySelector('#shortcut-dialog'),
  shortcutDialogTitle: document.querySelector('#shortcut-dialog-title'),
  shortcutForm: document.querySelector('#shortcut-form'),
  shortcutMainTabs: document.querySelector('#shortcut-main-tabs'),
  shortcutTabLibrary: document.querySelector('#shortcut-tab-library'),
  shortcutTabCustom: document.querySelector('#shortcut-tab-custom'),
  shortcutLibraryPanel: document.querySelector('#shortcut-library-panel'),
  shortcutCustomPanel: document.querySelector('#shortcut-custom-panel'),
  shortcutName: document.querySelector('#shortcut-name'),
  shortcutUrl: document.querySelector('#shortcut-url'),
  shortcutUrlLabel: document.querySelector('#shortcut-url-label'),
  shortcutIconSettings: document.querySelector('#shortcut-icon-settings'),
  shortcutIconMode: document.querySelector('#shortcut-icon-mode'),
  shortcutIconUrlLabel: document.querySelector('#shortcut-icon-url-label'),
  shortcutIconUrl: document.querySelector('#shortcut-icon-url'),
  shortcutIconFileLabel: document.querySelector('#shortcut-icon-file-label'),
  shortcutIconFile: document.querySelector('#shortcut-icon-file'),
  shortcutIconPreview: document.querySelector('#shortcut-icon-preview'),
  resourcePickerButton: document.querySelector('#resource-picker-button'),
  resourcePicker: document.querySelector('#resource-picker'),
  resourceSearch: document.querySelector('#resource-search'),
  resourceCategories: document.querySelector('#resource-categories'),
  resourceList: document.querySelector('#resource-list'),
  resourceStatus: document.querySelector('#resource-status'),
  resourceSelectionCount: document.querySelector('#resource-selection-count'),
  resourceDestination: document.querySelector('#resource-destination'),
  resourceAddSelected: document.querySelector('#resource-add-selected'),
  resourceUrlDialog: document.querySelector('#resource-url-dialog'),
  resourceUrlForm: document.querySelector('#resource-url-form'),
  resourceUrlName: document.querySelector('#resource-url-name'),
  resourceDefaultUrl: document.querySelector('#resource-default-url'),
  resourceUrlInput: document.querySelector('#resource-url-input'),
  resourceUrlError: document.querySelector('#resource-url-error'),
  resourceUrlReset: document.querySelector('#resource-url-reset'),
  shortcutDestination: document.querySelector('#shortcut-destination'),
  shortcutLocationSection: document.querySelector('#shortcut-location-section'),
  showNewGroup: document.querySelector('#show-new-group'),
  newGroupPanel: document.querySelector('#new-group-panel'),
  newGroupName: document.querySelector('#new-group-name'),
  createGroupButton: document.querySelector('#create-group-button'),
  shortcutGroupDialog: document.querySelector('#shortcut-group-dialog'),
  shortcutGroupTitle: document.querySelector('#shortcut-group-title'),
  shortcutGroupList: document.querySelector('#shortcut-group-list'),
  groupAddShortcut: document.querySelector('#group-add-shortcut'),
  shortcutError: document.querySelector('#shortcut-error'),
  manageShortcutsButton: document.querySelector('#manage-shortcuts-button'),
  shortcutSelectionBar: document.querySelector('#shortcut-selection-bar'),
  shortcutSelectionCount: document.querySelector('#shortcut-selection-count'),
  cancelShortcutSelection: document.querySelector('#cancel-shortcut-selection'),
  deleteSelectedShortcuts: document.querySelector('#delete-selected-shortcuts'),
  customizeButton: document.querySelector('#customize-button'),
  nextWallpaperButton: document.querySelector('#next-wallpaper-button'),
  customizeDialog: document.querySelector('#customize-dialog'),
  customizeForm: document.querySelector('#customize-form'),
  resetCustomization: document.querySelector('#reset-customization'),
  wallpaperFileLabel: document.querySelector('#wallpaper-file-label'),
  wallpaperFile: document.querySelector('#wallpaper-file'),
  wallpaperHint: document.querySelector('#wallpaper-hint'),
  wallpaperRotateLabel: document.querySelector('#wallpaper-rotate-label'),
  wallpaperRotate: document.querySelector('#wallpaper-rotate')
};

function hasExtensionApi(namespace) {
  return typeof chrome !== 'undefined' && Boolean(chrome[namespace]);
}

async function storageGet(keys) {
  if (!hasExtensionApi('storage')) return {};
  return chrome.storage.local.get(keys);
}

async function storageSet(value) {
  if (!hasExtensionApi('storage')) return;
  await chrome.storage.local.set(value);
}

function createNativeActionButton(action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `native-action-button${action.text ? ' native-text-action' : ''}`;
  button.dataset.action = action.id;
  button.setAttribute('aria-label', action.label);
  const iconName = action.icon || action.id;
  button.innerHTML = NATIVE_ICONS[iconName] || NATIVE_ICONS.visual;
  if (action.text) {
    const label = document.createElement('span');
    label.textContent = action.label;
    button.append(label);
  }
  return button;
}

function renderNativeSearchBox() {
  const config = NATIVE_SEARCH_BOXES[state.searchEngine];
  const engine = SEARCH_ENGINES[state.searchEngine];
  elements.searchArea.dataset.engine = state.searchEngine;
  elements.searchBoxRow.dataset.engine = state.searchEngine;
  elements.searchForm.dataset.engine = state.searchEngine;
  elements.searchInput.placeholder = config.placeholder;
  elements.searchLeadingAction.hidden = !config.leadingAction;
  elements.searchLeadingAction.dataset.action = config.leadingAction || '';
  elements.searchLeadingAction.setAttribute('aria-label', config.leadingAction === 'add' ? '更多搜索方式' : '搜索工具');
  elements.searchLeadingAction.setAttribute('aria-expanded', 'false');
  elements.searchIcon.hidden = !config.showSearchIcon;
  elements.searchNativeActions.replaceChildren(...config.actions.map(createNativeActionButton));
  elements.searchNativeActions.setAttribute('aria-label', `${engine.name} 搜索工具`);
  elements.searchSubmit.hidden = !config.submitLabel;
  elements.searchSubmit.textContent = config.submitLabel || '';
  elements.searchExternalAction.hidden = !config.externalAction;
  elements.searchExternalAction.dataset.action = config.externalAction || '';
  elements.searchAddMenu.hidden = true;
}

const VISUAL_SEARCH_URLS = {
  google: 'https://lens.google.com/',
  baidu: 'https://graph.baidu.com/pcpage/index?tpl_from=pc',
  bing: 'https://www.bing.com/visualsearch'
};
let voiceRecognition;

function showNativeActionStatus(message) {
  elements.searchInput.focus();
  renderSearchSuggestions([], message);
}

function startVoiceSearch() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    showNativeActionStatus('当前 Edge 环境无法使用语音识别');
    return;
  }

  voiceRecognition?.abort();
  voiceRecognition = new Recognition();
  voiceRecognition.lang = 'zh-CN';
  voiceRecognition.interimResults = false;
  voiceRecognition.maxAlternatives = 1;
  voiceRecognition.addEventListener('start', () => {
    elements.searchForm.dataset.listening = 'true';
    elements.searchInput.placeholder = '正在聆听…';
  });
  voiceRecognition.addEventListener('result', (event) => {
    elements.searchInput.value = event.results[0][0].transcript;
    refreshSearchSuggestions();
    elements.searchInput.focus();
  });
  voiceRecognition.addEventListener('error', () => showNativeActionStatus('没有识别到语音，请重试'));
  voiceRecognition.addEventListener('end', () => {
    delete elements.searchForm.dataset.listening;
    elements.searchInput.placeholder = NATIVE_SEARCH_BOXES[state.searchEngine].placeholder;
  });
  voiceRecognition.start();
}

function setSearchAddMenuOpen(open) {
  const nextOpen = Boolean(open && state.searchEngine === 'google');
  elements.searchAddMenu.hidden = !nextOpen;
  elements.searchLeadingAction.setAttribute('aria-expanded', String(nextOpen));
  if (nextOpen) {
    setSearchSuggestionsOpen(false);
    requestAnimationFrame(() => elements.searchAddMenu.querySelector('button')?.focus());
  }
}

async function handleNativeSearchAction(action) {
  if (action === 'add') {
    setSearchAddMenuOpen(elements.searchAddMenu.hidden);
    return;
  }

  setSearchAddMenuOpen(false);
  if (action === 'voice') {
    startVoiceSearch();
    return;
  }
  if (action === 'visual' || action === 'attachment') {
    window.location.assign(VISUAL_SEARCH_URLS[state.searchEngine]);
    return;
  }

  const query = elements.searchInput.value.trim();
  if (query) await addSearchHistory(query);
  if (action === 'ai') {
    const destination = state.searchEngine === 'so360'
      ? `https://ai.so.com/search${query ? `?q=${encodeURIComponent(query)}` : ''}`
      : `https://www.google.com/search?udm=50${query ? `&q=${encodeURIComponent(query)}` : ''}`;
    window.location.assign(destination);
  } else if (action === 'copilot') {
    window.location.assign(`https://www.bing.com/copilotsearch${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }
}

function renderSearchEngine() {
  const engine = SEARCH_ENGINES[state.searchEngine];
  const isAi = engine.type === 'ai';
  elements.searchEngineSwitch.innerHTML = engine.logo;
  elements.searchEngineSwitch.setAttribute('aria-label', isAi ? `当前向${engine.name}提问，点击切换` : `当前使用${engine.name}搜索，点击展开搜索引擎`);
  elements.searchInput.setAttribute('aria-label', isAi ? `向${engine.name}提问` : `使用${engine.name}搜索或输入网址`);
  renderNativeSearchBox();
  document.querySelectorAll('#search-engine-menu [data-engine]').forEach((option) => {
    option.setAttribute('aria-checked', String(option.dataset.engine === state.searchEngine));
  });
}

elements.searchLeadingAction.addEventListener('click', () => handleNativeSearchAction(elements.searchLeadingAction.dataset.action));
elements.searchNativeActions.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (button) handleNativeSearchAction(button.dataset.action);
});
elements.searchExternalAction.addEventListener('click', () => handleNativeSearchAction(elements.searchExternalAction.dataset.action));
elements.searchAddMenu.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (button) handleNativeSearchAction(button.dataset.action);
});
elements.searchAddMenu.addEventListener('keydown', (event) => {
  const items = [...elements.searchAddMenu.querySelectorAll('button')];
  if (event.key === 'Escape') {
    setSearchAddMenuOpen(false);
    elements.searchLeadingAction.focus();
  } else if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    const currentIndex = items.indexOf(document.activeElement);
    const nextIndex = (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[nextIndex].focus();
  }
});

let engineCloseTimer;
function setEngineMenuOpen(open, focusSelected = false) {
  const menu = document.querySelector('#search-engine-menu');
  clearTimeout(engineCloseTimer);
  elements.searchEngineSwitch.setAttribute('aria-expanded', String(open));

  if (open) {
    menu.hidden = false;
    delete menu.dataset.open;
    void menu.offsetWidth;
    requestAnimationFrame(() => {
      if (elements.searchEngineSwitch.getAttribute('aria-expanded') !== 'true') return;
      menu.dataset.open = 'true';
      if (focusSelected) menu.querySelector(`[data-engine="${state.searchEngine}"]`).focus();
    });
    return;
  }

  delete menu.dataset.open;
  engineCloseTimer = setTimeout(() => {
    if (elements.searchEngineSwitch.getAttribute('aria-expanded') === 'false') menu.hidden = true;
  }, 500);
}

async function selectSearchEngine(engineId) {
  if (!SEARCH_ENGINES[engineId]) return;
  state.searchEngine = engineId;
  renderSearchEngine();
  setEngineMenuOpen(false);
  await storageSet({ searchEngine: state.searchEngine });
  elements.searchEngineSwitch.focus();
}

function switchSearchEngine(event) {
  event?.stopPropagation();
  const isOpen = elements.searchEngineSwitch.getAttribute('aria-expanded') === 'true';
  setEngineMenuOpen(!isOpen, !isOpen);
}

const searchEngineMenu = document.querySelector('#search-engine-menu');
searchEngineMenu.addEventListener('click', (event) => {
  const option = event.target.closest('[data-engine]');
  if (option) selectSearchEngine(option.dataset.engine);
});
searchEngineMenu.addEventListener('keydown', (event) => {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const options = [...searchEngineMenu.querySelectorAll('[data-engine]')];
  const currentIndex = options.indexOf(document.activeElement);
  let nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 :
    (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
  options[nextIndex].focus();
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.engine-picker')) setEngineMenuOpen(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || searchEngineMenu.hidden) return;
  setEngineMenuOpen(false);
  elements.searchEngineSwitch.focus();
});

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error('请输入网址');

  let candidate;
  if (/^https?:\/\//i.test(trimmed)) {
    candidate = trimmed;
  } else if (/^localhost(?::\d+)?(?:\/|$)/i.test(trimmed)) {
    candidate = `http://${trimmed}`;
  } else {
    candidate = `https://${trimmed}`;
  }

  const url = new URL(candidate);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('仅支持 http 或 https 网址');
  return url.href;
}

function looksLikeUrl(value) {
  const query = value.trim();
  return /^(https?:\/\/|localhost(?::\d+)?(?:\/|$)|(?:[\w-]+\.)+[a-z]{2,}(?:[\/:?#]|$))/i.test(query);
}

const HISTORY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3a9 9 0 1 0 8.5 6h-2.1A7 7 0 1 1 13 5v3l4-4-4-4v3Zm-1 5h2v5l4 2-1 1.7-5-2.7V8Z"/></svg>';
const SUGGESTION_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20.3 19-4.7-4.7a7 7 0 1 0-1.4 1.4l4.7 4.7a1 1 0 0 0 1.4-1.4ZM5 10.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Z"/></svg>';
let suggestionTimer;
let suggestionController;
let suggestionRequestId = 0;
let isComposing = false;

function setSearchSuggestionsOpen(open) {
  elements.searchSuggestions.hidden = !open;
  elements.searchForm.setAttribute('aria-expanded', String(open));
  if (!open) {
    clearTimeout(suggestionTimer);
    suggestionController?.abort();
    suggestionRequestId += 1;
  }
}

function createSuggestionHeading(title, clearable = false) {
  const heading = document.createElement('div');
  heading.className = 'suggestion-heading';
  const label = document.createElement('span');
  label.textContent = title;
  heading.append(label);

  if (clearable) {
    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'clear-history-button';
    clearButton.textContent = '清除记录';
    clearButton.addEventListener('click', async () => {
      state.searchHistory = [];
      await storageSet({ searchHistory: [] });
      renderSearchSuggestions();
      elements.searchInput.focus();
    });
    heading.append(clearButton);
  }
  return heading;
}

async function removeSearchHistoryItem(item) {
  const key = item.query.toLocaleLowerCase();
  state.searchHistory = state.searchHistory.filter((entry) => entry.query.toLocaleLowerCase() !== key);
  await storageSet({ searchHistory: state.searchHistory });
  refreshSearchSuggestions();
  requestAnimationFrame(() => elements.searchInput.focus());
}

function createSuggestionItem(item) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'suggestion-item';
  button.setAttribute('role', 'option');
  button.dataset.query = item.query;

  const icon = document.createElement('span');
  icon.innerHTML = item.type === 'history' ? HISTORY_ICON : SUGGESTION_ICON;
  const text = document.createElement('span');
  text.className = 'suggestion-text';
  text.textContent = item.query;
  const engine = document.createElement('span');
  engine.className = 'suggestion-engine';
  engine.textContent = SEARCH_ENGINES[item.engine]?.name || SEARCH_ENGINES[state.searchEngine].name;
  button.append(icon, text, engine);

  button.addEventListener('click', async () => {
    if (item.type === 'history' && SEARCH_ENGINES[item.engine] && item.engine !== state.searchEngine) {
      await selectSearchEngine(item.engine);
    }
    navigateFromSearch(item.query);
  });

  if (item.type !== 'history') return button;

  const row = document.createElement('div');
  row.className = 'suggestion-row';
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'suggestion-delete-button';
  removeButton.setAttribute('aria-label', `删除搜索记录：${item.query}`);
  removeButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18.3 5.7-1-1L12 10l-5.3-5.3-1 1L11 11l-5.3 5.3 1 1L12 12l5.3 5.3 1-1L13 11l5.3-5.3Z"/></svg>';
  removeButton.addEventListener('click', () => removeSearchHistoryItem(item));
  row.append(button, removeButton);
  return row;
}

function appendSuggestionGroup(title, items, clearable = false) {
  if (!items.length) return;
  elements.suggestionList.append(createSuggestionHeading(title, clearable));
  items.forEach((item) => elements.suggestionList.append(createSuggestionItem(item)));
}

function renderSearchSuggestions(remoteSuggestions = [], status = '') {
  const query = elements.searchInput.value.trim();
  const normalizedQuery = query.toLocaleLowerCase();
  const engine = SEARCH_ENGINES[state.searchEngine];
  const history = (engine.type === 'ai' ? [] : state.searchHistory)
    .filter((item) => !normalizedQuery || item.query.toLocaleLowerCase().includes(normalizedQuery))
    .slice(0, normalizedQuery ? 4 : 6);
  const seen = new Set(history.map((item) => item.query.toLocaleLowerCase()));
  const rawSuggestions = normalizedQuery ? remoteSuggestions : engine.recommendations;
  const suggestions = rawSuggestions
    .filter((value) => typeof value === 'string' && value.trim())
    .map((value) => value.trim())
    .filter((value) => {
      const key = value.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6)
    .map((value) => ({ query: value, engine: state.searchEngine, type: 'suggestion' }));

  elements.suggestionList.replaceChildren();
  appendSuggestionGroup('搜索记录', history.map((item) => ({ ...item, type: 'history' })), true);
  appendSuggestionGroup(normalizedQuery ? `${engine.name} 联想` : `${engine.name} 推荐`, suggestions);

  if (status) {
    const footer = document.createElement('div');
    footer.className = 'suggestion-footer';
    footer.textContent = status;
    elements.suggestionList.append(footer);
  } else if (normalizedQuery && suggestions.length) {
    const footer = document.createElement('div');
    footer.className = 'suggestion-footer';
    footer.textContent = `联想来自 ${engine.name}`;
    elements.suggestionList.append(footer);
  }

  const hasContent = Boolean(elements.suggestionList.children.length);
  setSearchSuggestionsOpen(hasContent);
  elements.suggestionStatus.textContent = hasContent ? `显示 ${history.length + suggestions.length} 条搜索建议` : '没有搜索建议';
}

function shouldRequestSuggestions(query) {
  const characters = [...query];
  return /[\u3400-\u9fff]/.test(query) ? characters.length >= 1 : characters.length >= 2;
}

async function fetchEngineSuggestions(query, engineId, requestId) {
  suggestionController = new AbortController();
  const timeout = setTimeout(() => suggestionController.abort(), 3500);
  try {
    const response = await fetch(SEARCH_ENGINES[engineId].suggestUrl(query), {
      signal: suggestionController.signal,
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const engine = SEARCH_ENGINES[engineId];
    const bytes = await response.arrayBuffer();
    const text = new TextDecoder(engine.suggestEncoding || 'utf-8').decode(bytes);
    const data = JSON.parse(text);
    const suggestions = engine.parseSuggestions(data);
    if (requestId === suggestionRequestId && engineId === state.searchEngine && query === elements.searchInput.value.trim()) {
      renderSearchSuggestions(suggestions);
    }
  } catch (error) {
    if (error.name !== 'AbortError' && requestId === suggestionRequestId) {
      renderSearchSuggestions([], '在线联想暂不可用，按 Enter 直接搜索');
    }
  } finally {
    clearTimeout(timeout);
  }
}

function refreshSearchSuggestions() {
  clearTimeout(suggestionTimer);
  suggestionController?.abort();
  const query = elements.searchInput.value.trim().slice(0, 120);
  const requestId = ++suggestionRequestId;

  if (!query) {
    renderSearchSuggestions();
    return;
  }
  const engine = SEARCH_ENGINES[state.searchEngine];
  if (engine.type === 'ai') {
    renderSearchSuggestions([], `按 Enter 发送给${engine.name}`);
    return;
  }
  if (!shouldRequestSuggestions(query)) {
    renderSearchSuggestions([], '继续输入以获取联想');
    return;
  }

  if (typeof engine.suggestUrl !== 'function') {
    renderSearchSuggestions([], `按 Enter 使用${engine.name}搜索`);
    return;
  }

  renderSearchSuggestions([], '正在获取联想…');
  const engineId = state.searchEngine;
  suggestionTimer = setTimeout(() => fetchEngineSuggestions(query, engineId, requestId), 280);
}

async function addSearchHistory(query) {
  const normalized = query.trim();
  if (!normalized) return;
  state.searchHistory = [
    { query: normalized, engine: state.searchEngine, timestamp: Date.now() },
    ...state.searchHistory.filter((item) => item.query.toLocaleLowerCase() !== normalized.toLocaleLowerCase())
  ].slice(0, 10);
  await storageSet({ searchHistory: state.searchHistory });
}

async function navigateFromSearch(query) {
  const value = query.trim();
  if (!value) return;

  setSearchSuggestionsOpen(false);
  const engine = SEARCH_ENGINES[state.searchEngine];
  if (engine.type === 'ai') {
    if (hasExtensionApi('storage') && chrome.storage.session) {
      await chrome.storage.session.set({
        pendingAiPrompt: {
          id: globalThis.crypto?.randomUUID?.() || `ai-${Date.now()}`,
          provider: state.searchEngine,
          text: value,
          createdAt: Date.now()
        }
      });
    }
    window.location.assign(engine.chatUrl);
    return;
  }
  if (looksLikeUrl(value)) {
    window.location.assign(normalizeUrl(value));
    return;
  }

  await addSearchHistory(value);
  window.location.assign(`${engine.searchUrl}${encodeURIComponent(value)}`);
}

elements.searchInput.addEventListener('focus', () => {
  setSearchAddMenuOpen(false);
  refreshSearchSuggestions();
});
elements.searchInput.addEventListener('compositionstart', () => {
  isComposing = true;
  clearTimeout(suggestionTimer);
  suggestionController?.abort();
});
elements.searchInput.addEventListener('compositionend', () => {
  isComposing = false;
  refreshSearchSuggestions();
});
elements.searchInput.addEventListener('input', () => {
  if (!isComposing) refreshSearchSuggestions();
});
elements.searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setSearchSuggestionsOpen(false);
    return;
  }
  if (event.key === 'ArrowDown' && !elements.searchSuggestions.hidden) {
    const firstItem = elements.suggestionList.querySelector('.suggestion-item');
    if (firstItem) {
      event.preventDefault();
      firstItem.focus();
    }
  }
});
elements.suggestionList.addEventListener('keydown', (event) => {
  const items = [...elements.suggestionList.querySelectorAll('.suggestion-item')];
  if (event.key === 'Escape') {
    setSearchSuggestionsOpen(false);
    elements.searchInput.focus();
    return;
  }
  if (!['ArrowDown', 'ArrowUp'].includes(event.key) || !items.length) return;
  event.preventDefault();
  const currentIndex = items.indexOf(document.activeElement);
  const nextIndex = (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
  items[nextIndex].focus();
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.search-area')) {
    setSearchSuggestionsOpen(false);
    setSearchAddMenuOpen(false);
  } else if (!event.target.closest('#search-leading-action, #search-add-menu')) {
    setSearchAddMenuOpen(false);
  }
  if (!event.target.closest('#shortcut-settings-menu, .shortcut-menu')) closeShortcutSettingsMenu();
  if (!event.target.closest('#group-item-settings-menu, .group-item-menu')) closeGroupItemMenu();
});

// 文件夹内条目三点菜单的动作
elements.groupItemOpenAction.addEventListener('click', () => {
  const ref = activeGroupItemRef;
  if (!ref) return;
  const item = state.shortcuts[ref.groupIndex]?.items?.[ref.itemIndex];
  closeGroupItemMenu();
  if (item) window.open(item.url, '_blank', 'noopener');
});
elements.groupItemMoveoutAction.addEventListener('click', async () => {
  const ref = activeGroupItemRef;
  if (!ref) return;
  const group = state.shortcuts[ref.groupIndex];
  if (!group || group.type !== 'group') return;
  const [item] = group.items.splice(ref.itemIndex, 1);
  if (!item) return;
  state.shortcuts.push(item); // 移出文件夹 → 追加到主页末尾
  await commitGroupItemChange();
});
elements.groupItemDeleteAction.addEventListener('click', async () => {
  const ref = activeGroupItemRef;
  if (!ref) return;
  const group = state.shortcuts[ref.groupIndex];
  if (!group || group.type !== 'group') return;
  group.items.splice(ref.itemIndex, 1);
  await commitGroupItemChange();
});

function getFaviconUrl(pageUrl, size = 64) {
  if (!hasExtensionApi('runtime')) return '';
  const faviconBase = new URL('/_favicon/', chrome.runtime.getURL('/'));
  faviconBase.searchParams.set('pageUrl', pageUrl);
  faviconBase.searchParams.set('size', String(size));
  return faviconBase.href;
}

function getShortcutHost(pageUrl) {
  try {
    return new URL(pageUrl).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

const ICON_SOURCE_TIMEOUT = 4500;
const ICON_SOURCE_CACHE_LIMIT = 200;
const ICON_CACHE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const ICON_DATA_CACHE_MAX_BYTES = 160 * 1024;
const ICON_RENDER_SIZE = 48;
const resolvedIconCache = new Map();
const pendingIconResolutions = new Map();
let iconCacheWriteTimer;

function isReusableIconUrl(url) {
  if (typeof url !== 'string' || !url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' || (parsed.protocol === 'data:' && url.startsWith('data:image/'))) return true;
    return hasExtensionApi('runtime') && url.startsWith(chrome.runtime.getURL('/'));
  } catch {
    return false;
  }
}

function hydrateResolvedIconCache(cache) {
  resolvedIconCache.clear();
  const entries = cache && typeof cache === 'object' ? Object.entries(cache) : [];
  entries.slice(-ICON_SOURCE_CACHE_LIMIT).forEach(([host, value]) => {
    const record = typeof value === 'string' ? { url: value, updatedAt: 0 } : value;
    if (!host || !record || !isReusableIconUrl(record.dataUrl || record.url)) return;
    if (record.updatedAt && Date.now() - record.updatedAt > ICON_CACHE_MAX_AGE) return;
    resolvedIconCache.set(host, record);
  });
  state.iconSourceCache = Object.fromEntries(resolvedIconCache);
}

function getBundledSiteIconUrl(pageUrl) {
  const host = getShortcutHost(pageUrl);
  const iconHost = BUNDLED_SITE_ICON_ALIASES[host] || host;
  if (!BUNDLED_SITE_ICON_HOSTS.has(iconHost)) return '';
  const path = `icons/sites/${iconHost}.png`;
  return hasExtensionApi('runtime') ? chrome.runtime.getURL(path) : path;
}

function rememberResolvedIcon(host, result) {
  if (!host || !isReusableIconUrl(result?.url)) return;
  resolvedIconCache.delete(host);
  resolvedIconCache.set(host, { url: result.url, width: result.width, height: result.height, updatedAt: Date.now() });
  while (resolvedIconCache.size > ICON_SOURCE_CACHE_LIMIT) {
    resolvedIconCache.delete(resolvedIconCache.keys().next().value);
  }
  state.iconSourceCache = Object.fromEntries(resolvedIconCache);
  clearTimeout(iconCacheWriteTimer);
  iconCacheWriteTimer = setTimeout(() => {
    storageSet({ iconSourceCache: state.iconSourceCache }).catch(() => {});
  }, 100);
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('icon cache read failed'));
    reader.readAsDataURL(blob);
  });
}

async function persistResolvedIconData(host, result) {
  if (!host || !result?.url || result.local || result.url.startsWith('data:')) return;
  try {
    const response = await fetch(result.url, { cache: 'force-cache', credentials: 'omit', referrerPolicy: 'no-referrer' });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) return;
    const blob = await response.blob();
    if (!blob.size || blob.size > ICON_DATA_CACHE_MAX_BYTES) return;
    const dataUrl = await blobToDataUrl(blob);
    const current = resolvedIconCache.get(host);
    if (!current || current.url !== result.url || !isReusableIconUrl(dataUrl)) return;
    resolvedIconCache.set(host, { ...current, dataUrl, updatedAt: Date.now() });
    state.iconSourceCache = Object.fromEntries(resolvedIconCache);
    await storageSet({ iconSourceCache: state.iconSourceCache });
  } catch {}
}

function getCachedIconUrl(pageUrl) {
  const cached = resolvedIconCache.get(getShortcutHost(pageUrl));
  return cached?.dataUrl || cached?.url || '';
}

function probeIconSource(candidate) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timer = setTimeout(() => {
      image.src = '';
      reject(new Error('timeout'));
    }, ICON_SOURCE_TIMEOUT);
    image.onload = () => {
      clearTimeout(timer);
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const shortestSide = Math.min(width, height);
      const aspectRatio = width / Math.max(1, height);
      if (shortestSide < candidate.minSize || aspectRatio < .55 || aspectRatio > 1.8) {
        reject(new Error('low-quality'));
        return;
      }
      const vectorBonus = candidate.vector ? 2000 : 0;
      const firstPartyBonus = candidate.firstParty ? 80 : 0;
      resolve({ ...candidate, width, height, score: vectorBonus + firstPartyBonus + Math.min(shortestSide, 1024) });
    };
    image.onerror = () => {
      clearTimeout(timer);
      reject(new Error('failed'));
    };
    image.referrerPolicy = 'no-referrer';
    image.decoding = 'async';
    image.src = candidate.url;
  });
}

function getIconSourceCandidates(pageUrl) {
  const host = getShortcutHost(pageUrl);
  const candidates = [];
  try {
    const origin = new URL(pageUrl).origin;
    candidates.push(
      { url: `${origin}/favicon.svg`, minSize: 24, vector: true, firstParty: true },
      { url: `${origin}/apple-touch-icon.png`, minSize: 64, firstParty: true },
      { url: `${origin}/favicon-512x512.png`, minSize: 96, firstParty: true },
      { url: `${origin}/favicon-192x192.png`, minSize: 64, firstParty: true },
      { url: `${origin}/favicon.png`, minSize: 48, firstParty: true },
      { url: `${origin}/favicon.ico`, minSize: 32, firstParty: true }
    );
  } catch {}
  if (host) {
    candidates.push(
      { url: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=256`, minSize: 64 },
      { url: `https://logo.clearbit.com/${encodeURIComponent(host)}?size=256`, minSize: 64 },
      { url: `https://icon.horse/icon/${encodeURIComponent(host)}`, minSize: 32 },
      { url: `https://icons.duckduckgo.com/ip3/${encodeURIComponent(host)}.ico`, minSize: 32 }
    );
  }
  const physicalSize = Math.min(256, Math.max(64, Math.ceil(ICON_RENDER_SIZE * (window.devicePixelRatio || 1))));
  const local = getFaviconUrl(pageUrl, physicalSize);
  if (local) candidates.push({ url: local, minSize: 16, local: true });
  return candidates;
}

function resolveIconUrl(pageUrl) {
  const host = getShortcutHost(pageUrl);
  const cached = host ? resolvedIconCache.get(host) : null;
  if (cached?.dataUrl || cached?.url) return Promise.resolve(cached.dataUrl || cached.url);
  if (host && pendingIconResolutions.has(host)) return pendingIconResolutions.get(host);

  const request = (async () => {
    const candidates = getIconSourceCandidates(pageUrl);
    const firstPartyResults = await Promise.allSettled(candidates.filter((candidate) => candidate.firstParty).map(probeIconSource));
    const firstPartyIcons = firstPartyResults
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);
    const strongFirstParty = firstPartyIcons
      .filter((result) => result.vector || Math.min(result.width, result.height) >= 96)
      .sort((a, b) => b.score - a.score)[0];
    if (strongFirstParty) {
      rememberResolvedIcon(host, strongFirstParty);
      persistResolvedIconData(host, strongFirstParty);
      return strongFirstParty.url;
    }

    const fallbackResults = await Promise.allSettled(candidates.filter((candidate) => !candidate.firstParty).map(probeIconSource));
    const best = [...firstPartyIcons, ...fallbackResults
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)]
      .sort((a, b) => b.score - a.score)[0];
    if (!best) return '';
    rememberResolvedIcon(host, best);
    persistResolvedIconData(host, best);
    return best.url;
  })();

  if (host) {
    pendingIconResolutions.set(host, request);
    request.finally(() => pendingIconResolutions.delete(host));
  }
  return request;
}

function getShortcutIconSource(shortcut) {
  if (shortcut.icon?.value && ['file', 'url'].includes(shortcut.icon.type)) {
    return { url: shortcut.icon.value, type: shortcut.icon.type };
  }
  return { type: 'favicon' };
}

function attachIconImage(icon, url) {
  const image = document.createElement('img');
  image.alt = '';
  image.decoding = 'async';
  image.addEventListener('load', () => icon.replaceChildren(image), { once: true });
  image.src = url;
}

function attachResolvedFavicon(icon, pageUrl) {
  const bundled = getBundledSiteIconUrl(pageUrl);
  if (bundled) {
    attachIconImage(icon, bundled);
    return;
  }
  const cached = getCachedIconUrl(pageUrl);
  const physicalSize = Math.min(256, Math.max(64, Math.ceil(ICON_RENDER_SIZE * (window.devicePixelRatio || 1))));
  const immediate = cached || getFaviconUrl(pageUrl, physicalSize);
  if (immediate) attachIconImage(icon, immediate);
  if (cached) return;
  resolveIconUrl(pageUrl).then((resolved) => {
    if (resolved && resolved !== immediate) attachIconImage(icon, resolved);
  });
}

function createShortcutIcon(shortcut, className = 'shortcut-icon') {
  const icon = document.createElement('span');
  icon.className = className;
  icon.textContent = shortcut.name.trim().charAt(0).toUpperCase() || '?';

  const source = getShortcutIconSource(shortcut);
  if (source.url) attachIconImage(icon, source.url);
  else if (source.type === 'favicon') attachResolvedFavicon(icon, shortcut.url);
  return icon;
}

let pendingIconFileData = '';

function getDraftShortcut() {
  const mode = elements.shortcutIconMode.value;
  let icon;
  if (mode === 'url' && elements.shortcutIconUrl.value.trim()) icon = { type: 'url', value: elements.shortcutIconUrl.value.trim() };
  if (mode === 'file' && pendingIconFileData) icon = { type: 'file', value: pendingIconFileData };
  return {
    name: elements.shortcutName.value.trim() || 'A',
    url: elements.shortcutUrl.value.trim() || 'https://example.com/',
    ...(icon ? { icon } : {})
  };
}

function renderShortcutIconPreview() {
  const shortcut = getDraftShortcut();
  const preview = elements.shortcutIconPreview;
  preview.textContent = shortcut.name.charAt(0).toUpperCase() || 'A';
  const source = getShortcutIconSource(shortcut);
  if (source.url) {
    attachIconImage(preview, source.url);
    return;
  }
  if (source.type === 'favicon') attachResolvedFavicon(preview, shortcut.url);
}

function updateShortcutIconFields() {
  const mode = elements.shortcutIconMode.value;
  elements.shortcutIconUrlLabel.hidden = mode !== 'url';
  elements.shortcutIconFileLabel.hidden = mode !== 'file';
  renderShortcutIconPreview();
}

function readIconFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('请选择图标文件'));
    if (file.size > 512 * 1024) return reject(new Error('图标文件不能超过 512KB'));
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(String(reader.result)));
    reader.addEventListener('error', () => reject(new Error('无法读取图标文件')));
    reader.readAsDataURL(file);
  });
}

function getIconConfigFromForm() {
  const mode = elements.shortcutIconMode.value;
  if (mode === 'auto') return undefined;
  if (mode === 'file') {
    if (!pendingIconFileData) throw new Error('请选择本地图标文件');
    return { type: 'file', value: pendingIconFileData };
  }
  const value = elements.shortcutIconUrl.value.trim();
  if (!value) throw new Error('请输入图标图片网址');
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('图标网址必须使用 HTTPS');
  return { type: 'url', value: url.href };
}

let activeShortcutMenuIndex = -1;
let activeShortcutMenuButton = null;
let editingShortcutIndex = -1;

function closeShortcutSettingsMenu() {
  elements.shortcutSettingsMenu.hidden = true;
  activeShortcutMenuButton?.setAttribute('aria-expanded', 'false');
  activeShortcutMenuButton = null;
  activeShortcutMenuIndex = -1;
}

function openShortcutSettingsMenu(index, anchor) {
  const item = state.shortcuts[index];
  if (!item) return;
  if (!elements.shortcutSettingsMenu.hidden && activeShortcutMenuIndex === index) {
    closeShortcutSettingsMenu();
    return;
  }

  activeShortcutMenuIndex = index;
  activeShortcutMenuButton?.setAttribute('aria-expanded', 'false');
  activeShortcutMenuButton = anchor;
  anchor.setAttribute('aria-expanded', 'true');
  elements.shortcutEditAction.textContent = item.type === 'group' ? '重命名文件夹' : '编辑快捷方式';
  elements.shortcutDeleteAction.textContent = item.type === 'group' ? '删除文件夹' : '删除快捷方式';
  const page = Math.floor(index / getShortcutPageSize());
  elements.shortcutMovePrevAction.hidden = page <= 0;
  elements.shortcutMoveNextAction.hidden = page >= getShortcutPageCount() - 1;
  elements.shortcutSettingsMenu.hidden = false;

  const rect = anchor.getBoundingClientRect();
  const menuRect = elements.shortcutSettingsMenu.getBoundingClientRect();
  const left = Math.max(8, Math.min(rect.right - menuRect.width, window.innerWidth - menuRect.width - 8));
  const top = Math.min(rect.bottom + 6, window.innerHeight - menuRect.height - 8);
  elements.shortcutSettingsMenu.style.left = `${left}px`;
  elements.shortcutSettingsMenu.style.top = `${Math.max(8, top)}px`;
  requestAnimationFrame(() => elements.shortcutEditAction.focus());
}

function editShortcutFromSettings() {
  const index = activeShortcutMenuIndex;
  if (!state.shortcuts[index]) return;
  closeShortcutSettingsMenu();
  openShortcutDialog('root', index);
}

async function deleteShortcutFromSettings() {
  const index = activeShortcutMenuIndex;
  if (!state.shortcuts[index]) return;
  closeShortcutSettingsMenu();
  if (activeGroupIndex === index && elements.shortcutGroupDialog.open) elements.shortcutGroupDialog.close();
  state.shortcuts.splice(index, 1);
  activeGroupIndex = -1;
  await storageSet({ shortcuts: state.shortcuts });
  renderShortcuts();
}

function createMenuButton(index, item) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'shortcut-menu';
  button.setAttribute('aria-label', `设置 ${item.name}`);
  button.setAttribute('aria-haspopup', 'menu');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openShortcutSettingsMenu(index, button);
  });
  return button;
}

async function moveShortcutToAdjacentPage(direction) {
  const index = activeShortcutMenuIndex;
  if (!state.shortcuts[index] || ![-1, 1].includes(direction)) return;
  const pageSize = getShortcutPageSize();
  const currentPage = Math.floor(index / pageSize);
  const targetPage = currentPage + direction;
  if (targetPage < 0 || targetPage >= getShortcutPageCount()) return;
  closeShortcutSettingsMenu();
  const [item] = state.shortcuts.splice(index, 1);
  const targetStart = targetPage * pageSize;
  const insertIndex = direction < 0
    ? Math.min(targetStart + pageSize - 1, state.shortcuts.length)
    : Math.min(targetStart, state.shortcuts.length);
  state.shortcuts.splice(insertIndex, 0, item);
  shortcutsPage = targetPage;
  await storageSet({ shortcuts: state.shortcuts });
  renderShortcuts();
}

let shortcutSelectionMode = false;
const selectedShortcutIndexes = new Set();

function updateShortcutSelectionUi() {
  const count = selectedShortcutIndexes.size;
  elements.shortcutSelectionBar.hidden = !shortcutSelectionMode;
  elements.shortcutSelectionCount.textContent = `已选择 ${count} 项`;
  elements.deleteSelectedShortcuts.disabled = count === 0;
  elements.manageShortcutsButton.hidden = shortcutSelectionMode || state.shortcuts.length === 0;
}

function setShortcutSelectionMode(enabled) {
  shortcutSelectionMode = Boolean(enabled);
  selectedShortcutIndexes.clear();
  document.body.classList.toggle('shortcut-selection-mode', shortcutSelectionMode);
  renderShortcuts();
  updateShortcutSelectionUi();
}

function toggleShortcutSelection(index) {
  if (selectedShortcutIndexes.has(index)) selectedShortcutIndexes.delete(index);
  else selectedShortcutIndexes.add(index);
  renderShortcuts();
  updateShortcutSelectionUi();
}

function enableShortcutSelection(tile, index) {
  tile.draggable = !shortcutSelectionMode;
  if (!shortcutSelectionMode) return;
  tile.classList.add('selectable');
  if (selectedShortcutIndexes.has(index)) tile.classList.add('selected');
  const check = document.createElement('span');
  check.className = 'shortcut-selection-check';
  check.textContent = selectedShortcutIndexes.has(index) ? '✓' : '';
  tile.append(check);
  tile.addEventListener('click', (event) => {
    if (event.target.closest('.shortcut-menu')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    toggleShortcutSelection(index);
  }, true);
}

async function deleteSelectedShortcuts() {
  const indexes = [...selectedShortcutIndexes].sort((a, b) => b - a);
  if (!indexes.length) return;
  if (indexes.includes(activeGroupIndex) && elements.shortcutGroupDialog.open) elements.shortcutGroupDialog.close();
  indexes.forEach((index) => state.shortcuts.splice(index, 1));
  activeGroupIndex = -1;
  await storageSet({ shortcuts: state.shortcuts });
  setShortcutSelectionMode(false);
}

function createLinkShortcut(shortcut, index) {
  const tile = document.createElement('div');
  tile.className = 'shortcut shortcut-tile';
  tile.draggable = true;
  tile.dataset.index = String(index);

  const link = document.createElement('a');
  link.className = 'shortcut-link';
  link.href = shortcut.url;
  link.setAttribute('aria-label', `打开 ${shortcut.name}`);
  link.append(createShortcutIcon(shortcut));

  const title = document.createElement('span');
  title.className = 'shortcut-title';
  title.textContent = shortcut.name;
  link.append(title);
  tile.append(link, createMenuButton(index, shortcut));
  enableShortcutSelection(tile, index);
  return tile;
}

function createGroupPreview(group) {
  const preview = document.createElement('span');
  preview.className = 'shortcut-group-preview';
  group.items.slice(0, 4).forEach((item) => preview.append(createShortcutIcon(item, 'shortcut-group-mini')));
  while (preview.children.length < 4) {
    const empty = document.createElement('span');
    empty.className = 'shortcut-group-mini shortcut-group-mini-empty';
    preview.append(empty);
  }
  return preview;
}

let activeGroupIndex = -1;

let activeGroupItemRef = null; // { groupIndex, itemIndex }：文件夹内三点菜单当前指向的条目
let activeGroupItemMenuButton = null;

function pruneEmptyShortcutGroups() {
  let removedActiveGroup = false;
  for (let index = state.shortcuts.length - 1; index >= 0; index -= 1) {
    const item = state.shortcuts[index];
    if (item?.type !== 'group' || item.items.length) continue;
    if (index === activeGroupIndex) removedActiveGroup = true;
    state.shortcuts.splice(index, 1);
    if (index < activeGroupIndex) activeGroupIndex -= 1;
  }
  if (removedActiveGroup) {
    closeGroupItemMenu();
    elements.shortcutGroupDialog.close();
    activeGroupIndex = -1;
  }
}

function closeGroupItemMenu() {
  elements.groupItemSettingsMenu.hidden = true;
  activeGroupItemMenuButton?.setAttribute('aria-expanded', 'false');
  activeGroupItemMenuButton = null;
  activeGroupItemRef = null;
}

function openGroupItemMenu(itemIndex, anchor) {
  const group = state.shortcuts[activeGroupIndex];
  if (!group || group.type !== 'group' || !group.items[itemIndex]) return;
  if (!elements.groupItemSettingsMenu.hidden && activeGroupItemRef?.itemIndex === itemIndex) {
    closeGroupItemMenu();
    return;
  }
  activeGroupItemRef = { groupIndex: activeGroupIndex, itemIndex };
  activeGroupItemMenuButton?.setAttribute('aria-expanded', 'false');
  activeGroupItemMenuButton = anchor;
  anchor.setAttribute('aria-expanded', 'true');
  elements.groupItemSettingsMenu.hidden = false;
  const rect = anchor.getBoundingClientRect();
  const menuRect = elements.groupItemSettingsMenu.getBoundingClientRect();
  const left = Math.max(8, Math.min(rect.right - menuRect.width, window.innerWidth - menuRect.width - 8));
  const top = Math.min(rect.bottom + 6, window.innerHeight - menuRect.height - 8);
  elements.groupItemSettingsMenu.style.left = `${left}px`;
  elements.groupItemSettingsMenu.style.top = `${Math.max(8, top)}px`;
  requestAnimationFrame(() => elements.groupItemOpenAction.focus());
}

async function commitGroupItemChange() {
  closeGroupItemMenu();
  pruneEmptyShortcutGroups();
  await storageSet({ shortcuts: state.shortcuts });
  renderShortcuts();
  if (elements.shortcutGroupDialog.open) renderGroupDialog();
}

function createGroupDialogItem(item, itemIndex) {
  const tile = document.createElement('div');
  tile.className = 'group-dialog-item';
  tile.draggable = true;
  tile.dataset.itemIndex = String(itemIndex);
  tile.addEventListener('dragstart', (event) => {
    draggingGroupItem = { groupIndex: activeGroupIndex, itemIndex };
    tile.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', `group-item:${itemIndex}`);
  });
  tile.addEventListener('dragend', () => {
    tile.classList.remove('dragging');
    clearDropHighlights();
    draggingGroupItem = null;
  });
  const link = document.createElement('a');
  link.className = 'group-dialog-link';
  link.href = item.url;
  link.setAttribute('aria-label', `打开 ${item.name}`);
  link.append(createShortcutIcon(item));
  const title = document.createElement('span');
  title.className = 'shortcut-title';
  title.textContent = item.name;
  link.append(title);
  const menu = document.createElement('button');
  menu.type = 'button';
  menu.className = 'shortcut-menu group-item-menu';
  menu.setAttribute('aria-label', `设置 ${item.name}`);
  menu.setAttribute('aria-haspopup', 'menu');
  menu.setAttribute('aria-expanded', 'false');
  menu.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
  menu.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openGroupItemMenu(itemIndex, menu);
  });
  tile.append(link, menu);
  return tile;
}

function renderGroupDialog() {
  const group = state.shortcuts[activeGroupIndex];
  if (!group || group.type !== 'group') return;
  elements.shortcutGroupTitle.textContent = group.name;
  elements.shortcutGroupList.replaceChildren();
  if (group.items.length) {
    group.items.forEach((item, index) => elements.shortcutGroupList.append(createGroupDialogItem(item, index)));
  } else {
    const empty = document.createElement('p');
    empty.className = 'group-empty-state';
    empty.textContent = '这个文件夹是空的';
    elements.shortcutGroupList.append(empty);
  }
  elements.groupAddShortcut.disabled = false;
  elements.groupAddShortcut.textContent = '添加到此文件夹';
}

function openShortcutGroup(index) {
  const group = state.shortcuts[index];
  if (!group || group.type !== 'group') return;
  activeGroupIndex = index;
  renderGroupDialog();
  // 非模态打开：背后的主页网格保持可交互，分组里的图标才能拖出去
  elements.shortcutGroupDialog.show();
}

function createShortcutGroup(group, index) {
  const tile = document.createElement('div');
  tile.className = 'shortcut shortcut-tile shortcut-group-tile';
  tile.draggable = true;
  tile.dataset.index = String(index);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'shortcut-link shortcut-group-button';
  button.setAttribute('aria-label', `打开文件夹 ${group.name}`);
  button.append(createGroupPreview(group));
  const title = document.createElement('span');
  title.className = 'shortcut-title';
  title.textContent = group.name;
  button.append(title);
  button.addEventListener('click', () => openShortcutGroup(index));
  tile.append(button, createMenuButton(index, group));
  enableShortcutSelection(tile, index);
  return tile;
}

function createShortcut(shortcut, index) {
  return shortcut.type === 'group' ? createShortcutGroup(shortcut, index) : createLinkShortcut(shortcut, index);
}

function createAddShortcut() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'shortcut';
  button.setAttribute('aria-label', '添加快捷方式');
  button.innerHTML = `
    <span class="shortcut-icon shortcut-add-icon"><svg class="add-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z"/></svg></span>
    <span class="shortcut-title">添加快捷方式</span>`;
  button.addEventListener('click', () => openShortcutDialog());
  return button;
}

let shortcutsPage = 0;

function getShortcutPageSize() {
  const gridWidth = elements.shortcuts.clientWidth || Math.max(288, window.innerWidth - 32);
  const cardWidth = window.innerWidth <= 620 ? SHORTCUT_COMPACT_WIDTH : SHORTCUT_DESKTOP_WIDTH;
  const columns = Math.max(3, Math.floor((gridWidth + SHORTCUT_GAP) / (cardWidth + SHORTCUT_GAP)));
  const responsiveRows = window.innerHeight >= 820 ? 3 : window.innerHeight >= 640 ? 2 : 1;
  const configuredRows = [0, 1, 2, 3].includes(Number(state.customization.shortcutRows)) ? Number(state.customization.shortcutRows) : 3;
  const rows = Math.min(responsiveRows, configuredRows);
  return Math.max(2, columns * rows - (shortcutSelectionMode ? 0 : 1));
}

function getShortcutPageCount() {
  return Math.max(1, Math.ceil(state.shortcuts.length / getShortcutPageSize()));
}

function renderShortcutPagination() {
  const totalPages = getShortcutPageCount();
  const nav = elements.shortcutPagination;
  if (totalPages <= 1) {
    nav.hidden = true;
    nav.replaceChildren();
    return;
  }
  nav.hidden = false;
  nav.replaceChildren();

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.className = 'shortcut-page-arrow';
  previous.setAttribute('aria-label', '上一页');
  previous.title = '上一页';
  previous.disabled = shortcutsPage === 0;
  previous.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15.4 5.4-1.4-1.4-8 8 8 8 1.4-1.4L8.8 12l6.6-6.6Z"/></svg>';
  previous.addEventListener('click', () => turnShortcutsPage(-1));

  const dots = document.createElement('span');
  dots.className = 'shortcut-page-dots';

  for (let page = 0; page < totalPages; page += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'shortcut-page-dot';
    dot.setAttribute('aria-label', `跳转到第 ${page + 1} 页，共 ${totalPages} 页`);
    dot.setAttribute('aria-current', page === shortcutsPage ? 'page' : 'false');
    dot.title = `第 ${page + 1} 页`;
    dot.addEventListener('click', () => setShortcutsPage(page));
    dots.append(dot);
  }

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'shortcut-page-arrow';
  next.setAttribute('aria-label', '下一页');
  next.title = '下一页';
  next.disabled = shortcutsPage >= totalPages - 1;
  next.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.6 18.6 1.4 1.4 8-8-8-8-1.4 1.4 6.6 6.6-6.6 6.6Z"/></svg>';
  next.addEventListener('click', () => turnShortcutsPage(1));

  nav.append(previous, dots, next);
}

function setShortcutsPage(page) {
  shortcutsPage = Math.max(0, Math.min(page, getShortcutPageCount() - 1));
  renderShortcuts();
}

function renderShortcuts() {
  closeShortcutSettingsMenu();
  const shortcutsHidden = Number(state.customization.shortcutRows) === 0;
  elements.shortcuts.hidden = shortcutsHidden;
  elements.manageShortcutsButton.hidden = shortcutsHidden;
  if (shortcutsHidden) {
    elements.shortcuts.replaceChildren();
    elements.shortcutPagination.hidden = true;
    elements.shortcutPagination.replaceChildren();
    if (shortcutSelectionMode) setShortcutSelectionMode(false);
    return;
  }
  const pageSize = getShortcutPageSize();
  renderedShortcutPageSize = pageSize;
  shortcutsPage = Math.max(0, Math.min(shortcutsPage, getShortcutPageCount() - 1));
  elements.shortcuts.replaceChildren();
  const start = shortcutsPage * pageSize;
  state.shortcuts.slice(start, start + pageSize).forEach((shortcut, offset) => {
    elements.shortcuts.append(createShortcut(shortcut, start + offset));
  });
  if (!shortcutSelectionMode) elements.shortcuts.append(createAddShortcut());
  renderShortcutPagination();
  updateShortcutSelectionUi();
}

function turnShortcutsPage(direction) {
  if (![-1, 1].includes(direction) || getShortcutPageCount() <= 1) return;
  setShortcutsPage(shortcutsPage + direction);
}

let cachedBookmarks = null;

function flattenBookmarks(nodes, parentPath = []) {
  const bookmarks = [];
  nodes.forEach((node) => {
    if (node.url && /^https?:\/\//i.test(node.url)) {
      bookmarks.push({
        name: node.title || new URL(node.url).hostname,
        url: node.url,
        path: parentPath.join(' / ')
      });
      return;
    }

    if (node.children) {
      const nextPath = node.title ? [...parentPath, node.title] : parentPath;
      bookmarks.push(...flattenBookmarks(node.children, nextPath));
    }
  });
  return bookmarks;
}

function createBookmarkIcon(bookmark) {
  const icon = document.createElement('span');
  icon.className = 'bookmark-option-icon';
  icon.textContent = bookmark.name.trim().charAt(0).toUpperCase() || '?';
  attachResolvedFavicon(icon, bookmark.url);
  return icon;
}

function selectBookmark(bookmark) {
  elements.shortcutName.value = bookmark.name.slice(0, 32);
  elements.shortcutUrl.value = bookmark.url;
  setAddShortcutTab('custom');
  elements.shortcutName.focus();
}

function renderBookmarkOptions(query = '') {
  const list = document.querySelector('#bookmark-list');
  const status = document.querySelector('#bookmark-status');
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = (cachedBookmarks || []).filter((bookmark) => {
    const searchable = `${bookmark.name} ${bookmark.url} ${bookmark.path}`.toLocaleLowerCase();
    return searchable.includes(normalizedQuery);
  });
  const visibleMatches = matches.slice(0, 100);

  list.replaceChildren();
  visibleMatches.forEach((bookmark) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'bookmark-option';
    option.setAttribute('role', 'option');
    option.append(createBookmarkIcon(bookmark));

    const copy = document.createElement('span');
    copy.className = 'bookmark-option-copy';
    const title = document.createElement('span');
    title.className = 'bookmark-option-title';
    title.textContent = bookmark.name;
    const path = document.createElement('span');
    path.className = 'bookmark-option-path';
    path.textContent = bookmark.path || new URL(bookmark.url).hostname;
    copy.append(title, path);
    option.append(copy);
    option.addEventListener('click', () => selectBookmark(bookmark));
    list.append(option);
  });

  if (!matches.length) {
    status.textContent = normalizedQuery ? '没有找到匹配的收藏夹' : '收藏夹中没有可添加的网站';
  } else if (matches.length > visibleMatches.length) {
    status.textContent = `找到 ${matches.length} 个网站，显示前 ${visibleMatches.length} 个`;
  } else {
    status.textContent = `找到 ${matches.length} 个网站`;
  }
}

async function loadBookmarks() {
  const status = document.querySelector('#bookmark-status');
  if (!hasExtensionApi('bookmarks')) {
    status.textContent = '请先在 edge://extensions/ 中加载并重新加载此扩展';
    return;
  }

  status.textContent = '正在读取 Edge 收藏夹…';
  try {
    if (!cachedBookmarks) {
      const tree = await chrome.bookmarks.getTree();
      cachedBookmarks = flattenBookmarks(tree);
    }
    renderBookmarkOptions(document.querySelector('#bookmark-search').value);
  } catch {
    status.textContent = '无法读取收藏夹，请在扩展管理页确认收藏夹权限';
  }
}

function setBookmarkPickerOpen(open) {
  const picker = document.querySelector('#bookmark-picker');
  const button = document.querySelector('#bookmark-picker-button');
  picker.hidden = !open;
  button.setAttribute('aria-selected', String(open));
  if (open) {
    elements.resourcePicker.hidden = true;
    elements.resourcePickerButton.setAttribute('aria-selected', 'false');
    loadBookmarks();
    requestAnimationFrame(() => document.querySelector('#bookmark-search').focus());
  }
}

let selectedResourceCategory = '全部';
const selectedResourceIds = new Set();
let resourceIconObserver;
let editingResourceId = '';

function getEffectiveResource(resource) {
  return { ...resource, url: state.resourceOverrides[resource.url] || resource.url };
}

function getShortcutUrlKeys() {
  const urls = new Set();
  state.shortcuts.forEach((item) => {
    if (item.type === 'group') item.items.forEach((child) => urls.add(new URL(child.url).href));
    else urls.add(new URL(item.url).href);
  });
  return urls;
}

function createLazyResourceIcon(resource) {
  const icon = document.createElement('span');
  icon.className = 'resource-card-icon';
  icon.textContent = resource.name.trim().charAt(0).toUpperCase() || '?';
  icon.dataset.pageUrl = resource.url;
  if (!('IntersectionObserver' in window)) {
    attachResolvedFavicon(icon, resource.url);
    return icon;
  }
  resourceIconObserver ??= new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      resourceIconObserver.unobserve(entry.target);
      attachResolvedFavicon(entry.target, entry.target.dataset.pageUrl);
    });
  }, { root: elements.resourceList, rootMargin: '100px' });
  resourceIconObserver.observe(icon);
  return icon;
}

function updateResourceSelectionUi() {
  const count = selectedResourceIds.size;
  elements.resourceSelectionCount.textContent = `已选择 ${count} 个`;
  elements.resourceAddSelected.textContent = count ? `添加已选（${count}）` : '添加已选';
  elements.resourceAddSelected.disabled = count === 0;
}

function populateResourceDestinations() {
  const previous = elements.resourceDestination.value || 'root';
  const options = [new Option('主页', 'root')];
  state.shortcuts.forEach((item, index) => {
    if (item.type === 'group') options.push(new Option(item.name, `group:${index}`));
  });
  elements.resourceDestination.replaceChildren(...options);
  elements.resourceDestination.value = options.some((option) => option.value === previous) ? previous : 'root';
}

function renderResourceCategories() {
  const preferredOrder = ['AI', '办公', '开发', '影音', '社区', '购物', '工具'];
  const available = new Set(SHORTCUT_LIBRARY.map((item) => item.category));
  const categories = ['全部', ...preferredOrder.filter((category) => available.has(category))];
  elements.resourceCategories.replaceChildren(...categories.map((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'resource-category';
    button.textContent = category;
    button.setAttribute('aria-pressed', String(category === selectedResourceCategory));
    button.addEventListener('click', () => {
      selectedResourceCategory = category;
      renderResourceCategories();
      renderResourceOptions(elements.resourceSearch.value);
    });
    return button;
  }));
}

function renderResourceOptions(query = '') {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = SHORTCUT_LIBRARY.map((resource) => ({ ...getEffectiveResource(resource), resourceId: resource.url })).filter((resource) => {
    const categoryMatches = selectedResourceCategory === '全部' || resource.category === selectedResourceCategory;
    const searchable = `${resource.name} ${resource.url} ${resource.category}`.toLocaleLowerCase();
    return categoryMatches && searchable.includes(normalizedQuery);
  }).sort((a, b) => a.name.localeCompare(b.name, 'zh-CN-u-co-pinyin', { sensitivity: 'base', numeric: true }));

  resourceIconObserver?.disconnect();
  resourceIconObserver = null;
  const existingUrls = getShortcutUrlKeys();
  elements.resourceList.replaceChildren(...matches.map((resource) => {
    const urlKey = new URL(resource.url).href;
    const resourceId = resource.resourceId;
    const alreadyAdded = existingUrls.has(urlKey);
    const selected = selectedResourceIds.has(resourceId);
    const card = document.createElement('div');
    card.className = `resource-card${selected ? ' selected' : ''}${alreadyAdded ? ' already-added' : ''}`;
    card.setAttribute('role', 'option');
    card.setAttribute('aria-selected', String(selected));

    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'resource-card-main';
    option.disabled = alreadyAdded;
    option.append(createLazyResourceIcon(resource));

    const title = document.createElement('span');
    title.className = 'resource-card-title';
    title.textContent = resource.name;
    const category = document.createElement('span');
    category.className = 'resource-card-category';
    category.textContent = alreadyAdded ? '已添加' : resource.category;
    const url = document.createElement('span');
    url.className = 'resource-card-url';
    url.textContent = resource.url;
    url.title = resource.url;
    const check = document.createElement('span');
    check.className = 'resource-card-check';
    check.textContent = selected ? '✓' : '';
    option.append(title, category, url, check);
    option.addEventListener('click', () => {
      if (selectedResourceIds.has(resourceId)) selectedResourceIds.delete(resourceId);
      else selectedResourceIds.add(resourceId);
      renderResourceOptions(elements.resourceSearch.value);
      updateResourceSelectionUi();
    });
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'resource-card-edit';
    edit.textContent = '编辑 URL';
    edit.setAttribute('aria-label', `编辑 ${resource.name} 的网址`);
    edit.addEventListener('click', () => openResourceUrlDialog(resourceId));
    card.append(option, edit);
    return card;
  }));
  elements.resourceStatus.textContent = matches.length ? `找到 ${matches.length} 个网站，可多选添加 · 按名称 A–Z` : '没有找到匹配的网站';
  updateResourceSelectionUi();
}

async function addSelectedLibraryResources() {
  const existingUrls = getShortcutUrlKeys();
  const additions = SHORTCUT_LIBRARY
    .filter((resource) => selectedResourceIds.has(resource.url))
    .map(getEffectiveResource)
    .filter((resource) => !existingUrls.has(new URL(resource.url).href))
    .map((resource) => ({ name: resource.name, url: resource.url }));
  if (!additions.length) return;

  const destination = elements.resourceDestination.value;
  if (destination === 'root') {
    state.shortcuts.push(...additions);
  } else {
    const groupIndex = Number(destination.replace('group:', ''));
    const group = state.shortcuts[groupIndex];
    if (!group || group.type !== 'group') return;
    group.items.push(...additions);
  }
  await storageSet({ shortcuts: state.shortcuts });
  selectedResourceIds.clear();
  renderShortcuts();
  populateResourceDestinations();
  renderResourceOptions(elements.resourceSearch.value);
  elements.resourceStatus.textContent = `已添加 ${additions.length} 个网站`;
}

function setResourcePickerOpen(open) {
  elements.resourcePicker.hidden = !open;
  elements.resourcePickerButton.setAttribute('aria-selected', String(open));
  if (!open) {
    resourceIconObserver?.disconnect();
    resourceIconObserver = null;
    return;
  }
  document.querySelector('#bookmark-picker').hidden = true;
  elements.resourcePickerButton.setAttribute('aria-selected', 'true');
  document.querySelector('#bookmark-picker-button').setAttribute('aria-selected', 'false');
  selectedResourceIds.clear();
  populateResourceDestinations();
  renderResourceCategories();
  renderResourceOptions(elements.resourceSearch.value);
  requestAnimationFrame(() => elements.resourceSearch.focus());
}

function setAddShortcutTab(tab) {
  const library = tab === 'library';
  elements.shortcutLibraryPanel.hidden = !library;
  elements.shortcutCustomPanel.hidden = library;
  elements.shortcutTabLibrary.setAttribute('aria-selected', String(library));
  elements.shortcutTabCustom.setAttribute('aria-selected', String(!library));
  elements.shortcutDialog.classList.toggle('resource-library-open', library);
  elements.shortcutDialog.classList.toggle('shortcut-custom-open', !library);
  if (library) setResourcePickerOpen(true);
  else resourceIconObserver?.disconnect();
}

function openResourceUrlDialog(resourceId) {
  const resource = SHORTCUT_LIBRARY.find((item) => item.url === resourceId);
  if (!resource) return;
  editingResourceId = resourceId;
  elements.resourceUrlName.textContent = resource.name;
  elements.resourceDefaultUrl.value = resourceId;
  elements.resourceUrlInput.value = state.resourceOverrides[resourceId] || resourceId;
  elements.resourceUrlError.textContent = '';
  elements.resourceUrlDialog.showModal();
  requestAnimationFrame(() => elements.resourceUrlInput.focus());
}

async function saveResourceUrlOverride(event) {
  event.preventDefault();
  const resource = SHORTCUT_LIBRARY.find((item) => item.url === editingResourceId);
  if (!resource) return;
  try {
    const url = normalizeUrl(elements.resourceUrlInput.value);
    state.resourceOverrides[editingResourceId] = url;
    selectedResourceIds.delete(editingResourceId);
    await storageSet({ resourceOverrides: state.resourceOverrides });
    elements.resourceUrlDialog.close();
    renderResourceOptions(elements.resourceSearch.value);
  } catch {
    elements.resourceUrlError.textContent = '请输入有效的 HTTP 或 HTTPS 网址';
  }
}

async function resetResourceUrlOverride() {
  if (!editingResourceId) return;
  delete state.resourceOverrides[editingResourceId];
  selectedResourceIds.delete(editingResourceId);
  await storageSet({ resourceOverrides: state.resourceOverrides });
  elements.resourceUrlDialog.close();
  renderResourceOptions(elements.resourceSearch.value);
}

let pendingNewGroupName = '';

function populateShortcutDestinations(selected = 'root') {
  const options = [new Option('主页', 'root')];
  state.shortcuts.forEach((item, index) => {
    if (item.type === 'group') options.push(new Option(item.name, `group:${index}`));
  });
  if (pendingNewGroupName) options.push(new Option(`${pendingNewGroupName}（新建）`, 'new-group'));
  elements.shortcutDestination.replaceChildren(...options);
  elements.shortcutDestination.value = options.some((option) => option.value === selected) ? selected : 'root';
}

function createGroupId() {
  return globalThis.crypto?.randomUUID?.() || `group-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function uniqueGroupName(base = '新建文件夹') {
  const names = new Set(state.shortcuts.filter((item) => item.type === 'group').map((item) => item.name.toLocaleLowerCase()));
  if (!names.has(base.toLocaleLowerCase())) return base;
  let counter = 2;
  while (names.has(`${base} ${counter}`.toLocaleLowerCase())) counter += 1;
  return `${base} ${counter}`;
}

let draggingShortcutIndex = -1;
let draggingGroupItem = null; // { groupIndex, itemIndex }：正在从分组弹窗里拖出的条目

function clearDropHighlights() {
  elements.shortcuts.querySelectorAll('.drop-hover, .drop-before, .drop-after').forEach((el) => {
    el.classList.remove('drop-hover', 'drop-before', 'drop-after');
  });
  elements.shortcuts.classList.remove('drop-append');
}

async function handleGroupItemDrop(targetIndex) {
  const ref = draggingGroupItem;
  draggingGroupItem = null;
  if (!ref) return;
  const sourceGroup = state.shortcuts[ref.groupIndex];
  if (!sourceGroup || sourceGroup.type !== 'group') return;
  const [item] = sourceGroup.items.splice(ref.itemIndex, 1);
  if (!item) return;

  if (targetIndex >= 0) {
    const target = state.shortcuts[targetIndex];
    if (target === sourceGroup) {
      // 拖回自己所在的文件夹：放回原位，等于取消
      sourceGroup.items.splice(Math.min(ref.itemIndex, sourceGroup.items.length), 0, item);
    } else if (target.type === 'group') {
      // 拖到另一个文件夹上：转移过去
      target.items.push(item);
    } else {
      // 拖到主页图标上：原地创建文件夹
      state.shortcuts.splice(targetIndex, 1, { type: 'group', id: createGroupId(), name: uniqueGroupName(), items: [target, item] });
    }
  } else {
    // 拖到主页空白区：直接移出，追加到末尾
    state.shortcuts.push(item);
  }

  pruneEmptyShortcutGroups();
  await storageSet({ shortcuts: state.shortcuts });
  renderShortcuts();
  if (elements.shortcutGroupDialog.open) renderGroupDialog();
}

function getDropTargetIndex(event) {
  const tile = event.target.closest('.shortcut-tile');
  if (!tile || tile.dataset.index === undefined) return -1;
  return Number(tile.dataset.index);
}

function canDropShortcut(sourceIndex, targetIndex) {
  if (sourceIndex < 0 || sourceIndex === targetIndex) return false;
  const source = state.shortcuts[sourceIndex];
  const target = state.shortcuts[targetIndex];
  if (!source || !target) return false;
  return Boolean(source && target);
}

function getShortcutDropMode(event, sourceIndex, targetIndex) {
  const source = state.shortcuts[sourceIndex];
  const tile = event.target.closest('.shortcut-tile');
  if (!source || !tile) return 'after';
  const rect = tile.getBoundingClientRect();
  const position = (event.clientX - rect.left) / Math.max(1, rect.width);
  if (source.type !== 'group' && position >= .3 && position <= .7) return 'group';
  return position < .5 ? 'before' : 'after';
}

async function handleShortcutDrop(sourceIndex, targetIndex, mode) {
  const source = state.shortcuts[sourceIndex];
  const target = state.shortcuts[targetIndex];
  if (!source || !target) return;

  if (mode === 'group' && source.type !== 'group' && target.type === 'group') {
    // 拖到文件夹上：收入该文件夹
    state.shortcuts.splice(sourceIndex, 1);
    target.items.push(source);
  } else if (mode === 'group' && source.type !== 'group' && target.type !== 'group') {
    // 图标拖到图标上：原地创建文件夹
    const folder = { type: 'group', id: createGroupId(), name: uniqueGroupName(), items: [target, source] };
    const insertIndex = Math.min(sourceIndex, targetIndex);
    state.shortcuts.splice(Math.max(sourceIndex, targetIndex), 1);
    state.shortcuts.splice(Math.min(sourceIndex, targetIndex), 1);
    state.shortcuts.splice(insertIndex, 0, folder);
  } else {
    // 拖到卡片左右边缘：调整主页顺序；文件夹也可参与排序，但不会发生嵌套。
    state.shortcuts.splice(sourceIndex, 1);
    let insertionIndex = state.shortcuts.indexOf(target);
    if (mode === 'after') insertionIndex += 1;
    state.shortcuts.splice(insertionIndex, 0, source);
  }

  await storageSet({ shortcuts: state.shortcuts });
  renderShortcuts();
}

elements.shortcuts.addEventListener('dragstart', (event) => {
  const tile = event.target.closest('.shortcut-tile');
  if (!tile || tile.dataset.index === undefined) return;
  draggingShortcutIndex = Number(tile.dataset.index);
  tile.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', tile.dataset.index);
});
elements.shortcuts.addEventListener('dragend', (event) => {
  event.target.closest('.shortcut-tile')?.classList.remove('dragging');
  clearDropHighlights();
  draggingShortcutIndex = -1;
});
elements.shortcuts.addEventListener('dragover', (event) => {
  if (draggingGroupItem) {
    const targetIndex = getDropTargetIndex(event);
    const sourceGroup = state.shortcuts[draggingGroupItem.groupIndex];
    if (targetIndex >= 0 && state.shortcuts[targetIndex] === sourceGroup) return; // 拖回原文件夹上 = 取消
    if (targetIndex < 0 && !event.target.closest('#shortcuts')) return; // 只在网格区域内响应（含空白区）
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    clearDropHighlights();
    const tile = event.target.closest('.shortcut-tile');
    if (tile) tile.classList.add('drop-hover');
    else elements.shortcuts.classList.add('drop-append');
    return;
  }
  const targetIndex = getDropTargetIndex(event);
  if (!canDropShortcut(draggingShortcutIndex, targetIndex)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  const tile = event.target.closest('.shortcut-tile');
  clearDropHighlights();
  const mode = getShortcutDropMode(event, draggingShortcutIndex, targetIndex);
  tile.classList.add(mode === 'group' ? 'drop-hover' : `drop-${mode}`);
});
elements.shortcuts.addEventListener('drop', (event) => {
  if (draggingGroupItem) {
    const targetIndex = getDropTargetIndex(event);
    const sourceGroup = state.shortcuts[draggingGroupItem.groupIndex];
    if (targetIndex >= 0 && state.shortcuts[targetIndex] === sourceGroup) {
      draggingGroupItem = null;
      clearDropHighlights();
      return;
    }
    if (targetIndex < 0 && !event.target.closest('#shortcuts')) return;
    event.preventDefault();
    clearDropHighlights();
    handleGroupItemDrop(targetIndex);
    return;
  }
  const targetIndex = getDropTargetIndex(event);
  if (!canDropShortcut(draggingShortcutIndex, targetIndex)) return;
  event.preventDefault();
  const sourceIndex = draggingShortcutIndex;
  const mode = getShortcutDropMode(event, sourceIndex, targetIndex);
  draggingShortcutIndex = -1;
  clearDropHighlights();
  handleShortcutDrop(sourceIndex, targetIndex, mode);
});

// 分组弹窗内部：拖到另一个条目上 = 调整顺序
elements.shortcutGroupList.addEventListener('dragover', (event) => {
  if (!draggingGroupItem) return;
  const target = event.target.closest('.group-dialog-item');
  if (!target) return;
  const to = Number(target.dataset.itemIndex);
  if (Number.isNaN(to) || to === draggingGroupItem.itemIndex) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  elements.shortcutGroupList.querySelectorAll('.drop-hover').forEach((el) => {
    if (el !== target) el.classList.remove('drop-hover');
  });
  target.classList.add('drop-hover');
});
elements.shortcutGroupList.addEventListener('drop', async (event) => {
  if (!draggingGroupItem) return;
  const target = event.target.closest('.group-dialog-item');
  if (!target) return;
  const from = draggingGroupItem.itemIndex;
  const to = Number(target.dataset.itemIndex);
  draggingGroupItem = null;
  event.preventDefault();
  elements.shortcutGroupList.querySelectorAll('.drop-hover').forEach((el) => el.classList.remove('drop-hover'));
  if (Number.isNaN(to) || from === to) return;
  const group = state.shortcuts[activeGroupIndex];
  if (!group || group.type !== 'group') return;
  const [moved] = group.items.splice(from, 1);
  if (!moved) return;
  group.items.splice(to, 0, moved);
  await storageSet({ shortcuts: state.shortcuts });
  renderShortcuts();
  renderGroupDialog();
});

// 分组弹窗改为非模态后，手动补上 Esc / 点击外部关闭
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && elements.shortcutGroupDialog.open) elements.shortcutGroupDialog.close();
});
document.addEventListener('pointerdown', (event) => {
  if (!elements.shortcutGroupDialog.open) return;
  if (event.target.closest('#shortcut-group-dialog, #group-item-settings-menu')) return; // 点击文件夹菜单时不关弹窗
  elements.shortcutGroupDialog.close();
});

async function createNewShortcutGroup() {
  const name = elements.newGroupName.value.trim();
  if (!name) {
    elements.shortcutError.textContent = '请输入文件夹名称';
    elements.newGroupName.focus();
    return;
  }
  if (state.shortcuts.some((item) => item.type === 'group' && item.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
    elements.shortcutError.textContent = '已经存在同名文件夹';
    return;
  }

  pendingNewGroupName = name;
  populateShortcutDestinations('new-group');
  elements.newGroupName.value = '';
  elements.newGroupPanel.hidden = true;
  elements.shortcutError.textContent = '';
}

function openShortcutDialog(destination = 'root', editIndex = -1) {
  const search = document.querySelector('#bookmark-search');
  const destinationLabel = elements.shortcutDestination.closest('label');
  const item = Number.isInteger(editIndex) ? state.shortcuts[editIndex] : null;
  editingShortcutIndex = item ? editIndex : -1;

  elements.shortcutForm.reset();
  pendingNewGroupName = '';
  elements.shortcutDialogTitle.textContent = '添加快捷方式';
  elements.shortcutError.textContent = '';
  elements.newGroupPanel.hidden = true;
  elements.newGroupName.value = '';
  elements.shortcutUrl.required = true;
  elements.shortcutUrlLabel.hidden = false;
  elements.shortcutIconSettings.hidden = false;
  elements.shortcutIconMode.value = item?.icon?.type || 'auto';
  elements.shortcutIconUrl.value = item?.icon?.type === 'url' ? item.icon.value : '';
  elements.shortcutIconFile.value = '';
  pendingIconFileData = item?.icon?.type === 'file' ? item.icon.value : '';
  destinationLabel.hidden = false;
  elements.shortcutLocationSection.hidden = false;
  elements.shortcutMainTabs.hidden = false;
  populateShortcutDestinations(destination);
  document.querySelector('#bookmark-list').replaceChildren();
  document.querySelector('#bookmark-status').textContent = '';
  elements.resourceSearch.value = '';
  selectedResourceCategory = '全部';
  selectedResourceIds.clear();

  if (item?.type === 'group') {
    elements.shortcutDialogTitle.textContent = '重命名文件夹';
    elements.shortcutName.value = item.name;
    elements.shortcutUrl.required = false;
    elements.shortcutUrlLabel.hidden = true;
    elements.shortcutIconSettings.hidden = true;
    destinationLabel.hidden = true;
    elements.shortcutLocationSection.hidden = true;
    elements.shortcutMainTabs.hidden = true;
    elements.shortcutLibraryPanel.hidden = true;
    elements.shortcutCustomPanel.hidden = false;
  } else if (item) {
    elements.shortcutDialogTitle.textContent = '编辑快捷方式';
    elements.shortcutName.value = item.name;
    elements.shortcutUrl.value = item.url;
  }

  updateShortcutIconFields();
  elements.shortcutTabLibrary.onclick = () => setAddShortcutTab('library');
  elements.shortcutTabCustom.onclick = () => setAddShortcutTab('custom');
  document.querySelector('#bookmark-picker-button').onclick = () => setBookmarkPickerOpen(true);
  elements.resourcePickerButton.onclick = () => setResourcePickerOpen(true);
  search.oninput = () => renderBookmarkOptions(search.value);
  elements.resourceSearch.oninput = () => renderResourceOptions(elements.resourceSearch.value);
  if (item) setAddShortcutTab('custom');
  else setAddShortcutTab('library');
  elements.shortcutDialog.showModal();
  if (item) requestAnimationFrame(() => elements.shortcutName.focus());
}

function applyCustomization() {
  const { theme, wallpaper } = state.customization;
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
  const image = wallpaper?.mode !== 'none' ? wallpaper.image : '';
  document.body.classList.toggle('has-wallpaper', Boolean(image));
  document.body.style.backgroundImage = image ? `url("${image}")` : '';
  elements.nextWallpaperButton.hidden = !(wallpaper?.mode === 'bing' && image);
}

async function fetchBingWallpaperUrls() {
  const endpoints = [
    'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=zh-CN',
    'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=zh-CN'
  ];
  let lastError;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`bing wallpaper request failed: ${response.status}`);
      const data = await response.json();
      const urls = (Array.isArray(data?.images) ? data.images : [])
        .map((image) => image?.url)
        .filter(Boolean)
        .map((path) => new URL(path, endpoint).href);
      if (urls.length) return urls;
      throw new Error('bing wallpaper list empty');
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('bing wallpaper request failed');
}

function pickRandomWallpaper(pool, currentUrl) {
  if (!pool.length) return currentUrl;
  if (pool.length === 1) return pool[0];
  let next = currentUrl;
  while (next === currentUrl) next = pool[Math.floor(Math.random() * pool.length)];
  return next;
}

function isWallpaperRotationDue(wallpaper) {
  const rotate = wallpaper.rotate || 'day';
  if (rotate === 'tab') return true;
  const interval = rotate === 'hour' ? 3600000 : 86400000;
  return !wallpaper.image || (Date.now() - (wallpaper.rotatedAt || 0)) >= interval;
}

async function refreshBingWallpaper({ force = false } = {}) {
  const wallpaper = state.customization.wallpaper;
  if (wallpaper?.mode !== 'bing') return false;
  const today = new Date().toISOString().slice(0, 10);
  let pool = Array.isArray(wallpaper.pool) ? wallpaper.pool.filter(Boolean) : [];
  let poolChanged = false;
  if (wallpaper.poolDate !== today || !pool.length) {
    try {
      pool = await fetchBingWallpaperUrls();
      poolChanged = true;
    } catch {
      // 网络失败时沿用已缓存的壁纸池
    }
  }
  if (!force && !isWallpaperRotationDue(wallpaper)) {
    if (poolChanged) {
      state.customization.wallpaper = { ...wallpaper, pool, poolDate: today };
      await storageSet({ customization: state.customization });
    }
    return Boolean(wallpaper.image);
  }
  const fallback = wallpaper.image ? [wallpaper.image] : [];
  const nextImage = pickRandomWallpaper(pool.length ? pool : fallback, wallpaper.image);
  if (!nextImage) return false;
  state.customization.wallpaper = {
    mode: 'bing',
    image: nextImage,
    rotate: wallpaper.rotate || 'day',
    pool: pool.length ? pool : fallback,
    poolDate: poolChanged ? today : wallpaper.poolDate,
    rotatedAt: Date.now()
  };
  await storageSet({ customization: state.customization });
  applyCustomization();
  return true;
}

function updateWallpaperFormVisibility() {
  const mode = elements.customizeForm.elements.namedItem('wallpaper')?.value;
  const isCustom = mode === 'custom';
  const isBing = mode === 'bing';
  elements.wallpaperFileLabel.hidden = !isCustom;
  elements.wallpaperHint.hidden = !isCustom;
  elements.wallpaperRotateLabel.hidden = !isBing;
}

function readWallpaperFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('read wallpaper file failed'));
    reader.readAsDataURL(file);
  });
}

function populateCustomizationForm() {
  const selectedTheme = elements.customizeForm.elements.namedItem('theme');
  selectedTheme.value = state.customization.theme === 'dark' ? 'dark' : 'light';
  const selectedEngine = elements.customizeForm.elements.namedItem('searchEngine');
  if (selectedEngine) selectedEngine.value = state.searchEngine;
  const selectedWallpaper = elements.customizeForm.elements.namedItem('wallpaper');
  if (selectedWallpaper) selectedWallpaper.value = state.customization.wallpaper?.mode || 'none';
  const selectedRows = elements.customizeForm.elements.namedItem('shortcutRows');
  if (selectedRows) selectedRows.value = String([0, 1, 2, 3].includes(Number(state.customization.shortcutRows)) ? Number(state.customization.shortcutRows) : 3);
  if (elements.wallpaperRotate) elements.wallpaperRotate.value = state.customization.wallpaper?.rotate || 'day';
  elements.wallpaperFile.value = '';
  updateWallpaperFormVisibility();
}

async function loadTopSites() {
  if (!hasExtensionApi('topSites')) return DEFAULT_SHORTCUTS;
  try {
    const sites = await chrome.topSites.get();
    const supportedSites = sites
      .filter((site) => /^https?:\/\//i.test(site.url))
      .slice(0, 8)
      .map((site) => ({ name: site.title || new URL(site.url).hostname, url: site.url }));
    return supportedSites.length ? supportedSites : DEFAULT_SHORTCUTS;
  } catch {
    return DEFAULT_SHORTCUTS;
  }
}

function normalizeShortcutIcon(icon) {
  if (!icon || !['file', 'url'].includes(icon.type) || typeof icon.value !== 'string') return undefined;
  if (icon.type === 'file' && icon.value.startsWith('data:image/') && icon.value.length <= 700000) return icon;
  if (icon.type === 'url') {
    try {
      const url = new URL(icon.value);
      if (url.protocol === 'https:') return { type: 'url', value: url.href };
    } catch {}
  }
  return undefined;
}

function normalizeShortcutEntry(item) {
  if (!item || typeof item.name !== 'string') return null;
  const name = item.name.trim().slice(0, 32);
  if (!name) return null;
  if (item.type === 'group') {
    const items = Array.isArray(item.items) ? item.items
      .filter((child) => typeof child?.name === 'string' && typeof child?.url === 'string')
      .map((child) => {
        const icon = normalizeShortcutIcon(child.icon);
        return { name: child.name.trim().slice(0, 32), url: child.url, ...(icon ? { icon } : {}) };
      })
      .filter((child) => child.name && /^https?:\/\//i.test(child.url))
      : [];
    if (!items.length) return null;
    return { type: 'group', id: item.id || createGroupId(), name, items };
  }
  if (typeof item.url !== 'string' || !/^https?:\/\//i.test(item.url)) return null;
  const icon = normalizeShortcutIcon(item.icon);
  return { name, url: item.url, ...(icon ? { icon } : {}) };
}

async function initialize() {
  const stored = await storageGet(['searchEngine', 'searchHistory', 'shortcuts', 'customization', 'iconSourceCache', 'resourceOverrides']);
  state.searchEngine = SEARCH_ENGINES[stored.searchEngine] ? stored.searchEngine : 'google';
  state.searchHistory = Array.isArray(stored.searchHistory) ? stored.searchHistory
    .filter((item) => typeof item?.query === 'string' && SEARCH_ENGINES[item.engine])
    .slice(0, 10) : [];
  hydrateResolvedIconCache(stored.iconSourceCache);
  state.resourceOverrides = stored.resourceOverrides && typeof stored.resourceOverrides === 'object' ? stored.resourceOverrides : {};
  const shortcutSource = Array.isArray(stored.shortcuts) ? stored.shortcuts : await loadTopSites();
  state.shortcuts = shortcutSource.map(normalizeShortcutEntry).filter(Boolean);
  if (Array.isArray(stored.shortcuts) && state.shortcuts.length !== stored.shortcuts.length) {
    await storageSet({ shortcuts: state.shortcuts });
  }
  state.customization = {
    ...state.customization,
    ...(stored.customization || {})
  };
  state.customization.shortcutRows = [0, 1, 2, 3].includes(Number(state.customization.shortcutRows)) ? Number(state.customization.shortcutRows) : 3;
  if (state.customization.theme === 'system') {
    // 旧版本兼容：跟随系统已移除，按系统当前主题固化
    state.customization.theme = globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  renderSearchEngine();
  applyCustomization();
  renderShortcuts();
  if (state.customization.wallpaper?.mode === 'bing') refreshBingWallpaper();
}

elements.searchEngineSwitch.addEventListener('click', switchSearchEngine);

elements.searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await navigateFromSearch(elements.searchInput.value);
});

elements.shortcutEditAction.addEventListener('click', editShortcutFromSettings);
elements.shortcutMovePrevAction.addEventListener('click', () => moveShortcutToAdjacentPage(-1));
elements.shortcutMoveNextAction.addEventListener('click', () => moveShortcutToAdjacentPage(1));
elements.shortcutDeleteAction.addEventListener('click', deleteShortcutFromSettings);
elements.shortcutIconMode.addEventListener('change', updateShortcutIconFields);
elements.resourceAddSelected.addEventListener('click', addSelectedLibraryResources);
elements.resourceUrlForm.addEventListener('submit', saveResourceUrlOverride);
elements.resourceUrlReset.addEventListener('click', resetResourceUrlOverride);
elements.manageShortcutsButton.addEventListener('click', () => setShortcutSelectionMode(true));
elements.cancelShortcutSelection.addEventListener('click', () => setShortcutSelectionMode(false));
elements.deleteSelectedShortcuts.addEventListener('click', deleteSelectedShortcuts);
elements.shortcutIconUrl.addEventListener('input', renderShortcutIconPreview);
elements.shortcutName.addEventListener('input', renderShortcutIconPreview);
elements.shortcutUrl.addEventListener('input', renderShortcutIconPreview);
elements.shortcutIconFile.addEventListener('change', async () => {
  try {
    pendingIconFileData = await readIconFile(elements.shortcutIconFile.files[0]);
    elements.shortcutError.textContent = '';
    renderShortcutIconPreview();
  } catch (error) {
    pendingIconFileData = '';
    elements.shortcutError.textContent = error.message;
  }
});
elements.shortcutSettingsMenu.addEventListener('keydown', (event) => {
  const actions = [...elements.shortcutSettingsMenu.querySelectorAll('[role="menuitem"]')].filter((action) => !action.hidden);
  if (event.key === 'Escape') {
    const anchor = activeShortcutMenuButton;
    closeShortcutSettingsMenu();
    anchor?.focus();
  } else if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    const currentIndex = actions.indexOf(document.activeElement);
    const nextIndex = (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + actions.length) % actions.length;
    actions[nextIndex].focus();
  }
});
let shortcutResizeTimer;
let renderedShortcutPageSize = 0;
window.addEventListener('resize', () => {
  closeShortcutSettingsMenu();
  clearTimeout(shortcutResizeTimer);
  shortcutResizeTimer = setTimeout(() => {
    const nextPageSize = getShortcutPageSize();
    if (nextPageSize !== renderedShortcutPageSize) renderShortcuts();
  }, 120);
});
window.addEventListener('scroll', closeShortcutSettingsMenu, true);

elements.showNewGroup.addEventListener('click', () => {
  elements.newGroupPanel.hidden = !elements.newGroupPanel.hidden;
  if (!elements.newGroupPanel.hidden) requestAnimationFrame(() => elements.newGroupName.focus());
});
elements.createGroupButton.addEventListener('click', createNewShortcutGroup);
elements.newGroupName.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    createNewShortcutGroup();
  }
});
elements.groupAddShortcut.addEventListener('click', () => {
  if (activeGroupIndex < 0) return;
  elements.shortcutGroupDialog.close();
  openShortcutDialog(`group:${activeGroupIndex}`);
});

elements.shortcutForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const editingItem = editingShortcutIndex >= 0 ? state.shortcuts[editingShortcutIndex] : null;
    const name = elements.shortcutName.value.trim();
    if (!name) throw new Error('请输入名称');

    if (editingItem?.type === 'group') {
      if (state.shortcuts.some((item, index) => index !== editingShortcutIndex && item.type === 'group' && item.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
        throw new Error('已经存在同名文件夹');
      }
      editingItem.name = name.slice(0, 32);
      await storageSet({ shortcuts: state.shortcuts });
      renderShortcuts();
      elements.shortcutDialog.close();
      editingShortcutIndex = -1;
      return;
    }

    const destination = elements.shortcutDestination.value;
    const icon = getIconConfigFromForm();
    const shortcut = { name, url: normalizeUrl(elements.shortcutUrl.value), ...(icon ? { icon } : {}) };
    const isEditingLink = Boolean(editingItem && editingItem.type !== 'group');
    let destinationGroupIndex = -1;

    if (destination === 'root') {
      if (isEditingLink) state.shortcuts[editingShortcutIndex] = shortcut;
      else state.shortcuts.push(shortcut);
    } else if (destination === 'new-group') {
      if (!pendingNewGroupName) throw new Error('请输入文件夹名称');
      const group = { type: 'group', id: createGroupId(), name: pendingNewGroupName, items: [shortcut] };
      state.shortcuts.push(group);
      if (isEditingLink) state.shortcuts.splice(editingShortcutIndex, 1);
      destinationGroupIndex = state.shortcuts.indexOf(group);
    } else {
      const requestedGroupIndex = Number(destination.replace('group:', ''));
      const group = state.shortcuts[requestedGroupIndex];
      if (!group || group.type !== 'group') throw new Error('选择的文件夹不存在');
      group.items.push(shortcut);
      if (isEditingLink) state.shortcuts.splice(editingShortcutIndex, 1);
      destinationGroupIndex = state.shortcuts.indexOf(group);
    }

    await storageSet({ shortcuts: state.shortcuts });
    renderShortcuts();
    elements.shortcutDialog.close();
    editingShortcutIndex = -1;
    if (destinationGroupIndex >= 0) {
      activeGroupIndex = destinationGroupIndex;
      renderGroupDialog();
      elements.shortcutGroupDialog.show();
    }
  } catch (error) {
    elements.shortcutError.textContent = error.message;
  }
});

elements.nextWallpaperButton.addEventListener('click', async () => {
  if (elements.nextWallpaperButton.disabled) return;
  elements.nextWallpaperButton.disabled = true;
  elements.nextWallpaperButton.setAttribute('aria-busy', 'true');
  const label = elements.nextWallpaperButton.querySelector('span');
  if (label) label.textContent = '切换中…';
  try {
    if (!await refreshBingWallpaper({ force: true })) {
      alert('暂时无法切换必应壁纸，请检查网络后重试');
    }
  } finally {
    elements.nextWallpaperButton.disabled = false;
    elements.nextWallpaperButton.removeAttribute('aria-busy');
    if (label) label.textContent = '下一张';
  }
});

elements.customizeButton.addEventListener('click', () => {
  populateCustomizationForm();
  elements.customizeDialog.showModal();
});

elements.customizeForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const previousCustomization = state.customization;
  const wallpaperMode = elements.customizeForm.elements.namedItem('wallpaper')?.value || 'none';
  const wallpaperRotate = elements.wallpaperRotate?.value || 'day';
  let wallpaper = { mode: wallpaperMode, image: '', rotate: wallpaperRotate };
  if (wallpaperMode === 'custom') {
    if (elements.wallpaperFile.files[0]) {
      try {
        wallpaper.image = await readWallpaperFileAsDataUrl(elements.wallpaperFile.files[0]);
      } catch {
        wallpaper.image = '';
      }
      if (!wallpaper.image) {
        alert('壁纸图片读取失败，请换一张试试');
        return;
      }
    } else if (state.customization.wallpaper?.mode === 'custom') {
      wallpaper.image = state.customization.wallpaper.image; // 未换图时沿用旧图
    } else {
      alert('请先选择一张壁纸图片');
      return;
    }
  } else if (wallpaperMode === 'bing') {
    const previous = state.customization.wallpaper;
    if (previous?.mode === 'bing') wallpaper = { ...previous, mode: 'bing', rotate: wallpaperRotate };
  }
  state.customization = {
    theme: elements.customizeForm.elements.namedItem('theme').value,
    wallpaper,
    shortcutRows: [0, 1, 2, 3].includes(Number(elements.customizeForm.elements.namedItem('shortcutRows')?.value))
      ? Number(elements.customizeForm.elements.namedItem('shortcutRows').value)
      : 3
  };
  applyCustomization();
  renderShortcuts();
  await storageSet({ customization: state.customization });
  if (wallpaperMode === 'bing' && !await refreshBingWallpaper()) {
    state.customization = previousCustomization.wallpaper?.mode === 'bing' && !previousCustomization.wallpaper.image
      ? { ...previousCustomization, wallpaper: { mode: 'none', image: '' } }
      : previousCustomization;
    applyCustomization();
    await storageSet({ customization: state.customization });
    alert('暂时无法获取必应壁纸，请检查网络后重试');
    return;
  }
  const engineValue = elements.customizeForm.elements.namedItem('searchEngine')?.value;
  if (engineValue && engineValue !== state.searchEngine) await selectSearchEngine(engineValue);
  elements.customizeDialog.close();
});

elements.customizeForm.elements.namedItem('wallpaper')?.forEach?.((radio) => {
  radio.addEventListener('change', updateWallpaperFormVisibility);
});

elements.resetCustomization.addEventListener('click', async () => {
  state.customization = { theme: 'light', wallpaper: { mode: 'none', image: '' }, shortcutRows: 3 };
  applyCustomization();
  renderShortcuts();
  populateCustomizationForm();
  await storageSet({ customization: state.customization });
});

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => document.querySelector(`#${button.dataset.close}`).close());
});

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== elements.searchInput) {
    event.preventDefault();
    elements.searchInput.focus();
  }
});

initialize();
