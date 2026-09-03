const test = require('node:test');
const assert = require('node:assert/strict');

const core = require('../newtab-core.js');
const aiRelayCore = require('../ai-relay-core.js');
const platform = require('../newtab-platform.js');
const icons = require('../icon-discovery.js');

test('normalizes URLs without accepting unsafe protocols', () => {
  assert.equal(core.normalizeUrl('example.com'), 'https://example.com/');
  assert.equal(core.normalizeUrl('localhost:8080/path'), 'http://localhost:8080/path');
  assert.throws(() => core.normalizeUrl('javascript:alert(1)'), /http 或 https/);
});

test('recognizes navigation-like input', () => {
  assert.equal(core.looksLikeUrl('example.com/docs'), true);
  assert.equal(core.looksLikeUrl('普通搜索文字'), false);
});

test('normalizes visible petals and always preserves the default', () => {
  const engines = ['google', 'bing', 'deepseek'];
  assert.deepEqual(core.normalizeEnginePetals(engines, ['bing'], 'google'), ['google', 'bing']);
  assert.deepEqual(core.normalizeEnginePetals(engines, ['unknown'], 'deepseek'), ['deepseek']);
  assert.deepEqual(core.normalizeEnginePetals(engines, undefined, 'google'), engines);
});

test('calculates responsive and symmetric petal positions', () => {
  const positions = core.calculatePetalPositions(3, 390);
  assert.equal(positions.length, 3);
  assert.equal(positions[0].x, -positions[2].x);
  assert.equal(positions[1].x, 0);
  assert.ok(positions.every(({ x }) => Math.abs(x) <= 139));
});

test('applies suggestion thresholds for Chinese and Latin text', () => {
  assert.equal(core.shouldRequestSuggestions('天'), true);
  assert.equal(core.shouldRequestSuggestions('a'), false);
  assert.equal(core.shouldRequestSuggestions('ai'), true);
});

test('keeps automatic icon priority separate from manual discovery', () => {
  const firstParty = { url: 'https://site.test/icon.png', firstParty: true, width: 128, height: 128, score: 208 };
  const thirdParty = { url: 'https://icons.test/site.png', width: 256, height: 256, score: 256 };
  assert.equal(core.selectBestIcon([thirdParty, firstParty], true), firstParty);
  assert.equal(core.selectBestIcon([thirdParty, firstParty], false), thirdParty);
  assert.equal(core.selectBestIcon([], true), null);
});

test('detects only supported AI provider hosts', () => {
  assert.equal(aiRelayCore.detectProvider('www.doubao.com'), 'doubao');
  assert.equal(aiRelayCore.detectProvider('chat.deepseek.com'), 'deepseek');
  assert.equal(aiRelayCore.detectProvider('notdoubao.com'), '');
});

test('matches known DeepSeek option labels', () => {
  assert.equal(aiRelayCore.matchesOption('deepThink', '开启深度思考'), true);
  assert.equal(aiRelayCore.matchesOption('webSearch', 'AI 搜索'), true);
  assert.equal(aiRelayCore.matchesOption('webSearch', '上传图片'), false);
});

test('requests an optional permission only when it is missing', async () => {
  const originalChrome = global.chrome;
  let requestCount = 0;
  global.chrome = {
    permissions: {
      contains: async () => false,
      request: async ({ permissions }) => {
        requestCount += 1;
        assert.deepEqual(permissions, ['bookmarks']);
        return true;
      }
    }
  };
  try {
    assert.equal(await platform.ensureOptionalPermission('bookmarks'), true);
    assert.equal(requestCount, 1);
    global.chrome.permissions.contains = async () => true;
    assert.equal(await platform.ensureOptionalPermission('bookmarks'), true);
    assert.equal(requestCount, 1);
  } finally {
    global.chrome = originalChrome;
  }
});

test('resolves declared icon URLs safely, including CDN and query-string SVGs', () => {
  const base = 'https://site.test/app/index.html';
  assert.equal(icons.resolveResourceUrl('../brand.svg?v=2', base), 'https://site.test/brand.svg?v=2');
  assert.equal(icons.resolveResourceUrl('//cdn.test/icon.png', base), 'https://cdn.test/icon.png');
  for (const value of ['', '#logo', 'javascript:alert(1)', 'data:image/svg+xml,test', 'http://site.test/a.png', 'https://user:secret@site.test/a']) {
    assert.equal(icons.resolveResourceUrl(value, base), '');
  }
});

test('extracts manifest icons relative to the manifest, filtering malformed and monochrome entries', () => {
  const candidates = icons.extractManifestIcons({ icons: [
    { src: '../brand.svg?v=1', sizes: 'any' },
    { src: '../brand.svg?v=1' },
    { src: './mask.png', purpose: 'maskable', type: 'image/png' },
    { src: './mono.svg', purpose: 'monochrome' },
    { src: 'javascript:alert(1)' }, null, {},
  ] }, 'https://site.test/assets/site.webmanifest');
  assert.equal(candidates.length, 2);
  assert.equal(candidates[0].url, 'https://site.test/brand.svg?v=1');
  assert.equal(candidates[0].vector, true);
  assert.equal(candidates[1].url, 'https://site.test/assets/mask.png');
  assert.deepEqual(icons.extractManifestIcons(null, 'https://site.test/'), []);
  assert.deepEqual(icons.extractManifestIcons({ icons: {} }, 'https://site.test/'), []);
  assert.equal(icons.extractManifestIcons({ icons: Array.from({ length: 100 }, (_, i) => ({ src: `/${i}.png` })) }, 'https://site.test/').length, 24);
});

test('manual site permission is requested immediately and scoped to the exact HTTPS host', async () => {
  const originalChrome = global.chrome;
  const requests = [];
  global.chrome = { permissions: { request: async (request) => { requests.push(request); return true; } } };
  try {
    const pending = platform.requestIconSiteAccess('https://sub.site.test:8443/private?q=secret');
    assert.deepEqual(requests, [{ origins: ['https://sub.site.test/*'] }]);
    assert.equal(await pending, true);
    assert.equal(await platform.requestIconSiteAccess('http://site.test/'), false);
    assert.equal(await platform.requestIconSiteAccess('https://user:secret@site.test/'), false);
    assert.equal(requests.length, 1);
    global.chrome.permissions.request = async () => false;
    assert.equal(await platform.requestIconSiteAccess('https://site.test/'), false);
    global.chrome.permissions.request = async () => { throw new Error('unavailable'); };
    assert.equal(await platform.requestIconSiteAccess('https://site.test/'), false);
  } finally {
    global.chrome = originalChrome;
  }
});

test('metadata requests omit credentials and referrers and track the final URL', async () => {
  const result = await icons.fetchDocument('https://site.test/', 'html', async (url, options) => {
    assert.equal(url, 'https://site.test/');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.referrerPolicy, 'no-referrer');
    assert.ok(options.signal instanceof AbortSignal);
    const response = new Response('<html>微光</html>', { headers: { 'Content-Type': 'Text/HTML; charset=utf-8' } });
    Object.defineProperty(response, 'url', { value: 'https://site.test/redirected/' });
    return response;
  });
  assert.equal(result.url, 'https://site.test/redirected/');
  assert.equal(result.text, '<html>微光</html>');
});

test('metadata requests reject errors, wrong types and oversized bodies', async () => {
  await assert.rejects(icons.fetchDocument('https://site.test/', 'html', async () => new Response('', { status: 404 })), /读取网站失败/);
  await assert.rejects(icons.fetchDocument('https://site.test/', 'html', async () => new Response('image', { headers: { 'content-type': 'image/png' } })), /类型/);
  await assert.rejects(icons.fetchDocument('https://site.test/', 'html', async () => new Response('', { headers: { 'content-type': 'text/html', 'content-length': '1048577' } })), /过大/);
  await assert.rejects(icons.fetchDocument('https://site.test/', 'html', async () => new Response('x'.repeat(1048577), { headers: { 'content-type': 'text/html' } })), /过大/);
  assert.deepEqual(await icons.discoverPageIcons('https://site.test/', async () => { throw new Error('CORS or denied'); }), []);
});

// Exercise the actual UI orchestration with deterministic network/image stubs.
const vm = require('node:vm');
const fs = require('node:fs');
const newtabSource = fs.readFileSync(require.resolve('../newtab.js'), 'utf8');
function loadIconFunction(start, end, bindings) {
  const context = vm.createContext(bindings);
  vm.runInContext(newtabSource.slice(newtabSource.indexOf(start), newtabSource.indexOf(end)), context);
  return context;
}

test('manual discovery prefers declared resources and preserves automatic and fallback behavior', async () => {
  let reads = 0;
  let declared = [{ url: 'https://site.test/declared.png', score: 100 }];
  const local = { url: 'chrome-extension://id/_favicon/', local: true, score: 900 };
  const remote = { url: 'https://icons.test/site.png', score: 80 };
  const context = loadIconFunction('async function discoverBestIconResult(', 'function resolveIconUrl(', {
    discoverPageIcons: async () => { reads += 1; return declared; },
    probeIconSource: async (candidate) => candidate,
    getIconSourceCandidates: () => [local, remote],
    selectBestIcon: core.selectBestIcon
  });
  assert.equal((await context.discoverBestIconResult('https://site.test/', true, false, true)).url, declared[0].url);
  assert.equal(reads, 1);
  assert.equal(await context.discoverBestIconResult('https://site.test/', false, true), local);
  assert.equal(reads, 1, 'automatic resolution must not scan pages');
  assert.equal(await context.discoverBestIconResult('https://site.test/', true, false, false), remote);
  declared = [];
  assert.equal(await context.discoverBestIconResult('https://site.test/', true, false, true), remote);
});

test('manual fetch ignores stale results after changing URLs or closing the dialog', async () => {
  const elements = {
    shortcutDialog: { open: true }, shortcutUrl: { value: 'https://site.test/' },
    shortcutFetchIcon: { textContent: '手动获取', disabled: false },
    shortcutError: { textContent: '' }, shortcutIconStatus: { dataset: {}, textContent: '' }
  };
  let finish;
  const context = loadIconFunction('async function fetchShortcutIcon()', 'function readIconFile(', {
    elements, manualIconRequestToken: 0, pendingManualIconUrl: '', selectedIconCandidate: 'auto',
    normalizeUrl: core.normalizeUrl, requestIconSiteAccess: async () => true,
    discoverBestIconResult: () => new Promise((resolve) => { finish = resolve; }),
    renderShortcutIconCandidates: () => {}, renderShortcutIconPreview: () => {},
    getShortcutHost: () => 'site.test'
  });
  const old = context.fetchShortcutIcon();
  await new Promise(setImmediate);
  context.resetManualIconRequest();
  finish({ url: 'https://site.test/old.png' });
  await old;
  assert.equal(context.pendingManualIconUrl, '');
  assert.equal(context.selectedIconCandidate, 'auto');
  assert.equal(elements.shortcutFetchIcon.disabled, false);

  const closed = context.fetchShortcutIcon();
  await new Promise(setImmediate);
  elements.shortcutDialog.open = false;
  finish({ url: 'https://site.test/closed.png' });
  await closed;
  assert.equal(context.pendingManualIconUrl, '');

  elements.shortcutDialog.open = true;
  const current = context.fetchShortcutIcon();
  await new Promise(setImmediate);
  finish({ url: 'https://site.test/current.png', source: '网页图标' });
  await current;
  assert.equal(context.pendingManualIconUrl, 'https://site.test/current.png');
  assert.equal(context.selectedIconCandidate, 'manual');
  assert.equal(elements.shortcutIconStatus.dataset.state, 'success');
});
