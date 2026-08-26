(function exposeLumoraCore(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LumoraCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  function normalizeUrl(value) {
    const trimmed = String(value || '').trim();
    if (!trimmed) throw new Error('请输入网址');
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)
      && !/^https?:\/\//i.test(trimmed)
      && !/^localhost(?::\d+)?(?:\/|$)/i.test(trimmed)) {
      throw new Error('仅支持 http 或 https 网址');
    }

    let candidate;
    if (/^https?:\/\//i.test(trimmed)) candidate = trimmed;
    else if (/^localhost(?::\d+)?(?:\/|$)/i.test(trimmed)) candidate = `http://${trimmed}`;
    else candidate = `https://${trimmed}`;

    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('仅支持 http 或 https 网址');
    return url.href;
  }

  function looksLikeUrl(value) {
    const query = String(value || '').trim();
    return /^(https?:\/\/|localhost(?::\d+)?(?:\/|$)|(?:[\w-]+\.)+[a-z]{2,}(?:[\/:?#]|$))/i.test(query);
  }

  function shouldRequestSuggestions(query) {
    const value = String(query || '');
    const characters = [...value];
    return /[\u3400-\u9fff]/.test(value) ? characters.length >= 1 : characters.length >= 2;
  }

  function normalizeEnginePetals(availableEngines, value, defaultEngine) {
    const available = [...availableEngines];
    const selected = Array.isArray(value)
      ? available.filter((engineId) => value.includes(engineId))
      : [...available];
    const fallback = available.includes(defaultEngine) ? defaultEngine : available[0];
    if (fallback && !selected.includes(fallback)) selected.push(fallback);
    return available.filter((engineId) => selected.includes(engineId));
  }

  function calculatePetalPositions(count, viewportWidth) {
    if (!Number.isInteger(count) || count < 1) return [];
    const width = Number.isFinite(viewportWidth) ? viewportWidth : 1024;
    const maxX = Math.max(100, Math.min(204, (width - 112) / 2));
    return Array.from({ length: count }, (_, index) => {
      const progress = count === 1 ? .5 : index / (count - 1);
      return {
        x: Math.round((progress * 2 - 1) * maxX),
        y: Math.round(-42 - Math.sin(progress * Math.PI) * Math.min(84, maxX * .42)),
        delay: index * 30
      };
    });
  }

  function selectBestIcon(results, preferStrongFirstParty = true) {
    const valid = Array.isArray(results) ? results.filter((result) => result && Number.isFinite(result.score)) : [];
    if (preferStrongFirstParty) {
      const strongFirstParty = valid
        .filter((result) => result.firstParty && (result.vector || Math.min(result.width || 0, result.height || 0) >= 96))
        .sort((a, b) => b.score - a.score)[0];
      if (strongFirstParty) return strongFirstParty;
    }
    return valid.sort((a, b) => b.score - a.score)[0] || null;
  }

  return {
    calculatePetalPositions,
    looksLikeUrl,
    normalizeEnginePetals,
    normalizeUrl,
    selectBestIcon,
    shouldRequestSuggestions
  };
});
