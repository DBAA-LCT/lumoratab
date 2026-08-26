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

  return { ensureOptionalPermission, hasExtensionApi, reportError, storageGet, storageSet };
});
