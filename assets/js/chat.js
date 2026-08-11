/**
 * Portfolio assistant — front end.
 *
 * Talks to the Cloudflare Worker in worker/, which holds the resume and the
 * Workers AI binding. Nothing is stored: closing the panel or reloading the
 * page discards the conversation, and the worker keeps no transcript.
 *
 * Set WORKER_URL after deploying the worker. While it is empty the chat button
 * is never inserted, so a half-configured build cannot ship a dead feature.
 */
(function () {
  'use strict';

  // From `npx wrangler deploy` — e.g. 'https://junsu-portfolio-assistant.<계정>.workers.dev'
  var WORKER_URL = 'https://junsu-portfolio-assistant.junsu4621.workers.dev';

  var EMAIL = 'junsu4621@naver.com';
  var MAX_CHARS = 500;
  // A worker that accepts the connection but never answers would otherwise
  // leave the panel typing forever. A refused connection surfaces on its own
  // in about 3s; this only catches the stalled case.
  var TIMEOUT_MS = 20000;

  var dock = document.getElementById('chat-dock');
  var panel = document.getElementById('chat-panel');
  if (!dock || !panel) return;

  if (!WORKER_URL) {
    // Not configured: remove rather than hide, so nothing is left to find.
    dock.remove();
    panel.remove();
    return;
  }

  var toggle = dock.querySelector('.chat-toggle');
  var closeBtn = panel.querySelector('.chat-close');
  var log = panel.querySelector('.chat-log');
  var form = panel.querySelector('.chat-form');
  var input = panel.querySelector('.chat-form input');
  var sendBtn = panel.querySelector('.chat-send');
  var suggestions = panel.querySelector('.chat-suggestions');

  var history = [];
  var busy = false;

  function t(key) {
    return window.i18n ? window.i18n.t(key) : key;
  }

  function lang() {
    return window.i18n ? window.i18n.lang : 'ko';
  }

  dock.hidden = false;

  /* ----------------------------------------------------------
     Rendering
     ---------------------------------------------------------- */
  function scrollToEnd() {
    log.scrollTop = log.scrollHeight;
  }

  function addMessage(role, text) {
    var el = document.createElement('div');
    el.className = 'chat-msg chat-msg--' + role;
    el.textContent = text;
    log.appendChild(el);
    scrollToEnd();
    return el;
  }

  function addError(text) {
    var el = document.createElement('div');
    el.className = 'chat-msg chat-msg--error';
    el.textContent = text + ' ';
    var link = document.createElement('a');
    link.href = 'mailto:' + EMAIL;
    link.textContent = EMAIL;
    el.appendChild(link);
    log.appendChild(el);
    scrollToEnd();
  }

  function addTyping() {
    var el = document.createElement('div');
    el.className = 'chat-msg chat-msg--bot';
    el.innerHTML = '<span class="chat-typing"><span></span><span></span><span></span></span>';
    log.appendChild(el);
    scrollToEnd();
    return el;
  }

  function setBusy(state) {
    busy = state;
    sendBtn.disabled = state;
    input.disabled = state;
  }

  /* ----------------------------------------------------------
     Streaming
     ---------------------------------------------------------- */
  /** Pulls text deltas out of the worker's SSE stream. */
  function readStream(response, onDelta) {
    var reader = response.body.getReader();
    var decoder = new TextDecoder();
    var buffer = '';

    function pump() {
      return reader.read().then(function (result) {
        if (result.done) return;
        buffer += decoder.decode(result.value, { stream: true });

        var lines = buffer.split('\n');
        buffer = lines.pop();

        lines.forEach(function (line) {
          if (line.indexOf('data:') !== 0) return;
          var data = line.slice(5).trim();
          if (!data || data === '[DONE]') return;
          try {
            var parsed = JSON.parse(data);
            if (parsed.response) onDelta(parsed.response);
          } catch (e) {
            /* keep-alive or partial chunk — the next read completes it */
          }
        });

        return pump();
      });
    }
    return pump();
  }

  function ask(question) {
    if (busy) return;

    addMessage('user', question);
    history.push({ role: 'user', content: question });
    if (suggestions) suggestions.remove();

    setBusy(true);
    var placeholder = addTyping();
    var answer = '';

    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = window.setTimeout(function () {
      if (controller) controller.abort();
    }, TIMEOUT_MS);

    fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // lang is a hint for the greeting-language case only; the worker still
      // answers in whatever language the question was actually asked in.
      body: JSON.stringify({ messages: history, lang: lang() }),
      signal: controller ? controller.signal : undefined,
    })
      .then(function (response) {
        if (response.status === 429) throw new Error('rate_limited');
        if (!response.ok || !response.body) throw new Error('bad_response');

        return readStream(response, function (delta) {
          answer += delta;
          placeholder.textContent = answer;
          scrollToEnd();
        });
      })
      .then(function () {
        window.clearTimeout(timer);
        if (!answer.trim()) throw new Error('empty');
        history.push({ role: 'assistant', content: answer });
        setBusy(false);
        input.focus({ preventScroll: true });
      })
      .catch(function (err) {
        window.clearTimeout(timer);
        placeholder.remove();
        // The last question never got answered, so drop it from the history.
        history.pop();
        addError(t(err && err.message === 'rate_limited' ? 'chat.errRate' : 'chat.errGeneric'));
        setBusy(false);
      });
  }

  /* ----------------------------------------------------------
     Open / close
     ---------------------------------------------------------- */
  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  function open() {
    toggle.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    if (!log.childElementCount) addMessage('bot', t('chat.greeting'));
    input.focus({ preventScroll: true });
  }

  // Switching language rewrites the greeting, but only while it is the whole
  // conversation — an answer already given is left exactly as it was said.
  if (window.i18n) {
    window.i18n.onChange(function () {
      if (!history.length && log.childElementCount === 1) {
        log.firstElementChild.textContent = t('chat.greeting');
      }
    });
  }

  function close(returnFocus) {
    toggle.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    if (returnFocus) toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) close(false);
    else open();
  });

  closeBtn.addEventListener('click', function () {
    close(true);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) close(true);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var question = input.value.trim().slice(0, MAX_CHARS);
    if (!question) return;
    input.value = '';
    ask(question);
  });

  if (suggestions) {
    suggestions.addEventListener('click', function (event) {
      var btn = event.target.closest('button');
      if (btn) ask(btn.textContent.trim());
    });
  }
})();
