/**
 * Portfolio interactions.
 * Progressive enhancement only — every section is readable without this file.
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     3D icon fallback — never show a broken image
     ---------------------------------------------------------- */
  function markFallback(img) {
    var wrap = img.closest('.icon3d');
    if (wrap) wrap.classList.add('is-fallback');
  }

  function initIconFallbacks() {
    var images = document.querySelectorAll('.icon3d img');
    Array.prototype.forEach.call(images, function (img) {
      img.addEventListener('error', function () {
        markFallback(img);
      });
      // Images that already failed before this script ran.
      if (img.complete && img.naturalWidth === 0) markFallback(img);
    });
  }

  /* ----------------------------------------------------------
     Header — condensed state on scroll
     ---------------------------------------------------------- */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }

  /* ----------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var panel = document.getElementById('mobile-nav');
    if (!toggle || !panel) return;

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function open() {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', '메뉴 닫기');
      panel.hidden = false;
      document.body.classList.add('is-locked');
      var first = panel.querySelector('a, button');
      if (first) first.focus();
    }

    function close(returnFocus) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '메뉴 열기');
      panel.hidden = true;
      document.body.classList.remove('is-locked');
      if (returnFocus) toggle.focus();
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

    // Desktop layout takes over — make sure the panel never stays stuck open.
    var desktop = window.matchMedia('(min-width: 1024px)');
    var onChange = function (event) {
      if (event.matches && isOpen()) close(false);
    };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ----------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    Array.prototype.forEach.call(items, function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     Active section highlight in the desktop nav
     ---------------------------------------------------------- */
  function initNavHighlight() {
    var links = document.querySelectorAll('.nav-desktop a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var sections = [];
    Array.prototype.forEach.call(links, function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      byId[id] = link;
      sections.push(section);
    });
    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = byId[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            Array.prototype.forEach.call(links, function (other) {
              other.classList.remove('is-active');
            });
            link.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function init() {
    initIconFallbacks();
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initNavHighlight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
