/**
 * Contact dock.
 *
 * A floating panel of ways to reach out. The KakaoTalk row is data-driven: set
 * KAKAO_CHANNEL_ID below and it appears, leave it empty and it is removed so no
 * dead link ever ships.
 *
 * Every link in the panel also exists in the footer, so the dock is an
 * accelerator rather than the only path to any of them.
 */
(function () {
  'use strict';

  // From 카카오톡 채널 관리자센터 (business.kakao.com) → 채널 URL.
  // For http://pf.kakao.com/_abcdEF the id is "_abcdEF".
  var KAKAO_CHANNEL_ID = '';

  var dock = document.getElementById('contact-dock');
  if (!dock) return;

  var toggle = dock.querySelector('.contact-toggle');
  var panel = dock.querySelector('.contact-panel');
  var kakao = dock.querySelector('.contact-kakao');
  if (!toggle || !panel) return;

  if (kakao) {
    if (KAKAO_CHANNEL_ID) {
      kakao.href = 'https://pf.kakao.com/' + KAKAO_CHANNEL_ID + '/chat';
      kakao.hidden = false;
    } else {
      kakao.remove();
    }
  }

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  function open() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', '연락처 닫기');
    panel.hidden = false;
    var first = panel.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  }

  function close(returnFocus) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '연락처 열기');
    panel.hidden = true;
    if (returnFocus) toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) close(false);
    else open();
  });

  panel.addEventListener('click', function (event) {
    if (event.target.closest('a')) close(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) close(true);
  });

  document.addEventListener('pointerdown', function (event) {
    if (isOpen() && !dock.contains(event.target)) close(false);
  });
})();
