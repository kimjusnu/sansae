/**
 * Portfolio interactions.
 * Progressive enhancement only — every section is readable without this file.
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     Header — condensed state on scroll, dark while over the hero
     ---------------------------------------------------------- */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var hero = document.querySelector('.hero');
    var toggle = header.querySelector('.nav-toggle');
    var ticking = false;
    function update() {
      // The open mobile menu uses the page theme, so the bar above it must too.
      var menuOpen = toggle && toggle.getAttribute('aria-expanded') === 'true';
      var overHero = hero && hero.getBoundingClientRect().bottom > header.offsetHeight;
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      header.classList.toggle('on-dark', Boolean(overHero && !menuOpen));
      ticking = false;
    }
    // The menu opens and closes from clicks, links and Escape; watching the
    // attribute covers all three.
    if (toggle && 'MutationObserver' in window) {
      new MutationObserver(update).observe(toggle, { attributes: true, attributeFilter: ['aria-expanded'] });
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

    /** Derived from state rather than set inline, so a language switch while
        the menu is open cannot leave the label describing the wrong action. */
    function syncLabel() {
      var key = isOpen() ? 'nav.close' : 'nav.open';
      toggle.setAttribute('aria-label', window.i18n ? window.i18n.t(key) : toggle.getAttribute('aria-label'));
    }
    if (window.i18n) window.i18n.onChange(syncLabel);

    function open() {
      toggle.setAttribute('aria-expanded', 'true');
      syncLabel();
      panel.hidden = false;
      document.body.classList.add('is-locked');
      var first = panel.querySelector('a, button');
      if (first) first.focus();
    }

    function close(returnFocus) {
      toggle.setAttribute('aria-expanded', 'false');
      syncLabel();
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
     Reading progress — a thin bar along the top of the header
     ---------------------------------------------------------- */
  function initProgress() {
    var bar = document.querySelector('.reading-progress');
    if (!bar) return;

    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.setProperty('--progress', ratio.toFixed(4));
      ticking = false;
    }
    function request() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
  }

  /* ----------------------------------------------------------
     Screenshot tabs — WAI-ARIA tabs with arrow-key movement
     ---------------------------------------------------------- */
  function initGalleries() {
    var galleries = document.querySelectorAll('[data-gallery]');
    Array.prototype.forEach.call(galleries, function (gallery) {
      var tabs = Array.prototype.slice.call(gallery.querySelectorAll('[role="tab"]'));
      if (!tabs.length) return;

      function select(tab, focus) {
        tabs.forEach(function (other) {
          var selected = other === tab;
          other.setAttribute('aria-selected', String(selected));
          other.tabIndex = selected ? 0 : -1;
          var panel = document.getElementById(other.getAttribute('aria-controls'));
          if (panel) panel.hidden = !selected;
        });
        if (focus) tab.focus();
      }

      tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () {
          select(tab, false);
        });
        tab.addEventListener('keydown', function (event) {
          var next = null;
          if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
          if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
          if (event.key === 'Home') next = tabs[0];
          if (event.key === 'End') next = tabs[tabs.length - 1];
          if (!next) return;
          event.preventDefault();
          select(next, true);
        });
      });
    });
  }

  /* ----------------------------------------------------------
     Copy the e-mail address
     ---------------------------------------------------------- */
  function initCopy() {
    var buttons = document.querySelectorAll('[data-copy]');
    Array.prototype.forEach.call(buttons, function (button) {
      var label = button.querySelector('[data-copy-label]');
      button.addEventListener('click', function () {
        var text = button.getAttribute('data-copy');
        var done = function (ok) {
          if (!label) return;
          var original = label.textContent;
          var t = window.i18n ? window.i18n.t : function (k) { return k; };
          label.textContent = ok ? t('page.copied') : t('page.copyFailed');
          window.setTimeout(function () {
            label.textContent = original;
          }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            done(true);
          }, function () {
            done(false);
          });
        } else {
          done(false);
        }
      });
    });
  }

  function init() {
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initProgress();
    initGalleries();
    initCopy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
