(function exposeIconDiscovery(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LumoraIconDiscovery = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const MAX_CANDIDATES = 24;
  const MAX_DOCUMENT_BYTES = 1024 * 1024;
  const REQUEST_TIMEOUT = 4500;

  function resolveResourceUrl(value, baseUrl) {
    if (typeof value !== 'string' || !value.trim() || value.trim().startsWith('#')) return '';
    try {
      const url = new URL(value.trim(), baseUrl);
      // Match the HTTPS-only custom icon policy; never persist credentials.
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
    } catch {
      return '';
    }
  }

  function createCandidate(value, baseUrl, source, priority, type = '') {
    const url = resolveResourceUrl(value, baseUrl);
    if (!url) return null;
    return {
      url, source, priority, minSize: 16, firstParty: true,
      vector: type.toLowerCase() === 'image/svg+xml' || /\.svg$/i.test(new URL(url).pathname)
    };
  }

  function uniqueCandidates(candidates) {
    const seen = new Set();
    return candidates.filter((candidate) => {
      if (!candidate || seen.has(candidate.url)) return false;
      seen.add(candidate.url);
      return true;
    }).slice(0, MAX_CANDIDATES);
  }

  function extractPageIcons(html, pageUrl) {
    // Template contents stay detached: do not execute scripts or load embedded resources.
    const template = document.createElement('template');
    template.innerHTML = html;
    const content = template.content;
    const baseUrl = resolveResourceUrl(content.querySelector('base[href]')?.getAttribute('href'), pageUrl) || pageUrl;
    const candidates = [];
    const manifests = [];
    for (const link of content.querySelectorAll('link[href]')) {
      const rel = (link.getAttribute('rel') || '').toLowerCase().split(/\s+/);
      if (rel.some((token) => ['icon', 'apple-touch-icon', 'apple-touch-icon-precomposed'].includes(token))) {
        candidates.push(createCandidate(link.getAttribute('href'), baseUrl, '网页图标', 6000, link.getAttribute('type') || ''));
      }
      if (rel.includes('manifest')) {
        const url = resolveResourceUrl(link.getAttribute('href'), baseUrl);
        if (url && new URL(url).origin === new URL(pageUrl).origin) manifests.push(url);
      }
    }
    for (const element of content.querySelectorAll('img, [style]')) {
      const identity = ['id', 'class', 'alt', 'aria-label', 'src']
        .map((name) => element.getAttribute(name) || '').join(' ');
      if (!/(?:logo|brand|标志|商标)/i.test(identity)) continue;
      if (element.tagName === 'IMG') {
        candidates.push(createCandidate(element.getAttribute('src') || element.getAttribute('data-src'), baseUrl, '品牌图片', 1000));
      }
      const style = element.getAttribute('style') || '';
      // Only standalone images, not fonts, sprite fragments or unrelated CSS properties.
      for (const match of style.matchAll(/(?:^|;)\s*(?:background(?:-image)?|(?:-webkit-)?mask(?:-image)?)\s*:[^;]*?url\(\s*(['"]?)(.*?)\1\s*\)/gi)) {
        if (match[2].includes('#')) continue;
        candidates.push(createCandidate(match[2], baseUrl, '品牌样式图片', 1000));
      }
    }
    for (const meta of content.querySelectorAll('meta[content]')) {
      const name = (meta.getAttribute('property') || meta.getAttribute('name') || '').toLowerCase();
      if (['og:image', 'og:image:url', 'twitter:image', 'twitter:image:src'].includes(name)) {
        candidates.push(createCandidate(meta.getAttribute('content'), baseUrl, '分享图片', 0));
      }
    }
    return { candidates: uniqueCandidates(candidates), manifests: [...new Set(manifests)].slice(0, 2) };
  }

  function extractManifestIcons(manifest, manifestUrl) {
    if (!Array.isArray(manifest?.icons)) return [];
    return uniqueCandidates(manifest.icons.map((icon) => {
      if (!icon || typeof icon !== 'object') return null;
      const purposes = typeof icon.purpose === 'string' ? icon.purpose.toLowerCase().split(/\s+/) : ['any'];
      if (!purposes.some((purpose) => ['any', 'maskable'].includes(purpose))) return null;
      return createCandidate(icon.src, manifestUrl, '站点清单图标', 5000, typeof icon.type === 'string' ? icon.type : '');
    }));
  }

  async function fetchDocument(url, kind, fetcher = fetch) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    let reader;
    try {
      const response = await fetcher(url, {
        signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer',
        headers: { Accept: kind === 'html' ? 'text/html' : 'application/manifest+json, application/json' }
      });
      if (!response.ok) throw new Error('读取网站失败');
      const type = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
      if (kind === 'html' ? type !== 'text/html' : !['application/json', 'application/manifest+json'].includes(type)) {
        throw new Error('网站资源类型不支持');
      }
      if (Number(response.headers.get('content-length')) > MAX_DOCUMENT_BYTES) throw new Error('网站资源过大');
      if (!response.body) throw new Error('网站资源为空');
      reader = response.body.getReader();
      const decoder = new TextDecoder();
      let size = 0;
      let text = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_DOCUMENT_BYTES) throw new Error('网站资源过大');
        text += decoder.decode(value, { stream: true });
      }
      text += decoder.decode();
      return { text, url: resolveResourceUrl(response.url, url) || url };
    } finally {
      controller.abort();
      if (reader) await reader.cancel().catch(() => {});
      clearTimeout(timer);
    }
  }

  async function discoverPageIcons(pageUrl, fetcher = fetch) {
    try {
      const page = await fetchDocument(pageUrl, 'html', fetcher);
      const { candidates, manifests } = extractPageIcons(page.text, page.url);
      const manifestResults = await Promise.allSettled(manifests.map(async (url) => {
        const result = await fetchDocument(url, 'json', fetcher);
        return extractManifestIcons(JSON.parse(result.text), result.url);
      }));
      const manifestIcons = manifestResults.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
      return uniqueCandidates([...candidates, ...manifestIcons].sort((a, b) => b.priority - a.priority));
    } catch {
      // Permission, CORS, invalid markup and network failures retain the existing fallback.
      return [];
    }
  }

  return { discoverPageIcons, extractManifestIcons, extractPageIcons, fetchDocument, resolveResourceUrl };
});
