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
  }
};

const SHORTCUT_COLUMNS = 7;
const SHORTCUT_ROWS = 3;
const SHORTCUT_PAGE_SIZE = SHORTCUT_COLUMNS * SHORTCUT_ROWS - 1; // 每页 21 格，含末尾的添加按钮

const DEFAULT_SHORTCUTS = [
  { name: 'Gmail', url: 'https://mail.google.com/' },
  { name: 'YouTube', url: 'https://www.youtube.com/' },
  { name: '地图', url: 'https://maps.google.com/' },
  { name: '云端硬盘', url: 'https://drive.google.com/' }
];

const state = {
  searchEngine: 'google',
  searchHistory: [],
  shortcuts: [],
  customization: {
    theme: 'light',
    wallpaper: { mode: 'none', image: '' }
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
  shortcutDeleteAction: document.querySelector('#shortcut-delete-action'),
  groupItemSettingsMenu: document.querySelector('#group-item-settings-menu'),
  groupItemOpenAction: document.querySelector('#group-item-open-action'),
  groupItemMoveoutAction: document.querySelector('#group-item-moveout-action'),
  groupItemDeleteAction: document.querySelector('#group-item-delete-action'),
  shortcutDialog: document.querySelector('#shortcut-dialog'),
  shortcutDialogTitle: document.querySelector('#shortcut-dialog-title'),
  shortcutForm: document.querySelector('#shortcut-form'),
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
  shortcutDestination: document.querySelector('#shortcut-destination'),
  showNewGroup: document.querySelector('#show-new-group'),
  newGroupPanel: document.querySelector('#new-group-panel'),
  newGroupName: document.querySelector('#new-group-name'),
  createGroupButton: document.querySelector('#create-group-button'),
  shortcutGroupDialog: document.querySelector('#shortcut-group-dialog'),
  shortcutGroupTitle: document.querySelector('#shortcut-group-title'),
  shortcutGroupList: document.querySelector('#shortcut-group-list'),
  groupAddShortcut: document.querySelector('#group-add-shortcut'),
  shortcutError: document.querySelector('#shortcut-error'),
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
    window.location.assign(`https://www.google.com/search?udm=50${query ? `&q=${encodeURIComponent(query)}` : ''}`);
  } else if (action === 'copilot') {
    window.location.assign(`https://www.bing.com/copilotsearch${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }
}

function renderSearchEngine() {
  const engine = SEARCH_ENGINES[state.searchEngine];
  elements.searchEngineSwitch.innerHTML = engine.logo;
  elements.searchEngineSwitch.setAttribute('aria-label', `当前使用${engine.name}搜索，点击展开搜索引擎`);
  elements.searchInput.setAttribute('aria-label', `使用${engine.name}搜索或输入网址`);
  elements.searchInput.placeholder = `使用${engine.name}搜索或输入网址`;
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
  const history = state.searchHistory
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
  if (!shouldRequestSuggestions(query)) {
    renderSearchSuggestions([], '继续输入以获取联想');
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
  if (looksLikeUrl(value)) {
    window.location.assign(normalizeUrl(value));
    return;
  }

  await addSearchHistory(value);
  const engine = SEARCH_ENGINES[state.searchEngine];
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

const ICON_SOURCE_TIMEOUT = 5000;
const resolvedIconCache = new Map();

function probeIconSource(url, minSize) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timer = setTimeout(() => {
      image.src = '';
      reject(new Error('timeout'));
    }, ICON_SOURCE_TIMEOUT);
    image.onload = () => {
      clearTimeout(timer);
      if (image.naturalWidth >= minSize) resolve(url);
      else reject(new Error('low-resolution'));
    };
    image.onerror = () => {
      clearTimeout(timer);
      reject(new Error('failed'));
    };
    image.referrerPolicy = 'no-referrer';
    image.decoding = 'async';
    image.src = url;
  });
}

function getIconSourceCandidates(pageUrl) {
  const host = getShortcutHost(pageUrl);
  const candidates = [];
  if (host) {
    candidates.push(
      { url: `https://logo.clearbit.com/${encodeURIComponent(host)}?size=128`, minSize: 64 },
      { url: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`, minSize: 64 },
      { url: `https://icon.horse/icon/${encodeURIComponent(host)}`, minSize: 16 },
      { url: `https://icons.duckduckgo.com/ip3/${encodeURIComponent(host)}.ico`, minSize: 16 }
    );
  }
  const local = getFaviconUrl(pageUrl, 64);
  if (local) candidates.push({ url: local, minSize: 32 });
  return candidates;
}

async function resolveIconUrl(pageUrl) {
  const host = getShortcutHost(pageUrl);
  if (host && resolvedIconCache.has(host)) return resolvedIconCache.get(host);
  for (const candidate of getIconSourceCandidates(pageUrl)) {
    try {
      const resolved = await probeIconSource(candidate.url, candidate.minSize);
      if (host) resolvedIconCache.set(host, resolved);
      return resolved;
    } catch {}
  }
  if (host) resolvedIconCache.set(host, '');
  return '';
}

function getShortcutIconSource(shortcut) {
  if (shortcut.icon?.value && ['file', 'url'].includes(shortcut.icon.type)) {
    return { url: shortcut.icon.value, type: shortcut.icon.type };
  }
  return { type: 'favicon' };
}

function attachIconImage(icon, url) {
  const image = document.createElement('img');
  image.src = url;
  image.alt = '';
  image.decoding = 'async';
  image.addEventListener('load', () => icon.replaceChildren(image), { once: true });
}

function createShortcutIcon(shortcut, className = 'shortcut-icon') {
  const icon = document.createElement('span');
  icon.className = className;
  icon.textContent = shortcut.name.trim().charAt(0).toUpperCase() || '?';

  const source = getShortcutIconSource(shortcut);
  if (source.url) {
    attachIconImage(icon, source.url);
    return icon;
  }
  if (source.type === 'favicon') {
    resolveIconUrl(shortcut.url).then((resolved) => {
      if (resolved) attachIconImage(icon, resolved);
    });
  }
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
  if (source.type === 'favicon') {
    resolveIconUrl(shortcut.url).then((resolved) => {
      if (resolved) attachIconImage(preview, resolved);
    });
  }
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

function getShortcutPageCount() {
  return Math.max(1, Math.ceil(state.shortcuts.length / SHORTCUT_PAGE_SIZE));
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

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'shortcut-page-button';
  prev.textContent = '‹';
  prev.setAttribute('aria-label', '上一页');
  prev.disabled = shortcutsPage === 0;
  prev.addEventListener('click', () => setShortcutsPage(shortcutsPage - 1));

  const label = document.createElement('span');
  label.className = 'shortcut-page-label';
  label.textContent = `${shortcutsPage + 1} / ${totalPages}`;

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'shortcut-page-button';
  next.textContent = '›';
  next.setAttribute('aria-label', '下一页');
  next.disabled = shortcutsPage >= totalPages - 1;
  next.addEventListener('click', () => setShortcutsPage(shortcutsPage + 1));

  nav.append(prev, label, next);
}

function setShortcutsPage(page) {
  shortcutsPage = Math.max(0, Math.min(page, getShortcutPageCount() - 1));
  renderShortcuts();
}

function renderShortcuts() {
  closeShortcutSettingsMenu();
  shortcutsPage = Math.max(0, Math.min(shortcutsPage, getShortcutPageCount() - 1));
  elements.shortcuts.replaceChildren();
  const start = shortcutsPage * SHORTCUT_PAGE_SIZE;
  state.shortcuts.slice(start, start + SHORTCUT_PAGE_SIZE).forEach((shortcut, offset) => {
    elements.shortcuts.append(createShortcut(shortcut, start + offset));
  });
  elements.shortcuts.append(createAddShortcut());
  renderShortcutPagination();
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

  const faviconUrl = getFaviconUrl(bookmark.url);
  if (faviconUrl) {
    const image = document.createElement('img');
    image.src = faviconUrl;
    image.alt = '';
    image.addEventListener('load', () => {
      icon.textContent = '';
      icon.append(image);
    }, { once: true });
  }
  return icon;
}

function selectBookmark(bookmark) {
  elements.shortcutName.value = bookmark.name.slice(0, 32);
  elements.shortcutUrl.value = bookmark.url;
  setBookmarkPickerOpen(false);
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
  button.setAttribute('aria-expanded', String(open));
  if (open) {
    loadBookmarks();
    requestAnimationFrame(() => document.querySelector('#bookmark-search').focus());
  }
}

function populateShortcutDestinations(selected = 'root') {
  const options = [new Option('主页', 'root')];
  state.shortcuts.forEach((item, index) => {
    if (item.type === 'group') options.push(new Option(item.name, `group:${index}`));
  });
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
  elements.shortcuts.querySelectorAll('.drop-hover').forEach((el) => el.classList.remove('drop-hover'));
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
  return source.type !== 'group'; // 文件夹本身不参与拖拽合并，避免嵌套
}

async function handleShortcutDrop(sourceIndex, targetIndex) {
  const source = state.shortcuts[sourceIndex];
  const target = state.shortcuts[targetIndex];
  if (!source || !target) return;

  if (target.type === 'group') {
    // 拖到文件夹上：收入该文件夹
    state.shortcuts.splice(sourceIndex, 1);
    target.items.push(source);
  } else {
    // 图标拖到图标上：原地创建文件夹
    const folder = { type: 'group', id: createGroupId(), name: uniqueGroupName(), items: [target, source] };
    const insertIndex = Math.min(sourceIndex, targetIndex);
    state.shortcuts.splice(Math.max(sourceIndex, targetIndex), 1);
    state.shortcuts.splice(Math.min(sourceIndex, targetIndex), 1);
    state.shortcuts.splice(insertIndex, 0, folder);
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
  elements.shortcuts.querySelectorAll('.drop-hover').forEach((el) => el.classList.remove('drop-hover'));
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
  elements.shortcuts.querySelectorAll('.drop-hover').forEach((el) => {
    if (el !== tile) el.classList.remove('drop-hover');
  });
  tile.classList.add('drop-hover');
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
  draggingShortcutIndex = -1;
  handleShortcutDrop(sourceIndex, targetIndex);
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

  const group = { type: 'group', id: createGroupId(), name, items: [] };
  state.shortcuts.push(group);
  await storageSet({ shortcuts: state.shortcuts });
  renderShortcuts();
  const groupIndex = state.shortcuts.length - 1;
  populateShortcutDestinations(`group:${groupIndex}`);
  elements.newGroupName.value = '';
  elements.newGroupPanel.hidden = true;
  elements.shortcutError.textContent = '';
}

function openShortcutDialog(destination = 'root', editIndex = -1) {
  const search = document.querySelector('#bookmark-search');
  const bookmarkButton = document.querySelector('#bookmark-picker-button');
  const destinationLabel = elements.shortcutDestination.closest('label');
  const item = Number.isInteger(editIndex) ? state.shortcuts[editIndex] : null;
  editingShortcutIndex = item ? editIndex : -1;

  elements.shortcutForm.reset();
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
  bookmarkButton.hidden = false;
  populateShortcutDestinations(destination);
  document.querySelector('#bookmark-list').replaceChildren();
  document.querySelector('#bookmark-status').textContent = '';
  setBookmarkPickerOpen(false);

  if (item?.type === 'group') {
    elements.shortcutDialogTitle.textContent = '重命名文件夹';
    elements.shortcutName.value = item.name;
    elements.shortcutUrl.required = false;
    elements.shortcutUrlLabel.hidden = true;
    elements.shortcutIconSettings.hidden = true;
    destinationLabel.hidden = true;
    bookmarkButton.hidden = true;
  } else if (item) {
    elements.shortcutDialogTitle.textContent = '编辑快捷方式';
    elements.shortcutName.value = item.name;
    elements.shortcutUrl.value = item.url;
  }

  updateShortcutIconFields();
  bookmarkButton.onclick = () => setBookmarkPickerOpen(document.querySelector('#bookmark-picker').hidden);
  search.oninput = () => renderBookmarkOptions(search.value);
  elements.shortcutDialog.showModal();
  requestAnimationFrame(() => elements.shortcutName.focus());
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
    return { type: 'group', id: item.id || createGroupId(), name, items };
  }
  if (typeof item.url !== 'string' || !/^https?:\/\//i.test(item.url)) return null;
  const icon = normalizeShortcutIcon(item.icon);
  return { name, url: item.url, ...(icon ? { icon } : {}) };
}

async function initialize() {
  const stored = await storageGet(['searchEngine', 'searchHistory', 'shortcuts', 'customization']);
  state.searchEngine = SEARCH_ENGINES[stored.searchEngine] ? stored.searchEngine : 'google';
  state.searchHistory = Array.isArray(stored.searchHistory) ? stored.searchHistory
    .filter((item) => typeof item?.query === 'string' && SEARCH_ENGINES[item.engine])
    .slice(0, 10) : [];
  const shortcutSource = Array.isArray(stored.shortcuts) ? stored.shortcuts : await loadTopSites();
  state.shortcuts = shortcutSource.map(normalizeShortcutEntry).filter(Boolean);
  state.customization = {
    ...state.customization,
    ...(stored.customization || {})
  };
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
elements.shortcutDeleteAction.addEventListener('click', deleteShortcutFromSettings);
elements.shortcutIconMode.addEventListener('change', updateShortcutIconFields);
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
  const actions = [...elements.shortcutSettingsMenu.querySelectorAll('[role="menuitem"]')];
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
window.addEventListener('resize', closeShortcutSettingsMenu);
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
    wallpaper
  };
  applyCustomization();
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
  state.customization = { theme: 'light', wallpaper: { mode: 'none', image: '' } };
  applyCustomization();
  populateCustomizationForm();
  await storageSet({ customization: state.customization });
});

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => document.querySelector(`#${button.dataset.close}`).close());
});

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== elements.searchInput) {
    event.preventDefault();
    elements.searchInput.focus();
  }
});

initialize();
