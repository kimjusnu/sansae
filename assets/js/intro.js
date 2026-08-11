/**
 * Intro gate.
 *
 * Shows a splash whose glass cube is the same object as the hero cube: on
 * enter it travels to the hero's slot with a FLIP transform while the page
 * assembles around it. Nothing but transform and opacity is animated.
 *
 * Runs once per browser session. It used to run on every load, which meant a
 * recruiter who came back to check one detail had to click through the splash
 * again — a gate in front of the thing they came for. First visit still gets
 * the full entrance; reloads inside the same session go straight to the page.
 *
 * It also yields to reduced-motion, to deep links (a shared #work URL should
 * land on the section, not a splash), and to Escape at any moment. It buys
 * time to warm the sequence's first frames.
 */
(function () {
  'use strict';

  var intro = document.getElementById('intro');
  if (!intro) return;

  var cube = intro.querySelector('.intro-cube');
  var enterBtn = intro.querySelector('.intro-enter');
  var heroVisual = document.querySelector('.hero-visual');
  var heroCube = heroVisual && heroVisual.querySelector('.icon3d');
  var header = document.querySelector('.site-header');
  if (!cube || !enterBtn || !heroCube) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnimate = typeof Element.prototype.animate === 'function';
  var body = document.body;
  var lastFocus = null;
  var done = false;

  // A deep link means the visitor asked for a specific section, not a splash.
  if (reduced || !canAnimate || window.location.hash) return;

  // Already entered in this session? Don't make them do it twice.
  var SEEN_KEY = 'introSeen';
  try {
    if (window.sessionStorage.getItem(SEEN_KEY)) return;
    window.sessionStorage.setItem(SEEN_KEY, '1');
  } catch (e) {
    /* storage blocked — fall through and show the gate as before */
  }

  /* ----------------------------------------------------------
     Show
     ---------------------------------------------------------- */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  lastFocus = document.activeElement;
  body.classList.add('intro-active');
  intro.hidden = false;
  enterBtn.focus({ preventScroll: true });

  /* ----------------------------------------------------------
     Exit
     ---------------------------------------------------------- */
  function finish() {
    if (done) return;
    done = true;
    body.classList.remove('intro-active');
    intro.remove();
    document.removeEventListener('keydown', onKey, true);
    if (lastFocus && lastFocus !== document.body && lastFocus.focus) {
      lastFocus.focus({ preventScroll: true });
    }
    document.dispatchEvent(new CustomEvent('intro:done'));
  }

  /** Skip with no transition — Escape should feel immediate. */
  function skip() {
    finish();
  }

  function revealPage() {
    var stagger = intro.ownerDocument.querySelectorAll('.hero-copy > *');
    Array.prototype.forEach.call(stagger, function (el, i) {
      el.animate(
        [
          { opacity: 0, transform: 'translate3d(0, 20px, 0)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 540, delay: 260 + i * 70, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }
      );
    });

    if (header) {
      header.animate(
        [
          { opacity: 0, transform: 'translate3d(0, -100%, 0)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 520, delay: 300, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }
      );
    }
  }

  function enter() {
    if (done) return;
    window.scrollTo(0, 0);

    // FLIP: measure both slots, then move the intro cube with a transform.
    var from = cube.getBoundingClientRect();
    var to = heroCube.getBoundingClientRect();
    var dx = to.left + to.width / 2 - (from.left + from.width / 2);
    var dy = to.top + to.height / 2 - (from.top + from.height / 2);
    var scale = to.width / from.width;

    intro.classList.add('is-leaving');
    enterBtn.disabled = true;

    var flight = cube.animate(
      [
        { transform: 'translate3d(0, 0, 0) scale(1)' },
        { transform: 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale(' + scale + ')' },
      ],
      { duration: 760, easing: 'cubic-bezier(.62,0,.2,1)', fill: 'forwards' }
    );

    revealPage();

    // Hand the slot back to the hero cube just before the flight ends, so the
    // swap happens while the two are visually coincident.
    window.setTimeout(function () {
      body.classList.remove('intro-active');
    }, 700);

    if (flight.finished && flight.finished.then) {
      flight.finished.then(finish, finish);
    } else {
      window.setTimeout(finish, 800);
    }
  }

  function onKey(event) {
    if (done) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      skip();
      return;
    }
    // Keep the gate focus-trapped: Tab must not reach the page behind it.
    if (event.key === 'Tab') {
      event.preventDefault();
      enterBtn.focus({ preventScroll: true });
    }
  }

  /**
   * Clicking the backdrop must not enter — only the button or Escape do. But a
   * click that does nothing reads as broken, so it leaves a ripple where it
   * landed and nudges the button that the visitor actually wants.
   */
  function ripple(event) {
    var mark = document.createElement('span');
    mark.className = 'intro-ripple';
    mark.setAttribute('aria-hidden', 'true');
    mark.style.left = event.clientX + 'px';
    mark.style.top = event.clientY + 'px';
    intro.appendChild(mark);
    mark.addEventListener('animationend', function () {
      mark.remove();
    });

    enterBtn.classList.remove('is-nudged');
    // Reflow so the class can retrigger its animation on repeat clicks.
    void enterBtn.offsetWidth;
    enterBtn.classList.add('is-nudged');
  }

  enterBtn.addEventListener('click', enter);

  intro.addEventListener('pointerdown', function (event) {
    if (done || event.target.closest('.intro-enter')) return;
    ripple(event);
  });

  document.addEventListener('keydown', onKey, true);
})();
