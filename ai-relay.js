(() => {
  const provider = location.hostname.endsWith('doubao.com') ? 'doubao'
    : location.hostname.endsWith('deepseek.com') ? 'deepseek'
      : '';
  if (!provider) return;

  const OPTION_ALIASES = {
    deepThink: /深度思考|深度推理|deep\s*think|deepthink|\br1\b/i,
    webSearch: /联网搜索|智能搜索|网络搜索|搜索网页|web\s*search/i
  };
  const SEND_IDENTITY = /发送|send|submit|arrow-up|paper-plane/i;
  const NON_SEND_IDENTITY = /语音|voice|麦克风|microphone|附件|attach|上传|upload|图片|image|工具|tool|停止|stop/i;

  const visible = (element) => {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 16 && rect.height > 16;
  };

  const enabled = (element) => element
    && !element.matches('[disabled], [aria-disabled="true"]')
    && getComputedStyle(element).pointerEvents !== 'none';

  const waitFor = async (finder, timeout = 25000, interval = 250) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const result = finder();
      if (result) return result;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  };

  const identity = (element) => [
    element.textContent,
    element.getAttribute('aria-label'),
    element.getAttribute('title'),
    element.getAttribute('data-testid'),
    element.getAttribute('data-state'),
    element.id,
    typeof element.className === 'string' ? element.className : ''
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

  const findComposer = () => {
    const candidates = [...document.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"]')]
      .filter((element) => visible(element) && enabled(element));
    return candidates.sort((a, b) => {
      const score = (element) => {
        const rect = element.getBoundingClientRect();
        const hint = identity(element);
        const providerHint = provider === 'deepseek' ? /deepseek/i : /豆包|doubao/i;
        return rect.bottom
          + Math.min(rect.width, 900)
          + (/消息|提问|输入|发送|ask|message|chat/i.test(hint) ? 4000 : 0)
          + (providerHint.test(hint) ? 2000 : 0);
      };
      return score(b) - score(a);
    })[0] || null;
  };

  const readComposer = (composer) => {
    if (composer instanceof HTMLTextAreaElement || composer instanceof HTMLInputElement) return composer.value;
    return composer.innerText || composer.textContent || '';
  };

  const fillComposer = (composer, text) => {
    composer.focus();
    if (composer instanceof HTMLTextAreaElement || composer instanceof HTMLInputElement) {
      const prototype = composer instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
      if (setter) setter.call(composer, text);
      else composer.value = text;
      composer.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType: 'insertText', data: text }));
      composer.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      composer.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    const selection = getSelection();
    const range = document.createRange();
    range.selectNodeContents(composer);
    selection.removeAllRanges();
    selection.addRange(range);
    composer.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType: 'insertText', data: text }));
    if (!document.execCommand('insertText', false, text)) composer.textContent = text;
    composer.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    selection.removeAllRanges();
  };

  const nearbyControls = (composer) => {
    const composerRect = composer.getBoundingClientRect();
    return [...document.querySelectorAll('button, [role="button"], label, input[type="checkbox"]')]
      .filter((element) => {
        if (!visible(element)) return false;
        const rect = element.getBoundingClientRect();
        return rect.top < composerRect.bottom + 260 && rect.bottom > composerRect.top - 260;
      });
  };

  const activeState = (control) => {
    const checkbox = control.matches('input[type="checkbox"]') ? control : control.querySelector('input[type="checkbox"]');
    if (checkbox) return checkbox.checked;
    for (const attribute of ['aria-pressed', 'aria-checked']) {
      const value = control.getAttribute(attribute);
      if (value === 'true') return true;
      if (value === 'false') return false;
    }
    const dataState = control.getAttribute('data-state');
    if (/^(checked|on|active|selected)$/i.test(dataState || '')) return true;
    if (/^(unchecked|off|inactive)$/i.test(dataState || '')) return false;
    const className = typeof control.className === 'string' ? control.className : '';
    if (/(^|[-_\s])(active|selected|checked)([-_\s]|$)/i.test(className)) return true;
    return null;
  };

  const setOption = async (composer, option, desired) => {
    const matcher = OPTION_ALIASES[option];
    const control = nearbyControls(composer)
      .filter((element) => matcher.test(identity(element)))
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    if (!control) return false;
    const state = activeState(control);
    if ((desired && state !== true) || (!desired && state === true)) {
      control.click();
      await new Promise((resolve) => setTimeout(resolve, 220));
    }
    return true;
  };

  const findSendButton = (composer) => {
    const composerRect = composer.getBoundingClientRect();
    const form = composer.closest('form');
    const candidates = [...document.querySelectorAll('button, [role="button"]')]
      .filter((button) => visible(button) && enabled(button))
      .map((button) => {
        const rect = button.getBoundingClientRect();
        const hint = identity(button);
        if (NON_SEND_IDENTITY.test(hint)) return { button, score: -Infinity };
        const nearComposer = rect.top < composerRect.bottom + 160
          && rect.bottom > composerRect.top - 120
          && rect.left < composerRect.right + 220
          && rect.right > composerRect.left;
        let score = nearComposer ? 1000 : 0;
        if (SEND_IDENTITY.test(hint)) score += 10000;
        if (button.matches('[type="submit"]')) score += 8000;
        if (form?.contains(button)) score += 5000;
        if (rect.left >= composerRect.left + composerRect.width * .65) score += 1200;
        if (rect.width >= 24 && rect.width <= 90 && rect.height >= 24 && rect.height <= 90) score += 600;
        score -= Math.abs(rect.bottom - composerRect.bottom);
        return { button, score };
      })
      .filter(({ score }) => score >= 1400)
      .sort((a, b) => b.score - a.score);
    return candidates[0]?.button || null;
  };

  const pressEnter = (composer) => {
    composer.focus();
    const init = { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true };
    composer.dispatchEvent(new KeyboardEvent('keydown', init));
    composer.dispatchEvent(new KeyboardEvent('keypress', init));
    composer.dispatchEvent(new KeyboardEvent('keyup', init));
  };

  const waitUntilSent = (composer, timeout = 5000) => waitFor(() => !readComposer(composer).trim(), timeout, 150);

  const sendPrompt = async (composer) => {
    const button = await waitFor(() => findSendButton(composer), 12000);
    if (button) {
      button.click();
      if (await waitUntilSent(composer)) return true;
    }
    pressEnter(composer);
    return Boolean(await waitUntilSent(composer, 8000));
  };

  (async () => {
    let composer = await waitFor(findComposer, 10 * 60 * 1000, 350);
    if (!composer) return;

    let task;
    try {
      task = await chrome.runtime.sendMessage({ type: 'getAiPrompt', provider });
    } catch {
      return;
    }
    if (!task?.text) return;

    fillComposer(composer, task.text);
    await waitFor(() => readComposer(composer).trim(), 4000, 120);
    await setOption(composer, 'deepThink', Boolean(task.options?.deepThink));
    await setOption(composer, 'webSearch', Boolean(task.options?.webSearch));

    composer = findComposer() || composer;
    if (!readComposer(composer).trim()) fillComposer(composer, task.text);
    if (!await sendPrompt(composer)) return;

    try {
      await chrome.runtime.sendMessage({ type: 'completeAiPrompt', provider, id: task.id });
    } catch {
      // 已在目标网页完成发送；确认消息失败不影响用户会话。
    }
  })();
})();
