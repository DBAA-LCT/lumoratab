(function exposeLumoraPlatform(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LumoraPlatform = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
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

  async function ensureOptionalPermission(permission) {
    if (!hasExtensionApi('permissions')) return false;
    const permissions = [permission];
    if (await chrome.permissions.contains({ permissions })) return true;
    return chrome.permissions.request({ permissions });
  }

  function reportError(context, error) {
    console.warn(`[LumoraTab] ${context}`, error);
  }

  async function requestIconSiteAccess(pageUrl) {
    if (!hasExtensionApi('permissions')) return false;
    const url = new URL(pageUrl);
    if (url.protocol !== 'https:' || url.username || url.password) return false;
    try {
      // Call directly from the click handler, before awaiting anything, to keep the user gesture.
      return await chrome.permissions.request({ origins: [`https://${url.hostname}/*`] });
    } catch {
      return false;
    }
  }

  return { ensureOptionalPermission, hasExtensionApi, reportError, requestIconSiteAccess, storageGet, storageSet };
});
