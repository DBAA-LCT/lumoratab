const AI_PROMPT_KEY = 'pendingAiPrompt';
const AI_PROMPT_MAX_AGE = 2 * 60 * 1000;
const AI_PROVIDER_ORIGINS = {
  doubao: 'doubao.com',
  deepseek: 'deepseek.com'
};
let claimingPrompt = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'claimAiPrompt' || !AI_PROVIDER_ORIGINS[message.provider]) return;

  const host = (() => {
    try { return new URL(sender.url || '').hostname; } catch { return ''; }
  })();
  if (host !== AI_PROVIDER_ORIGINS[message.provider] && !host.endsWith(`.${AI_PROVIDER_ORIGINS[message.provider]}`)) {
    sendResponse(null);
    return;
  }

  if (claimingPrompt) {
    sendResponse(null);
    return;
  }
  claimingPrompt = true;
  (async () => {
    try {
      const stored = await chrome.storage.session.get(AI_PROMPT_KEY);
      const task = stored[AI_PROMPT_KEY];
      const valid = task
        && task.provider === message.provider
        && typeof task.text === 'string'
        && task.text.trim()
        && Date.now() - Number(task.createdAt) <= AI_PROMPT_MAX_AGE;
      await chrome.storage.session.remove(AI_PROMPT_KEY);
      sendResponse(valid ? { id: task.id, text: task.text.trim() } : null);
    } catch {
      sendResponse(null);
    } finally {
      claimingPrompt = false;
    }
  })();
  return true;
});
