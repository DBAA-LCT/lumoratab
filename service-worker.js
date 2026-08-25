const AI_PROMPT_KEY = 'pendingAiPrompt';
const AI_PROMPT_MAX_AGE = 10 * 60 * 1000;
const AI_PROVIDER_ORIGINS = {
  doubao: 'doubao.com',
  deepseek: 'deepseek.com'
};

function senderMatchesProvider(sender, provider) {
  const expectedHost = AI_PROVIDER_ORIGINS[provider];
  if (!expectedHost) return false;
  const host = (() => {
    try { return new URL(sender.url || '').hostname; } catch { return ''; }
  })();
  return host === expectedHost || host.endsWith(`.${expectedHost}`);
}

function normalizeTask(task, provider) {
  const valid = task
    && task.provider === provider
    && typeof task.id === 'string'
    && typeof task.text === 'string'
    && task.text.trim()
    && Date.now() - Number(task.createdAt) <= AI_PROMPT_MAX_AGE;
  if (!valid) return null;
  return {
    id: task.id,
    text: task.text.trim(),
    options: {
      deepThink: Boolean(task.options?.deepThink),
      webSearch: Boolean(task.options?.webSearch)
    }
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!['getAiPrompt', 'completeAiPrompt'].includes(message?.type)) return;
  if (!senderMatchesProvider(sender, message.provider)) {
    sendResponse(null);
    return;
  }

  (async () => {
    try {
      const stored = await chrome.storage.session.get(AI_PROMPT_KEY);
      const rawTask = stored[AI_PROMPT_KEY];
      const task = normalizeTask(rawTask, message.provider);
      if (!task) {
        if (rawTask) await chrome.storage.session.remove(AI_PROMPT_KEY);
        sendResponse(null);
        return;
      }

      if (message.type === 'getAiPrompt') {
        sendResponse(task);
        return;
      }

      if (message.id === task.id) {
        await chrome.storage.session.remove(AI_PROMPT_KEY);
        sendResponse({ ok: true });
      } else {
        sendResponse({ ok: false });
      }
    } catch {
      sendResponse(null);
    }
  })();
  return true;
});
