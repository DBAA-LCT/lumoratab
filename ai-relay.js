(() => {
  const provider = location.hostname.endsWith('doubao.com') ? 'doubao'
    : location.hostname.endsWith('deepseek.com') ? 'deepseek'
      : '';
  if (!provider) return;

  const visible = (element) => {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 120 && rect.height > 20;
  };

  const waitFor = async (finder, timeout = 25000) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const result = finder();
      if (result) return result;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return null;
  };

  const findComposer = () => {
    const candidates = [...document.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"]')]
      .filter((element) => visible(element) && !element.matches('[disabled], [aria-disabled="true"]'));
    return candidates.sort((a, b) => {
      const score = (element) => {
        const rect = element.getBoundingClientRect();
        const hint = `${element.getAttribute('placeholder') || ''} ${element.getAttribute('aria-label') || ''} ${element.className || ''}`;
        return rect.bottom + Math.min(rect.width, 900) + (/消息|提问|输入|发送|ask|message|chat/i.test(hint) ? 3000 : 0);
      };
      return score(b) - score(a);
    })[0] || null;
  };

  const fillComposer = (composer, text) => {
    composer.focus();
    if (composer instanceof HTMLTextAreaElement || composer instanceof HTMLInputElement) {
      const prototype = composer instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
      if (setter) setter.call(composer, text);
      else composer.value = text;
      composer.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      composer.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    const selection = getSelection();
    const range = document.createRange();
    range.selectNodeContents(composer);
    selection.removeAllRanges();
    selection.addRange(range);
    if (!document.execCommand('insertText', false, text)) composer.textContent = text;
    composer.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    selection.removeAllRanges();
  };

  const findSendButton = (composer) => {
    const formSubmit = composer.closest('form')?.querySelector('button[type="submit"], [role="button"][type="submit"]');
    if (formSubmit && visible(formSubmit)) return formSubmit;

    const candidates = [...document.querySelectorAll('button, [role="button"]')].filter(visible);
    return candidates.find((button) => {
      const identity = [
        button.textContent,
        button.getAttribute('aria-label'),
        button.getAttribute('title'),
        button.getAttribute('data-testid'),
        button.id,
        typeof button.className === 'string' ? button.className : ''
      ].filter(Boolean).join(' ');
      return /发送|send|submit/i.test(identity);
    }) || null;
  };

  const enabled = (button) => button
    && !button.matches('[disabled], [aria-disabled="true"]')
    && getComputedStyle(button).pointerEvents !== 'none';

  (async () => {
    let task;
    try {
      task = await chrome.runtime.sendMessage({ type: 'claimAiPrompt', provider });
    } catch {
      return;
    }
    if (!task?.text) return;

    const composer = await waitFor(findComposer);
    if (!composer) return;
    fillComposer(composer, task.text);

    const send = await waitFor(() => {
      const button = findSendButton(composer);
      return enabled(button) ? button : null;
    }, 8000);
    if (!send) return;
    await new Promise((resolve) => setTimeout(resolve, 180));
    send.click();
  })();
})();
