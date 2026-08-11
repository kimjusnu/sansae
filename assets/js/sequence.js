/**
 * Scroll-scrub sequence.
 *
 * Pins the hero and draws one frame of an image sequence per scroll position.
 * Frames arrive in three waves so the scrub works long before the full set has
 * downloaded; whatever is missing is stood in for by the nearest frame that has.
 *
 * Two things keep it from stepping. Scroll position is not used directly: a
 * damped value chases it, which turns each ~100px wheel notch into a glide
 * instead of a jump. And every frame is decoded on arrival, so painting during
 * the glide never waits on a decode.
 *
 * The frame count comes from sequence/manifest.json, so re-running
 * design/build-sequence.py with a different video needs no change here.
 *
 * Degrades to a single still frame under reduced-motion, save-data, or any
 * failure. The hero text and CTAs are never hidden behind this module.
 */
(function () {
  'use strict';

  var stage = document.getElementById('scrollstage');
  if (!stage) return;

  var pin = stage.querySelector('.scrollstage-pin');
  var canvas = stage.querySelector('.scrollstage-canvas');
  if (!pin || !canvas) return;

  var ctx = canvas.getContext && canvas.getContext('2d');
  if (!ctx) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var stillOnly = reduced || saveData;

  var BASE = 'sequence/';
  var PREVIEW_STEP = 10;
  // Fraction of the remaining distance closed each frame. Lower feels smoother
  // but lags further behind the scrollbar; 0.16 settles in about 8 frames.
  var DAMPING = reduced ? 1 : 0.16;

  var frames = [];
  var count = 0;
  var poster = null;
  var lastFrame = -1;
  var offscreen = false;

  var target = 0;   // progress the scroll position asks for
  var current = 0;  // progress actually being drawn
  var ticking = false;

  /* ----------------------------------------------------------
     Loading
     ---------------------------------------------------------- */
  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = src;
    });
  }

  function frameSrc(set, index) {
    return BASE + set.dir + '/' + String(index).padStart(4, '0') + '.webp';
  }

  function loadInto(set, index) {
    return loadImage(frameSrc(set, index)).then(function (img) {
      // Decode up front so the first paint of this frame cannot stall.
      var ready = img.decode ? img.decode().catch(function () {}) : Promise.resolve();
      return ready.then(function () {
        frames[index] = img;
      });
    }, function () {
      /* one missing frame is survivable — nearest() covers the gap */
    });
  }

  /** Closest already-loaded frame, searching outward from index. */
  function nearest(index) {
    if (frames[index]) return frames[index];
    for (var d = 1; d < count; d++) {
      if (frames[index - d]) return frames[index - d];
      if (frames[index + d]) return frames[index + d];
    }
    return poster;
  }

  /* ----------------------------------------------------------
     Drawing
     ---------------------------------------------------------- */
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.round(pin.clientWidth * dpr);
    var h = Math.round(pin.clientHeight * dpr);
    if (!w || !h) return;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      lastFrame = -1;
    }
  }

  /** drawImage with object-fit: cover semantics. */
  function paint(img) {
    if (!img) return;
    var cw = canvas.width;
    var ch = canvas.height;
    var scale = Math.max(cw / img.width, ch / img.height);
    var w = img.width * scale;
    var h = img.height * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  function drawFrame(index) {
    paint(nearest(index));
  }

  /* ----------------------------------------------------------
     Scroll mapping
     ---------------------------------------------------------- */
  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  /** Fades to zero by `end` instead of over the whole range. */
  function fadeOutBy(progress, end) {
    return clamp01(1 - progress / end);
  }

  function readTarget() {
    var travel = stage.offsetHeight - window.innerHeight;
    if (travel <= 0) return null;
    return clamp01(-stage.getBoundingClientRect().top / travel);
  }

  function render(p) {
    var index = Math.round(p * (count - 1));
    if (index !== lastFrame) {
      lastFrame = index;
      drawFrame(index);
    }
    pin.style.setProperty('--hero-text-opacity', fadeOutBy(p, 0.5).toFixed(3));
    pin.style.setProperty('--hero-text-y', (-40 * p).toFixed(1) + 'px');
    pin.style.setProperty('--cube-opacity', fadeOutBy(p, 0.8).toFixed(3));
    pin.style.setProperty('--cube-scale', (1 - 0.18 * p).toFixed(4));
  }

  /** Chases `target` and parks itself once it arrives. */
  function tick() {
    var next = readTarget();
    if (next !== null) target = next;

    current += (target - current) * DAMPING;
    if (Math.abs(target - current) < 0.0004) current = target;

    render(current);

    if (current === target || offscreen) {
      ticking = false;
      return;
    }
    window.requestAnimationFrame(tick);
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(tick);
  }

  /** Jump without easing — for resize and first paint. */
  function snap() {
    var next = readTarget();
    if (next === null) return;
    target = current = next;
    lastFrame = -1;
    render(current);
  }

  function watchVisibility() {
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      offscreen = !entries[0].isIntersecting;
      stage.classList.toggle('is-offscreen', offscreen);
      if (!offscreen) requestUpdate();
    }, { rootMargin: '10% 0px' }).observe(stage);
  }

  /* ----------------------------------------------------------
     Start-up
     ---------------------------------------------------------- */
  function activate() {
    stage.classList.add('is-pinned');
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', function () {
      resize();
      snap();
    });
    watchVisibility();
    snap();
  }

  fetch(BASE + 'manifest.json')
    .then(function (r) {
      if (!r.ok) throw new Error('manifest ' + r.status);
      return r.json();
    })
    .then(function (manifest) {
      count = manifest.count;
      if (!count) throw new Error('empty manifest');
      frames = new Array(count);

      var wide = window.matchMedia('(min-width: 768px)').matches;
      var set = wide ? manifest.sets.hd : manifest.sets.sd;

      return loadImage(BASE + manifest.poster).then(function (img) {
        poster = img;
        stage.classList.add('is-ready');
        resize();
        paint(poster);
        return set;
      });
    })
    .then(function (set) {
      if (stillOnly) return null;

      // Wave 2: a coarse spread that already makes the scrub usable.
      var preview = [];
      for (var i = 0; i < count; i += PREVIEW_STEP) preview.push(i);
      if (preview[preview.length - 1] !== count - 1) preview.push(count - 1);

      return Promise.all(preview.map(function (i) { return loadInto(set, i); }))
        .then(function () {
          activate();
          // Wave 3: fill in, refining as each frame lands.
          var rest = [];
          for (var i = 0; i < count; i++) if (!frames[i]) rest.push(i);
          return rest.reduce(function (chain, i) {
            return chain.then(function () {
              return loadInto(set, i).then(function () {
                if (i === lastFrame) drawFrame(i);
              });
            });
          }, Promise.resolve());
        });
    })
    .catch(function () {
      /* Poster-only, unpinned. The hero still reads correctly. */
      stage.classList.remove('is-pinned');
    });

  // The intro gate warms the first frames while the visitor reads the splash.
  document.addEventListener('intro:done', requestUpdate);
})();
