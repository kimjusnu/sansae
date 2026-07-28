/**
 * Custom cursor: a precise dot plus a ring that trails behind it.
 *
 * Only runs where there is a real pointing device. Touch and coarse pointers
 * keep the system cursor, and the native cursor is only hidden once this
 * module is confirmed running — a failure here can never leave a page with no
 * visible pointer.
 */
(function () {
  'use strict';

  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!fine.matches) return;

  var root = document.documentElement;
  var dot = document.createElement('div');
  var ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  root.classList.add('has-custom-cursor', 'cursor-hidden');

  var INTERACTIVE = 'a, button, [role="button"], summary, label, input, select, textarea';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = reduced ? 1 : 0.18;

  var x = window.innerWidth / 2;
  var y = window.innerHeight / 2;
  var ringX = x;
  var ringY = y;
  var running = false;

  // Both carry negative margins to centre them on the pointer, so without an
  // initial transform they would sit just off the left edge of the viewport.
  var atCentre = 'translate3d(' + x + 'px,' + y + 'px,0)';
  dot.style.transform = atCentre;
  ring.style.transform = atCentre;

  function frame() {
    ringX += (x - ringX) * EASE;
    ringY += (y - ringY) * EASE;
    ring.style.transform = 'translate3d(' + ringX.toFixed(1) + 'px,' + ringY.toFixed(1) + 'px,0)';

    // Park the loop once the ring has caught up; pointermove restarts it.
    if (Math.abs(x - ringX) < 0.1 && Math.abs(y - ringY) < 0.1) {
      running = false;
      return;
    }
    window.requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    window.requestAnimationFrame(frame);
  }

  document.addEventListener('pointermove', function (event) {
    if (event.pointerType !== 'mouse') return;
    x = event.clientX;
    y = event.clientY;
    dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    root.classList.remove('cursor-hidden');
    root.classList.toggle('cursor-active', !!event.target.closest(INTERACTIVE));
    start();
  }, { passive: true });

  document.addEventListener('pointerdown', function () {
    root.classList.add('cursor-down');
  }, { passive: true });

  document.addEventListener('pointerup', function () {
    root.classList.remove('cursor-down');
  }, { passive: true });

  // Leaving the window, or switching to touch, should hand the pointer back.
  document.addEventListener('pointerleave', function () {
    root.classList.add('cursor-hidden');
  });

  window.addEventListener('blur', function () {
    root.classList.add('cursor-hidden', 'cursor-down');
    root.classList.remove('cursor-down');
  });

  function onPointerChange(event) {
    if (event.matches) return;
    root.classList.remove('has-custom-cursor', 'cursor-active', 'cursor-down');
  }
  if (fine.addEventListener) fine.addEventListener('change', onPointerChange);
  else if (fine.addListener) fine.addListener(onPointerChange);
})();
