const test = require('node:test');
const assert = require('node:assert/strict');

const core = require('../newtab-core.js');
const aiRelayCore = require('../ai-relay-core.js');
const platform = require('../newtab-platform.js');

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
