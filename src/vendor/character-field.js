/*!
 * character-field — an ambient canvas of drifting characters that answers
 * the cursor and decodes into real words.
 *
 * No dependencies. Works as an ES module, as a plain <script>, or through
 * CommonJS. One canvas, no DOM nodes, contrast-capped by construction.
 *
 *   import { createCharacterField } from './character-field.js';
 *   const field = createCharacterField({ lexicon: ['your', 'words'] });
 *   // later: field.destroy()
 */
(function (root, factory) {
  var api = factory();
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = api;
  } else if (typeof define === 'function' && define.amd) {
    define(function () { return api; });
  }
  // Publish on the global as well, in every environment and not only as a
  // fallback: character-field.mjs re-exports from there, and a classic
  // script cannot be imported natively any other way.
  if (root) root.CharacterField = api;
})(typeof globalThis !== 'undefined' ? globalThis
   : typeof self !== 'undefined' ? self
   : this, function () {
  'use strict';

  var DEFAULTS = {
    /* where the canvas goes. A string is used as a selector. */
    target: null,              // default: document.body
    zIndex: 0,

    /* ── palette ────────────────────────────────────────────────────
       `ceiling` and `accentCeiling` are hard caps on a single cell's
       alpha. They exist so that text sitting over a fully lit cell still
       clears WCAG AA. Run scripts/ceiling.mjs for your own palette;
       do not raise them by eye. */
    glyph: '#8a93a6',
    accent: '#6ea8ff',
    opacityMin: 0.04,
    opacityMax: 0.10,
    jitter: [0.3, 1.5],
    ceiling: 0.40,
    accentCeiling: 0.36,

    /* ── type ─────────────────────────────────────────────────────── */
    fontSize: 11,
    lineHeight: 12,
    charAspect: 0.58,          // cell width as a fraction of font size
    fontStack: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',

    /* ── characters ───────────────────────────────────────────────── */
    charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    extraSet: '',              // a second alphabet, e.g. another script
    extraMix: 0,               // 0..1 share of cells drawn from it

    /* ── decode: words that surface where the cursor passes ───────── */
    decode: true,
    lexicon: [],               // your own words. Empty disables decoding.
    decodeEvery: 230,          // ms between words while the pointer moves
    decodeLife: 1800,          // ms a word lives
    decodeMax: 10,             // concurrent words
    decodeSpread: 150,         // px around the cursor a word may land

    /* ── motion ───────────────────────────────────────────────────── */
    fps: 30,
    rerollRate: 0.015,         // share of cells re-rolled per frame
    rerollRun: 6,              // cells per run; one clearRect covers a run
    maskCycle: 46,             // seconds for one drift cycle
    maskBlobs: 6,              // broad density clouds
    maskDetail: 5,             // finer, quicker clouds over them
    maskFloor: 0.16,
    maskPeak: 0.38,
    vignette: 0.8,             // 0 = off, 1 = edges fully dark
    vignetteWidth: 1.75,       // >1 makes the bright band wider than tall

    /* ── pointer ──────────────────────────────────────────────────── */
    pointer: true,
    pointerReach: 170,
    ripple: true,
    rippleSpeed: 0.62,         // px per ms
    rippleLife: 1400,
    rippleBand: 90,
    /* local additions (portfolio) */
    rippleMouseOnly: false,    // true: no ring or drop for touch or pen presses (a phone swipe starts with one)
    rippleIgnore: '',          // CSS selector; presses inside a match get no ring or drop
    water: false,              // true: a click drops into a simulated water surface instead of a ring
    waterCell: 8,              // px per simulation cell
    waterSteps: 2,             // simulation steps per frame, may be fractional (sets wave speed)
    waterDamping: 0.972,       // energy kept per step
    waterSponge: 12,           // cells at each screen edge that absorb waves instead of reflecting them
    waterCalm: 0.03,           // stop once no point is higher than this (too faint to see)
    waterDrop: 4,              // height of the bump a click drops in
    waterRadius: 6,            // radius of that bump, in simulation cells
    waterGain: 1.6,            // how strongly height changes character brightness
    waterTint: 1.2,            // how strongly crests tint toward the accent colour
    waterWake: 1,              // extra damping per step behind each drop's outer rings (1 = off)
    waterTrail: 12,            // cells of rings kept behind the front before the wake damping starts
    waterSpeed: 0.707,         // front speed in cells per step (this scheme's wave speed is 1/sqrt 2)

    /* ── theming ──────────────────────────────────────────────────── */
    /* read these CSS custom properties off <html> when they are set, so
       a theme toggle can re-colour the field. Pass false to disable. */
    cssVars: {
      glyph: '--field-glyph',
      accent: '--field-accent',
      opacityMin: '--field-min',
      opacityMax: '--field-max',
      ceiling: '--field-ceiling',
      accentCeiling: '--field-accent-ceiling'
    }
  };

  function createCharacterField(userOptions) {
    var o = {};
    for (var k in DEFAULTS) if (DEFAULTS.hasOwnProperty(k)) o[k] = DEFAULTS[k];
    for (var k2 in (userOptions || {})) o[k2] = userOptions[k2];

    var host = o.target
      ? (typeof o.target === 'string' ? document.querySelector(o.target) : o.target)
      : document.body;
    if (!host) return null;

    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:' + o.zIndex;
    host.appendChild(canvas);

    var view = canvas.getContext('2d', { alpha: true });
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    var w = 0, h = 0, dpr = 1, cols = 0, rows = 0, cellW = 0, cellH = 0;
    var cellA = new Float32Array(0);
    var raf = 0, last = 0, t0 = now(), onScreen = true, dead = false;

    var px = -9999, py = -9999, pPrevX = -9999, pPrevY = -9999, pMoved = -9999;
    var rings = [], lastSpawn = 0;
    var decoded = new Map(), words = [];

    function now() { return (window.performance || Date).now(); }
    function rand(a, b) { return a + Math.random() * (b - a); }
    function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

    /* ── colour lookup: [tint][alpha] -> rgba string, built per theme ── */
    var TINTS = 6, ALPHAS = 48, lut = [];
    function parseHex(hex) {
      var n = String(hex).replace('#', '').trim();
      if (n.length === 3) n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2];
      return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
    }
    function buildLut() {
      var a = parseHex(o.glyph), b = parseHex(o.accent);
      lut = [];
      for (var t = 0; t <= TINTS; t++) {
        var kk = t / TINTS, row = new Array(ALPHAS + 1);
        var r = Math.round(a[0] + (b[0] - a[0]) * kk);
        var g = Math.round(a[1] + (b[1] - a[1]) * kk);
        var bl = Math.round(a[2] + (b[2] - a[2]) * kk);
        for (var i = 0; i <= ALPHAS; i++) row[i] = 'rgba(' + r + ',' + g + ',' + bl + ',' + (i / ALPHAS).toFixed(4) + ')';
        lut.push(row);
      }
    }
    function styleFor(tint, alpha) {
      return lut[(tint * TINTS + 0.5) | 0][(alpha * ALPHAS + 0.5) | 0];
    }

    function readTheme() {
      if (o.cssVars) {
        var cs = getComputedStyle(document.documentElement);
        for (var key in o.cssVars) {
          var v = cs.getPropertyValue(o.cssVars[key]).trim();
          if (!v) continue;
          o[key] = (key === 'glyph' || key === 'accent') ? v : parseFloat(v);
        }
      }
      buildLut();
    }

    function pickChar() {
      if (o.extraMix > 0 && o.extraSet && Math.random() < o.extraMix)
        return o.extraSet[(Math.random() * o.extraSet.length) | 0];
      return o.charset[(Math.random() * o.charset.length) | 0];
    }

    /* ── density mask: two octaves of drifting blobs times a vignette.
       Centres depend only on time, so they are solved once per frame and
       each cell then costs a few distance checks. ── */
    var bx = [], by = [], br = [], br2 = [], brInv = [], bAmp = [];
    var nBlobs = 0, vigRX = 1, vigRY = 1, VIG_INNER = 0.18;

    function solveMask(t) {
      var T = reduced.matches ? 0 : (t - t0) / 1000;
      var maxDim = Math.max(w, h), lift = o.maskPeak - o.maskFloor, i, a, r;
      nBlobs = 0;
      for (i = 0; i < o.maskBlobs; i++) {
        a = (T / o.maskCycle) * Math.PI * 2 + (i * Math.PI * 2) / o.maskBlobs;
        r = maxDim * (0.34 + 0.1 * Math.sin(a * 1.7 + i));
        bx[nBlobs] = w * (0.5 + 0.42 * Math.cos(a * (1 + i * 0.13)));
        by[nBlobs] = h * (0.5 + 0.42 * Math.sin(a * (1 + i * 0.21) + i));
        br[nBlobs] = r; br2[nBlobs] = r * r; brInv[nBlobs] = 1 / r;
        bAmp[nBlobs] = lift * 0.78; nBlobs++;
      }
      for (i = 0; i < o.maskDetail; i++) {
        a = (T / (o.maskCycle * 0.38)) * Math.PI * 2 + (i * 2.4);
        r = maxDim * (0.13 + 0.05 * Math.sin(a * 2.3 + i));
        bx[nBlobs] = w * (0.5 + 0.46 * Math.cos(a * (1 + i * 0.29) + i * 1.7));
        by[nBlobs] = h * (0.5 + 0.46 * Math.sin(a * (1 + i * 0.17) + i * 0.9));
        br[nBlobs] = r; br2[nBlobs] = r * r; brInv[nBlobs] = 1 / r;
        bAmp[nBlobs] = lift * 0.42; nBlobs++;
      }
      vigRY = Math.max(w / o.vignetteWidth, h) * 0.78;
      vigRX = vigRY * o.vignetteWidth;
    }

    function maskAt(x, y) {
      var v = o.maskFloor, i, dx, dy, d2, t;
      for (i = 0; i < nBlobs; i++) {
        dx = x - bx[i];
        if (dx > br[i] || dx < -br[i]) continue;
        dy = y - by[i];
        if (dy > br[i] || dy < -br[i]) continue;
        d2 = dx * dx + dy * dy;
        if (d2 >= br2[i]) continue;
        t = 1 - Math.sqrt(d2) * brInv[i];
        v += bAmp[i] * t * t;
      }
      if (o.vignette > 0) {
        var vx = (x - w * 0.5) / vigRX, vy = (y - h * 0.5) / vigRY;
        var d = (Math.sqrt(vx * vx + vy * vy) - VIG_INNER) / (1 - VIG_INNER);
        if (d > 0) v *= 1 - o.vignette * (d > 1 ? 1 : d);
      }
      return v;
    }

    function lightAt(x, y, t) {
      var v = 0, i, r, age, dx, dy, front, e, s;
      if (o.pointer && px > -9000) {
        dx = x - px; dy = y - py;
        var d2 = dx * dx + dy * dy, R = o.pointerReach;
        if (d2 < R * R) { var q = 1 - Math.sqrt(d2) / R; v = q * q; }
      }
      for (i = 0; i < rings.length; i++) {
        r = rings[i]; age = t - r.t;
        dx = x - r.x; dy = y - r.y;
        front = Math.abs(Math.sqrt(dx * dx + dy * dy) - age * o.rippleSpeed);
        if (front < o.rippleBand) {
          e = 1 - front / o.rippleBand;
          s = e * e * (1 - age / o.rippleLife);
          if (s > v) v = s;
        }
      }
      return v > 1 ? 1 : v;
    }

    function envelope(age, life) {
      var k = age / life;
      if (k < 0.12) return k / 0.12;
      if (k > 0.72) return (1 - k) / 0.28;
      return 1;
    }

    /* ── local addition (portfolio): water. A damped 2D wave equation on a coarse height grid:
       each step a point moves toward the average of its four neighbours and overshoots, so a
       bump spreads as rings, loses energy, reflects softly at the edges and interferes with
       other drops. Crests brighten and tint the characters, troughs darken them. ── */
    var wW = 0, wH = 0, wCur = new Float32Array(0), wPrev = new Float32Array(0);
    var wDamp = new Float32Array(0), wLast = new Float32Array(0), wActive = false, wDirty = false;
    var wDrops = [], wAcc = 0;   /* drop centres (cells) and step counts, for the wake; fractional steps */

    function buildWater() {
      wW = Math.ceil(w / o.waterCell) + 2;
      wH = Math.ceil(h / o.waterCell) + 2;
      wCur = new Float32Array(wW * wH);
      wPrev = new Float32Array(wW * wH);
      wLast = new Float32Array(cols * rows);
      /* damping per cell: the outer band absorbs waves like a shore, so they do not slosh back */
      wDamp = new Float32Array(wW * wH);
      for (var yy = 0; yy < wH; yy++)
        for (var xx = 0; xx < wW; xx++) {
          var edge = Math.min(xx, yy, wW - 1 - xx, wH - 1 - yy);
          wDamp[yy * wW + xx] = edge >= o.waterSponge
            ? o.waterDamping
            : o.waterDamping * (0.86 + 0.14 * edge / o.waterSponge);
        }
      wActive = false; wDirty = false; wDrops = []; wAcc = 0;
    }
    function waterAt(x, y) {
      if (!wActive) return 0;
      var sx = ((x / o.waterCell) | 0) + 1, sy = ((y / o.waterCell) | 0) + 1;
      if (sx < 1 || sy < 1 || sx >= wW - 1 || sy >= wH - 1) return 0;
      return wCur[sy * wW + sx];
    }
    function waterDrop(x, y) {
      var cx = x / o.waterCell + 1, cy = y / o.waterCell + 1, R = o.waterRadius, s2 = R * R * 0.5;
      var y0 = Math.max(1, (cy - R) | 0), y1 = Math.min(wH - 2, (cy + R) | 0);
      var x0 = Math.max(1, (cx - R) | 0), x1 = Math.min(wW - 2, (cx + R) | 0);
      for (var yy = y0; yy <= y1; yy++)
        for (var xx = x0; xx <= x1; xx++) {
          var dx = xx - cx, dy = yy - cy;
          wCur[yy * wW + xx] += o.waterDrop * Math.exp(-(dx * dx + dy * dy) / s2);
        }
      wDrops.push({ x: cx, y: cy, n: 0 });
      if (wDrops.length > 4) wDrops.shift();
      wActive = true; wDirty = true;
    }
    /* one step; returns the largest |height| so the simulation can stop once the surface is calm */
    function stepWater() {
      var peak = 0, k, nd = o.waterWake < 1 ? wDrops.length : 0, inner2 = [], outer2 = [];
      /* each drop's front grows at the wave speed; behind it (beyond the kept rings) the water is
         damped hard, so only the outer rings travel and the centre settles quickly */
      for (k = 0; k < nd; k++) {
        var dr = wDrops[k]; dr.n++;
        var front = o.waterRadius + o.waterSpeed * dr.n, inner = front - o.waterTrail, outer = front + o.waterRadius;
        inner2[k] = inner > 0 ? inner * inner : -1;
        outer2[k] = outer * outer;
      }
      for (var yy = 1; yy < wH - 1; yy++) {
        var row = yy * wW;
        for (var xx = 1; xx < wW - 1; xx++) {
          var i = row + xx, damp = wDamp[i];
          if (nd) {
            var behind = false, onRings = false;
            for (k = 0; k < nd; k++) {
              var ddx = xx - wDrops[k].x, ddy = yy - wDrops[k].y, q = ddx * ddx + ddy * ddy;
              if (q < inner2[k]) behind = true;
              else if (q <= outer2[k]) onRings = true;
            }
            if (behind && !onRings) damp *= o.waterWake;
          }
          var v = ((wCur[i - 1] + wCur[i + 1] + wCur[i - wW] + wCur[i + wW]) * 0.5 - wPrev[i]) * damp;
          wPrev[i] = v;
          if (v > peak) peak = v; else if (-v > peak) peak = -v;
        }
      }
      var swap = wCur; wCur = wPrev; wPrev = swap;
      return peak;
    }
    /* repaint only the character cells whose water height moved enough to show */
    function paintWater(t) {
      for (var row = 0; row < rows; row++) {
        var runStart = -1, cy = row * cellH + cellH * 0.5;
        for (var col = 0; col < cols; col++) {
          var i = row * cols + col;
          var v = waterAt(col * cellW + cellW * 0.5, cy);
          var changed = Math.abs(v - wLast[i]) > 0.015;
          if (changed) wLast[i] = v;
          if (changed && runStart < 0) runStart = col;
          if ((!changed || col === cols - 1) && runStart >= 0) {
            var end = changed ? col : col - 1;
            paintRun(row * cols + runStart, end - runStart + 1, t, true);
            runStart = -1;
          }
        }
      }
    }

    /* ── painting ─────────────────────────────────────────────────── */
    function drawCell(i, x, y, t, withLight, mPre) {
      var d = o.decode ? decoded.get(i) : undefined;
      if (d) {
        var e = envelope(t - d.born, d.life);
        if (e > 0) {
          view.fillStyle = styleFor(1, o.accentCeiling * clamp(e, 0, 1));
          view.fillText(d.ch, x, y + cellH * 0.5);
          return;
        }
      }
      var m = mPre !== undefined ? mPre : maskAt(x, y), tint = 0;
      if (withLight) {
        var l = lightAt(x, y, t);
        if (l > 0) { m += (1 - m) * l; tint = l; }
      }
      /* local addition (portfolio): water. Crests add light the way the cursor glow does (so a ring
         reads as clearly at the vignetted edges as in the middle) and tint toward the accent;
         troughs darken. */
      if (o.water && wActive) {
        var wv = waterAt(x + cellW * 0.5, y + cellH * 0.5);
        if (wv > 0) {
          var lift = o.waterGain * wv;
          if (lift > 1) lift = 1;
          m += (1 - m) * lift;
          var wt = wv * o.waterTint;
          if (wt > tint) tint = wt > 1 ? 1 : wt;
        } else if (wv < 0) {
          m *= Math.max(0, 1 + o.waterGain * wv);
        }
      }
      var a = cellA[i] * m;
      var cap = o.ceiling + (o.accentCeiling - o.ceiling) * tint;
      if (a > cap) a = cap;
      if (a > 0.002) {
        view.fillStyle = styleFor(tint, a);
        view.fillText(pickChar(), x, y + cellH * 0.5);
      }
    }

    function paintRun(start, len, t, withLight) {
      var col = start % cols, row = (start / cols) | 0;
      var x = col * cellW, y = row * cellH;
      view.clearRect(x, y, len * cellW, cellH);
      var m = maskAt(x + (len * cellW) * 0.5, y);
      for (var j = 0; j < len; j++) drawCell(start + j, x + j * cellW, y, t, withLight, m);
    }

    function paintBox(x0, y0, x1, y1, t) {
      var c0 = Math.max(0, (x0 / cellW) | 0), c1 = Math.min(cols - 1, (x1 / cellW) | 0);
      var r0 = Math.max(0, (y0 / cellH) | 0), r1 = Math.min(rows - 1, (y1 / cellH) | 0);
      var len = c1 - c0 + 1;
      if (len <= 0) return;
      for (var row = r0; row <= r1; row++) paintRun(row * cols + c0, len, t, true);
    }

    function paintRing(cx, cy, rad, band, t) {
      var outer = rad + band, inner = Math.max(0, rad - band);
      var c0 = Math.max(0, ((cx - outer) / cellW) | 0), c1 = Math.min(cols - 1, ((cx + outer) / cellW) | 0);
      var r0 = Math.max(0, ((cy - outer) / cellH) | 0), r1 = Math.min(rows - 1, ((cy + outer) / cellH) | 0);
      var i2 = inner * inner, o2 = outer * outer;
      for (var row = r0; row <= r1; row++) {
        var y = row * cellH, dy = y - cy, dy2 = dy * dy, runStart = -1;
        for (var col = c0; col <= c1; col++) {
          var x = col * cellW, dx = x - cx, d2 = dx * dx + dy2;
          var inBand = d2 >= i2 && d2 <= o2;
          if (inBand && runStart < 0) runStart = col;
          if ((!inBand || col === c1) && runStart >= 0) {
            var end = inBand ? col : col - 1;
            paintRun(row * cols + runStart, end - runStart + 1, t, true);
            runStart = -1;
          }
        }
      }
    }

    /* ── decode ───────────────────────────────────────────────────── */
    function spawnWord(cx, cy, t, spread) {
      if (!o.decode || !o.lexicon.length || words.length >= o.decodeMax) return;
      var text = o.lexicon[(Math.random() * o.lexicon.length) | 0];
      var len = text.length, j;
      if (len >= cols - 2) return;
      var row = clamp(((cy + rand(-spread, spread)) / cellH) | 0, 0, rows - 1);
      var col = clamp(((cx + rand(-spread, spread)) / cellW) | 0, 0, cols - len - 1);
      var base = row * cols + col;
      for (j = 0; j < len; j++) if (decoded.has(base + j)) return;
      for (j = 0; j < len; j++)
        decoded.set(base + j, { ch: text[j], born: t + j * 26, life: o.decodeLife });
      words.push({ base: base, len: len, born: t, life: o.decodeLife + len * 26 });
    }

    function updateWords(t) {
      if (!words.length) return;
      var alive = [];
      for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (t - word.born >= word.life) {
          for (var j = 0; j < word.len; j++) decoded.delete(word.base + j);
          paintRun(word.base, word.len, t, true);
        } else {
          alive.push(word);
          paintRun(word.base, word.len, t, true);
        }
      }
      words = alive;
    }

    /* ── frame ────────────────────────────────────────────────────── */
    function buildGrid() {
      cellW = Math.max(3, o.fontSize * o.charAspect);
      cellH = Math.max(4, o.lineHeight);
      cols = Math.ceil(w / cellW) + 1;
      rows = Math.ceil(h / cellH) + 1;
      view.textBaseline = 'middle';
      view.font = o.fontSize + 'px ' + o.fontStack;
      var n = cols * rows;
      cellA = new Float32Array(n);
      for (var i = 0; i < n; i++)
        cellA[i] = rand(o.opacityMin, o.opacityMax) * rand(o.jitter[0], o.jitter[1]) / o.maskPeak;
      decoded.clear(); words = [];
    }

    function paintAll(t) {
      solveMask(t);
      view.clearRect(0, 0, w, h);
      for (var i = 0; i < cellA.length; i++)
        drawCell(i, (i % cols) * cellW, ((i / cols) | 0) * cellH, t, false);
    }

    function frame(t) {
      if (reduced.matches) { paintAll(t); return; }
      solveMask(t);

      var n = cellA.length, k = (n * o.rerollRate) | 0;
      while (k > 0) {
        var start = (Math.random() * n) | 0;
        var len = Math.min(o.rerollRun, cols - (start % cols), k, n - start);
        if (len <= 0) break;
        paintRun(start, len, t, true);
        k -= len;
      }

      if (o.pointer && px > -9000) {
        var had = pPrevX > -9000;
        paintBox(Math.min(px, had ? pPrevX : px) - o.pointerReach,
                 Math.min(py, had ? pPrevY : py) - o.pointerReach,
                 Math.max(px, had ? pPrevX : px) + o.pointerReach,
                 Math.max(py, had ? pPrevY : py) + o.pointerReach, t);
        pPrevX = px; pPrevY = py;
        if (t - pMoved < 500 && t - lastSpawn > o.decodeEvery) {
          lastSpawn = t;
          spawnWord(px, py, t, o.decodeSpread);
        }
      }

      if (rings.length) {
        rings = rings.filter(function (r) { return t - r.t < o.rippleLife; });
        for (var i = 0; i < rings.length; i++) {
          var r = rings[i], rad = (t - r.t) * o.rippleSpeed;
          paintRing(r.x, r.y, rad, o.rippleBand, t);
          if (o.decode && t - r.t > r.spawned * 170 && r.spawned < 4) {
            r.spawned++;
            var ang = Math.random() * Math.PI * 2;
            spawnWord(r.x + Math.cos(ang) * rad, r.y + Math.sin(ang) * rad, t, 40);
          }
        }
      }
      updateWords(t);

      /* local addition (portfolio): advance the water; stop and repaint flat once it is calm */
      if (o.water && wActive) {
        var peak = -1;
        wAcc += o.waterSteps;
        while (wAcc >= 1) { peak = stepWater(); wAcc -= 1; }
        if (peak >= 0 && peak < o.waterCalm) { wCur.fill(0); wPrev.fill(0); wActive = false; wDrops = []; wAcc = 0; }
      }
      if (o.water && wDirty) {
        paintWater(t);
        wDirty = wActive;
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      view.setTransform(dpr, 0, 0, dpr, 0, 0);
      readTheme();
      buildGrid();
      buildWater();   /* local addition (portfolio) */
      paintAll(now());
    }

    function tick(t) {
      if (dead) return;
      raf = requestAnimationFrame(tick);
      if (t - last < 1000 / o.fps) return;
      last = t;
      frame(t);
    }

    function start() {
      if (raf || dead || reduced.matches || document.hidden || !onScreen) return;
      last = now();
      raf = requestAnimationFrame(tick);
    }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

    /* ── listeners. The canvas is pointer-events:none and these sit on
       the window, so nothing underneath ever loses a click. ── */
    var onMove, onDown, onLeave, onBlur, onResize, onVis, io, rt = 0;

    if (o.pointer) {
      onMove = function (e) { px = e.clientX; py = e.clientY; pMoved = now(); };
      onLeave = function () { px = py = -9999; };
      onBlur = onLeave;
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      window.addEventListener('blur', onBlur);
    }
    if (o.ripple) {
      onDown = function (e) {
        if (reduced.matches) return;
        /* local addition (portfolio): skip touch presses and presses on interactive elements */
        if (o.rippleMouseOnly && e.pointerType && e.pointerType !== 'mouse') return;
        if (o.rippleIgnore && e.target && e.target.closest && e.target.closest(o.rippleIgnore)) return;
        px = e.clientX; py = e.clientY;
        var t = now(); pMoved = t;
        /* local addition (portfolio): a drop into the water replaces the ring and its words */
        if (o.water) { waterDrop(e.clientX, e.clientY); return; }
        rings.push({ x: e.clientX, y: e.clientY, t: t, spawned: 0 });
        if (rings.length > 4) rings.shift();
        spawnWord(e.clientX, e.clientY, t, 30);
      };
      window.addEventListener('pointerdown', onDown, { passive: true });
    }

    onResize = function () { clearTimeout(rt); rt = setTimeout(resize, 200); };
    window.addEventListener('resize', onResize, { passive: true });

    onVis = function () { document.hidden ? stop() : start(); };
    document.addEventListener('visibilitychange', onVis);

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        onScreen ? start() : stop();
      }, { threshold: 0 });
      io.observe(canvas);
    }

    function onReducedChange() {
      stop(); rings = []; decoded.clear(); words = [];
      if (reduced.matches) paintAll(now()); else start();
    }
    if (reduced.addEventListener) reduced.addEventListener('change', onReducedChange);

    resize();
    start();

    return {
      /** re-read CSS custom properties and repaint. Call after a theme change. */
      refresh: function () { readTheme(); paintAll(now()); },
      /** merge new options in and rebuild. */
      set: function (patch) {
        for (var key in patch) o[key] = patch[key];
        resize();
      },
      /** current resolved options, for debugging. */
      options: o,
      /** local addition (portfolio): the canvas element, so the page can fade it with CSS. */
      canvas: canvas,
      /** remove the canvas and every listener. */
      destroy: function () {
        dead = true; stop();
        if (o.pointer) {
          window.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerleave', onLeave);
          window.removeEventListener('blur', onBlur);
        }
        if (o.ripple) window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVis);
        if (io) io.disconnect();
        if (reduced.removeEventListener) reduced.removeEventListener('change', onReducedChange);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

  return { create: createCharacterField, defaults: DEFAULTS };
});
