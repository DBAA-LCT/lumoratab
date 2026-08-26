(() => {
  const { OPTION_ALIASES, detectProvider } = globalThis.LumoraAiRelayCore;
  const provider = detectProvider(location.hostname);
  if (!provider) return;
  const OPTION_MENU_IDENTITY = /工具|更多|技能|tool|more|skill/i;
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

  const waitFor = (finder, timeout = 25000, interval = 100) => new Promise((resolve) => {
    let observer;
    let intervalId;
    let timeoutId;
    let checking = false;
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      observer?.disconnect();
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      resolve(result);
    };
    const check = () => {
      if (checking) return;
      checking = true;
      let result = null;
      try { result = finder(); } catch { /* 页面仍在初始化，等待下一次变化。 */ }
      checking = false;
      if (result) finish(result);
    };

    check();
    if (settled) return;
    if (document.documentElement) {
      observer = new MutationObserver(check);
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'aria-disabled', 'aria-pressed', 'aria-checked', 'data-state']
      });
    }
    intervalId = setInterval(check, interval);
    timeoutId = setTimeout(() => finish(null), timeout);
  });

  const identity = (element) => {
    const descendants = [...element.querySelectorAll('[aria-label], [title], [data-testid], [data-icon], svg, use')]
      .slice(0, 12)
      .flatMap((child) => [
        child.getAttribute('aria-label'),
        child.getAttribute('title'),
        child.getAttribute('data-testid'),
        child.getAttribute('data-icon'),
        child.getAttribute('href'),
        child.getAttribute('xlink:href')
      ]);
    return [
      element.textContent,
      element.getAttribute('aria-label'),
      element.getAttribute('title'),
      element.getAttribute('data-testid'),
      element.getAttribute('data-state'),
      element.id,
      typeof element.className === 'string' ? element.className : '',
      ...descendants
    ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  };

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
    return [...document.querySelectorAll('button, [role="button"], [role="menuitem"], label, input[type="checkbox"]')]
      .filter((element) => {
        if (!visible(element) || !enabled(element)) return false;
        const rect = element.getBoundingClientRect();
        return rect.top < composerRect.bottom + 260 && rect.bottom > composerRect.top - 260;
      });
  };

  const findOptionControl = (composer, option) => {
    const matcher = OPTION_ALIASES[option];
    const composerRect = composer.getBoundingClientRect();
    return nearbyControls(composer)
      .filter((element) => matcher.test(identity(element)))
      .sort((a, b) => {
        const distance = (element) => {
          const rect = element.getBoundingClientRect();
          return Math.abs(rect.bottom - composerRect.bottom) + Math.abs(rect.left - composerRect.left) * .1;
        };
        return distance(a) - distance(b);
      })[0] || null;
  };

  const revealOptionControl = async (composer, option) => {
    const direct = findOptionControl(composer, option);
    if (direct) return direct;
    const trigger = nearbyControls(composer)
      .filter((element) => OPTION_MENU_IDENTITY.test(identity(element)))
      .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
    if (!trigger) return null;
    trigger.click();
    return waitFor(() => findOptionControl(composer, option), 1500, 50);
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
    let control = findOptionControl(composer, option);
    if (!control && desired) control = await revealOptionControl(composer, option);
    if (!control) return false;
    const state = activeState(control);
    if ((desired && state !== true) || (!desired && state === true)) {
      control.click();
      await waitFor(() => !control.isConnected || activeState(control) === desired, 600, 40);
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

  const waitUntilSent = (composer, timeout = 5000) => waitFor(() => !readComposer(composer).trim(), timeout, 50);

  const sendPrompt = async (composer) => {
    const button = await waitFor(() => findSendButton(composer), 12000, 50);
    if (button) {
      button.click();
      if (await waitUntilSent(composer)) return true;
    }
    pressEnter(composer);
    return Boolean(await waitUntilSent(composer, 8000));
  };

  (async () => {
    let task;
    try {
      task = await chrome.runtime.sendMessage({ type: 'getAiPrompt', provider });
    } catch {
      return;
    }
    if (!task?.text) return;

    let composer = await waitFor(findComposer, 60000, 80);
    if (!composer) return;

    fillComposer(composer, task.text);
    await waitFor(() => readComposer(composer).trim(), 4000, 40);
    if (provider === 'deepseek') {
      await setOption(composer, 'deepThink', Boolean(task.options?.deepThink));
      await setOption(composer, 'webSearch', Boolean(task.options?.webSearch));
    }

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
