(async () => {
  const output = document.querySelector('#results');
  const checks = [];
  function check(name, condition) {
    if (!condition) throw new Error(name);
    checks.push(`PASS ${name}`);
  }
  try {
    const { extractPageIcons, discoverPageIcons } = window.LumoraIconDiscovery;
    const parsed = extractPageIcons(`
      <base href="/assets/">
      <link REL="shortcut ICON" href="brand.svg?v=2&amp;x=1" type="image/svg+xml">
      <link rel="apple-touch-icon-precomposed" href="//cdn.test/apple.png">
      <link rel="icon" href="brand.svg?v=2&amp;x=1">
      <link rel="icon" href="javascript:alert(1)">
      <link rel="manifest" href="site.webmanifest">
      <link rel="manifest" href="https://other.test/manifest.json">
      <link rel="manifest" href="site.webmanifest">
      <img class="logo" src="/brand.png">
      <img alt="brand" data-src="lazy.png">
      <img src="/unrelated.png">
      <span aria-label="Logo" style="mask-image: url('mask.svg')"></span>
      <div class="brand" style="background-image:url(sprite.svg#logo)"></div>
      <meta property="og:image" content="/share.png">
      <script>document.body.dataset.injected = 'yes';<\/script>
      <img src="https://should-not-load.invalid/pixel" onerror="document.body.dataset.injected = 'yes'">
      <iframe src="https://should-not-load.invalid/frame"></iframe>
    `, 'https://site.test/app/');
    check('relative URL, base and HTML entity resolution', parsed.candidates[0].url === 'https://site.test/assets/brand.svg?v=2&x=1');
    check('SVG query strings and MIME type', parsed.candidates[0].vector);
    check('CDN-declared Apple touch icon', parsed.candidates[1].url === 'https://cdn.test/apple.png');
    check('deduplication, unsafe URLs and unrelated images filtered', parsed.candidates.length === 6);
    check('logo and lazy logo discovered', parsed.candidates.some((item) => item.url === 'https://site.test/brand.png') && parsed.candidates.some((item) => item.url === 'https://site.test/assets/lazy.png'));
    check('standalone CSS mask discovered; sprite not copied', parsed.candidates.some((item) => item.url.endsWith('/mask.svg')) && !parsed.candidates.some((item) => item.url.includes('sprite')));
    check('manifest deduplicated and scoped to site', JSON.stringify(parsed.manifests) === '["https://site.test/assets/site.webmanifest"]');
    check('remote markup never inserted into live document', !document.body.dataset.injected && !document.querySelector('iframe'));

    const calls = [];
    const results = await discoverPageIcons('https://site.test/', async (url) => {
      calls.push(url);
      if (url === 'https://site.test/') return new Response('<link rel="manifest" href="/app/site.webmanifest"><link rel="manifest" href="/bad.json"><img class="logo" src="/logo.png">', { headers: { 'content-type': 'text/html' } });
      if (url.endsWith('bad.json')) return new Response('{broken', { headers: { 'content-type': 'application/json' } });
      return new Response(JSON.stringify({ icons: [{ src: './icon.png' }] }), { headers: { 'content-type': 'application/manifest+json' } });
    });
    check('manifest icon resolves relative to manifest and outranks logo', results[0].url === 'https://site.test/app/icon.png');
    check('broken manifest does not discard valid results', results.length === 2 && calls.length === 3);
    const bounded = extractPageIcons(Array.from({ length: 100 }, (_, i) => `<link rel="icon" href="/${i}.png"><link rel="manifest" href="/${i}.json">`).join(''), 'https://site.test/');
    check('candidate and manifest request counts bounded', bounded.candidates.length === 24 && bounded.manifests.length === 2);
    output.textContent = checks.join('\n') + `\n\n${checks.length} passed`;
    output.dataset.status = 'passed';
  } catch (error) {
    output.textContent = checks.join('\n') + `\nFAIL ${error.stack}`;
    output.dataset.status = 'failed';
  }
})();
