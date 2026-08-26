(function exposeAiRelayCore(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LumoraAiRelayCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const OPTION_ALIASES = {
    deepThink: /深度思考|深度推理|思考模式|deep[\s_-]*think|deepthink|reasoning|\br1\b/i,
    webSearch: /联网搜索|智能搜索|网络搜索|搜索网页|网页搜索|AI\s*搜索|智能联网|边想边搜|开启搜索|web[\s_-]*search|internet/i
  };

  function detectProvider(hostname) {
    const host = String(hostname || '').toLocaleLowerCase();
    if (host === 'doubao.com' || host.endsWith('.doubao.com')) return 'doubao';
    if (host === 'deepseek.com' || host.endsWith('.deepseek.com')) return 'deepseek';
    return '';
  }

  function matchesOption(option, identity) {
    return Boolean(OPTION_ALIASES[option]?.test(String(identity || '')));
  }

  return { OPTION_ALIASES, detectProvider, matchesOption };
});
