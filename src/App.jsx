import React, { useState, useEffect, useEffectEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import profilePic from './profile.jpeg'; 
import './vendor/character-field.js';

const transitionCurve = [0.22, 1, 0.36, 1]; 

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: transitionCurve } }
};

const modernModalVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 50, filter: "blur(12px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 350, damping: 30 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -20, 
    filter: "blur(10px)",
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

const projectsData = [
  {
    id: "incident-triage",
    title: "Incident Triage Agent",
    category: "Agentic AI & AIOps",
    tags: ["LangGraph", "Python", "MCP", "Groq", "Streamlit"],
    poster: "./projects/incident-triage-poster.jpg",
    video: "./projects/incident-triage.mp4",
    videoSmall: "./projects/incident-triage-720.mp4",
    link: "https://github.com/dheepakkaran/incident-triage-agent"
  },
  {
    id: "llm-gateway",
    title: "LLM Gateway",
    category: "Serverless Infrastructure",
    tags: ["AWS Lambda", "DynamoDB", "Python", "EventBridge", "Telegram"],
    poster: "./projects/llm-gateway-poster.jpg",
    video: "./projects/llm-gateway.mp4",
    videoSmall: "./projects/llm-gateway-720.mp4",
    link: "https://github.com/dheepakkaran/llm-gateway"
  },
  {
    id: "leetbot",
    title: "LeetBot",
    category: "Automation",
    tags: ["Python", "GitHub Actions", "Gemini", "Telegram Bot"],
    poster: "./projects/leetbot-poster.jpg",
    video: "./projects/leetbot.mp4",
    videoSmall: "./projects/leetbot-720.mp4",
    link: "https://github.com/dheepakkaran/leetbot"
  },
  {
    id: "xg-from-words",
    title: "xG From Words",
    category: "Sports Analytics & NLP",
    tags: ["Python", "Sentence Transformers", "XGBoost", "scikit-learn"],
    poster: "./projects/xg-from-words-poster.jpg",
    video: "./projects/xg-from-words.mp4",
    videoSmall: "./projects/xg-from-words-720.mp4",
    link: "https://github.com/dheepakkaran/xg-from-words"
  }
];

const educationData = [
  {
    school: "Northeastern University",
    degree: "MS, Electrical & Computer Engineering",
    period: "2026 — May 2028",
    summary: "Concentration in Machine Learning, Computer Vision & Algorithms. CGPA 3.926 / 4.0.",
    coursework: ["ML & Pattern Recognition", "Computer Engineering", "Large Language Models", "MLOps"]
  }
];

const GITHUB_USER = "dheepakkaran";
// Public mirror of the GitHub contribution calendar (no token needed)
const CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`;
// Empty days use the site's neutral translucent grey; active days use GitHub's dark-theme greens
const heatLevels = ["bg-white/[0.06]", "bg-[#033a16]", "bg-[#196c2e]", "bg-[#2ea043]", "bg-[#56d364]"];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Only the most recent months are shown
const MONTHS_SHOWN = 6;

const toLocalDate = (isoDate) => new Date(`${isoDate}T00:00:00`);

// Hover easter egg: a snake (like the GitHub profile "snk" animation) eats the contribution cells.
// It heads for the square under the cursor; when the cursor rests it hunts the nearest green square itself.
const SNAKE_LENGTH = 6;
const SNAKE_TICK_MS = 45;
// The cursor counts as resting after this many snake steps (~0.7s) without moving
const CURSOR_IDLE_TICKS = 15;
const snakeShades = ["bg-white", "bg-white/80", "bg-white/60", "bg-white/45", "bg-white/30", "bg-white/20"];
const cellKey = ([w, d]) => `${w}-${d}`;
const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function ContributionHeatmap() {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  // { body: [[week, day], ...] head first, eaten: Set } while the snake is out, null otherwise
  const [snake, setSnake] = useState(null);
  const sim = useRef(null);
  const cursor = useRef({ cell: null, idle: 0 });
  const timers = useRef({ interval: null, timeouts: [] });
  const hovering = useRef(false);
  const rootRef = useRef(null);
  const autoRun = useRef(false);
  const autoPlayed = useRef(false);
  const autoVisible = useRef(false);

  const clearTimers = () => {
    clearInterval(timers.current.interval);
    timers.current.timeouts.forEach(clearTimeout);
    timers.current = { interval: null, timeouts: [] };
  };
  useEffect(() => clearTimers, []);

  useEffect(() => {
    let cancelled = false;
    fetch(CONTRIBUTIONS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => { if (!cancelled) setData(json); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, []);

  const allDays = data?.contributions ?? [];
  // Keep the last MONTHS_SHOWN months, starting on that week's Sunday so the first column is full
  const start = allDays.length ? toLocalDate(allDays[allDays.length - 1].date) : new Date();
  start.setMonth(start.getMonth() - MONTHS_SHOWN);
  start.setDate(start.getDate() - start.getDay());
  const days = allDays.filter((day) => toLocalDate(day.date) >= start);
  // Pad the first week so every column runs Sunday to Saturday
  const leadingBlanks = days.length ? toLocalDate(days[0].date).getDay() : 0;
  const cells = [...Array(leadingBlanks).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const columns = weeks.length ? weeks : Array.from({ length: 27 }, () => []);

  // One label per month, on the first week of that month. The first column is only labelled
  // when it starts near the 1st, so a partial month never crowds the next label.
  const monthLabels = columns.map((week, i) => {
    const first = week.find(Boolean);
    if (!first) return "";
    const date = toLocalDate(first.date);
    if (i === 0) return date.getDate() <= 7 ? monthNames[date.getMonth()] : "";
    const prev = columns[i - 1].find(Boolean);
    const prevMonth = prev ? toLocalDate(prev.date).getMonth() : null;
    return date.getMonth() !== prevMonth ? monthNames[date.getMonth()] : "";
  });

  const gridColumns = { gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` };

  const finishSnake = () => {
    clearInterval(timers.current.interval);
    sim.current = null;
    if (autoRun.current) {
      autoRun.current = false;
      autoPlayed.current = true;
    }
    // Leave the eaten grid for a beat, let it grow back, then go again while still hovered
    setSnake((prev) => prev && { body: [], eaten: prev.eaten });
    timers.current.timeouts.push(setTimeout(() => {
      setSnake(null);
      if (hovering.current) timers.current.timeouts.push(setTimeout(runSnake, 1200));
    }, 900));
  };

  const tickSnake = () => {
    const s = sim.current;
    if (!s) return;
    const cols = columns.length;
    const [hw, hd] = s.body[0];
    const remaining = [...s.greens].filter((k) => !s.eaten.has(k)).map((k) => k.split("-").map(Number));
    const exiting = remaining.length === 0;

    // Target: off the right edge when done, else the cursor's square, else the nearest green square
    let target;
    const c = cursor.current;
    c.idle += 1;
    if (exiting) {
      target = [cols + SNAKE_LENGTH, hd];
    } else if (c.cell && c.idle < CURSOR_IDLE_TICKS && cellKey(c.cell) !== cellKey([hw, hd])) {
      target = c.cell;
    } else {
      target = remaining.reduce((best, cell) => {
        const dist = Math.abs(cell[0] - hw) + Math.abs(cell[1] - hd);
        const bestDist = Math.abs(best[0] - hw) + Math.abs(best[1] - hd);
        return dist < bestDist || (dist === bestDist && cell[0] < best[0]) ? cell : best;
      });
    }

    // One square per tick: prefer the axis with the bigger gap, never fold back onto the neck,
    // and avoid the rest of the body when there is another way
    const dw = target[0] - hw;
    const dd = target[1] - hd;
    const preferred = [];
    const horizontal = dw !== 0 ? [Math.sign(dw), 0] : null;
    const vertical = dd !== 0 ? [0, Math.sign(dd)] : null;
    (Math.abs(dw) >= Math.abs(dd) ? [horizontal, vertical] : [vertical, horizontal]).forEach((m) => m && preferred.push(m));
    const candidates = [...preferred, ...DIRECTIONS.filter((m) => !preferred.some((p) => p[0] === m[0] && p[1] === m[1]))]
      .map(([mw, md]) => [hw + mw, hd + md])
      .filter(([w, d]) => d >= 0 && d < 7 && w >= 0 && (exiting || w < cols))
      .filter((cell) => !s.body[1] || cellKey(cell) !== cellKey(s.body[1]));
    const bodyKeys = new Set(s.body.map(cellKey));
    const next = candidates.find((cell) => !bodyKeys.has(cellKey(cell))) ?? candidates[0];
    if (!next) return;

    s.body = [next, ...s.body].slice(0, SNAKE_LENGTH);
    if (s.greens.has(cellKey(next))) s.eaten.add(cellKey(next));
    if (exiting && s.body.every(([w]) => w >= cols)) {
      finishSnake();
      return;
    }
    setSnake({ body: s.body, eaten: new Set(s.eaten) });
  };

  const runSnake = () => {
    const greens = new Set();
    columns.forEach((week, w) => week.forEach((day, d) => { if (day?.level > 0) greens.add(cellKey([w, d])); }));
    if (!greens.size) return;
    // Enter from the left edge, on the cursor's row when there is one
    const head = [0, cursor.current.cell?.[1] ?? 3];
    sim.current = { body: [head], eaten: new Set(greens.has(cellKey(head)) ? [cellKey(head)] : []), greens };
    setSnake({ body: sim.current.body, eaten: new Set(sim.current.eaten) });
    timers.current.interval = setInterval(tickSnake, SNAKE_TICK_MS);
  };
  const startSnake = () => {
    hovering.current = true;
    if (!data || snake || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    runSnake();
  };
  const stopSnake = () => {
    hovering.current = false;
    cursor.current = { cell: null, idle: 0 };
    clearTimers();
    sim.current = null;
    setSnake(null);
  };
  const trackCursor = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const w = Math.floor(((e.clientX - rect.left) / rect.width) * columns.length);
    const d = Math.floor(((e.clientY - rect.top) / rect.height) * 7);
    cursor.current = {
      cell: [Math.min(Math.max(w, 0), columns.length - 1), Math.min(Math.max(d, 0), 6)],
      idle: 0
    };
  };

  const snakeBody = new Map();
  if (snake) {
    for (let i = snake.body.length - 1; i >= 0; i--) snakeBody.set(cellKey(snake.body[i]), i);
  }

  // Phones have no hover, so there the snake runs by itself once per visit: half a second after
  // most of the heatmap scrolls into view. Scrolling away stops it; it starts again on return
  // until one run has finished. Desktop keeps hover.
  const onAutoVisibility = useEffectEvent((visible) => {
    autoVisible.current = visible;
    if (visible) {
      if (autoPlayed.current || sim.current) return;
      timers.current.timeouts.push(setTimeout(() => {
        if (!autoVisible.current || autoPlayed.current || sim.current) return;
        autoRun.current = true;
        runSnake();
      }, 500));
    } else if (autoRun.current) {
      autoRun.current = false;
      stopSnake();
    }
  });
  useEffect(() => {
    const el = rootRef.current;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!data || !el || !touch || reduced) return undefined;
    const observer = new IntersectionObserver(([entry]) => onAutoVisibility(entry.intersectionRatio >= 0.6), { threshold: [0, 0.6, 1] });
    observer.observe(el);
    return () => observer.disconnect();
  }, [data]);

  // Nothing is better than a broken card
  if (failed) return null;

  return (
    <a
      ref={rootRef}
      href={`https://github.com/${GITHUB_USER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`GitHub contributions for ${GITHUB_USER}`}
      onMouseEnter={startSnake}
      onMouseLeave={stopSnake}
      className="block w-full max-w-[320px]"
    >
      <div>
        <div className="grid gap-[2px] md:gap-[3px] h-4 mb-1.5" style={gridColumns}>
          {monthLabels.map((label, i) => (
            <span key={i} className="text-[9px] md:text-[10px] leading-4 text-gray-500 whitespace-nowrap">
              {label}
            </span>
          ))}
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-[2px] md:gap-[3px]" style={gridColumns} onMouseMove={trackCursor}>
          {columns.flatMap((week, w) =>
            Array.from({ length: 7 }, (_, d) => {
              const day = week[d];
              const key = `${w}-${d}`;
              const segment = snakeBody.get(key);
              // Snake cells switch instantly; everything else fades, which leaves a short trail
              const shade = !data
                ? `${heatLevels[0]} animate-pulse`
                : segment !== undefined
                  ? snakeShades[segment]
                  : day
                    ? `${snake?.eaten.has(key) ? heatLevels[0] : heatLevels[day.level]} transition-colors duration-500`
                    : "bg-transparent";
              const label = day
                ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${toLocalDate(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                : undefined;
              return <div key={key} title={label} className={`aspect-square rounded-[2px] ${shade}`} />;
            })
          )}
        </div>
      </div>
    </a>
  );
}

const pad2 = (n) => String(n).padStart(2, '0');

// Horizontal carousel: native scroll-snap gives touch and trackpad swipes,
// mouse users can drag or use the arrows. Cards that are only partly in view are dimmed.
function ProjectCarousel({ children, label }) {
  const slides = React.Children.toArray(children);
  const trackRef = useRef(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 });
  const [ratios, setRatios] = useState({});
  const [scroll, setScroll] = useState({ progress: 0, thumb: 1 });

  const measure = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScroll({ progress: max > 0 ? el.scrollLeft / max : 0, thumb: el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1 });
  };

  useEffect(() => {
    const track = trackRef.current;
    const intersection = new IntersectionObserver((entries) => {
      setRatios((prev) => {
        const next = { ...prev };
        entries.forEach((entry) => { next[entry.target.dataset.index] = entry.intersectionRatio; });
        return next;
      });
    }, { root: track, threshold: [0, 0.25, 0.5, 0.75, 0.95, 1] });
    [...track.children].forEach((slide) => intersection.observe(slide));
    const resize = new ResizeObserver(measure);
    resize.observe(track);
    return () => { intersection.disconnect(); resize.disconnect(); };
  }, [slides.length]);

  const slideStep = () => {
    const el = trackRef.current;
    return el.children[0].offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0);
  };
  const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
  const go = (dir) => trackRef.current.scrollBy({ left: dir * slideStep(), behavior: smooth() });

  // Mouse drag-to-scroll; touch and trackpads already scroll natively
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag.current = { active: true, moved: false, startX: e.clientX, startLeft: trackRef.current.scrollLeft };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const el = trackRef.current;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      el.style.scrollSnapType = 'none';
      el.style.scrollBehavior = 'auto';
    }
    if (d.moved) el.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (!d.moved) return;
    const el = trackRef.current;
    const step = slideStep();
    el.style.scrollBehavior = '';
    el.scrollTo({ left: Math.round(el.scrollLeft / step) * step, behavior: smooth() });
    setTimeout(() => { el.style.scrollSnapType = ''; }, 500);
  };
  // A drag should not also count as a click that opens the project
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.stopPropagation();
      e.preventDefault();
      drag.current.moved = false;
    }
  };

  const fullyVisible = slides.map((_, i) => (ratios[i] ?? 1) >= 0.95);
  const shown = fullyVisible.flatMap((visible, i) => (visible ? [i + 1] : []));
  const first = shown[0] ?? 1;
  const last = shown[shown.length - 1] ?? first;
  const atStart = scroll.progress <= 0.01;
  const atEnd = scroll.progress >= 0.99;
  const scrollable = scroll.thumb < 0.999;

  const arrowClass = "w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:bg-white hover:text-black hover:border-white active:scale-95 transition-all duration-300 disabled:opacity-25 disabled:pointer-events-none";

  return (
    <div>
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onScroll={measure}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory py-2 -my-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            data-index={i}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={`shrink-0 snap-start w-[85%] sm:w-[70%] lg:w-[calc((100%_-_1.5rem)/2.15)] 2xl:w-[calc((100%_-_3rem)/3.15)] transition-[opacity,scale] duration-700 ease-out ${fullyVisible[i] ? "" : "opacity-40 scale-[0.97]"}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {scrollable && (
        <div className="flex items-center gap-4 md:gap-6 mt-6 md:mt-8">
          {/* Progress: a thumb that shows which part of the row is in view */}
          <div className="relative h-px flex-1 bg-white/10 overflow-hidden">
            <div
              className="absolute inset-y-0 bg-white/70 transition-[left,width] duration-300 ease-out"
              style={{ width: `${scroll.thumb * 100}%`, left: `${scroll.progress * (1 - scroll.thumb) * 100}%` }}
            />
          </div>
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-gray-500 tabular-nums whitespace-nowrap">
            {pad2(first)}{last > first ? `–${pad2(last)}` : ""} / {pad2(slides.length)}
          </span>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous project" disabled={atStart} onClick={() => go(-1)} className={arrowClass}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <button type="button" aria-label="Next project" disabled={atEnd} onClick={() => go(1)} className={arrowClass}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Background: a field of characters that brightens under the cursor and decodes into
// words from the work on this page. Ceilings come from character-field's ceiling.mjs for
// this blue palette (#000 ground, text from white down to gray-400) so text stays above WCAG AA.
// Words from the work on this page that surface under the cursor
const FIELD_WORDS = [
  'langgraph', 'root cause', 'guardrails', 'human in the loop', 'mcp', 'observability',
  'circuit breaker', 'retry storm', 'token bomb', 'dynamodb', 'aws lambda', 'eventbridge',
  'kafka', 'spring boot', 'fastapi', 'postgresql', 'docker', 'github actions',
  'expected goals', 'xgboost', 'sentence transformers', 'pattern recognition',
  'computer vision', 'large language models', 'mlops', 'backend', 'scalable'
];

// Always-on background lines on phones: terminal and binary snippets mixed with project words,
// so the field reads like a script quietly running behind the page
const AMBIENT_WORDS = [
  '$ deploy --prod', '[ok] build passed', 'kafka.consume()', 'GET /api 200', '0x1f4a9c', '10110010',
  'retry=3', 'langgraph.run()', 'status: healthy', 'p95 42ms', 'root cause found',
  'circuit breaker: open', 'docker compose up', 'git push origin main', 'curl -X POST',
  '>> tokens: 4096', 'mlops pipeline ok', 'expected goals 0.78', '01001011', 'fastapi --reload'
];

// Ceilings come from character-field's ceiling.mjs for this blue palette (#000 ground,
// text from white down to gray-400) so text stays above WCAG AA.
const FIELD_OPTIONS = {
  glyph: '#4c7bd9',
  accent: '#6ea8ff',
  ceiling: 0.42,
  accentCeiling: 0.31,
  lexicon: FIELD_WORDS,
  // Water: a mouse click on empty background drops into a simulated water surface (a damped
  // 2D wave equation). One thin ring travels slowly across the whole page and stays clearly
  // visible out to the edges; behind it the water is damped hard so the centre settles in ~1s.
  // Crests light the characters like the cursor glow, troughs darken them; calm again in ~4s.
  // Never on buttons, links, cards or the carousel. On phones a quick tap drops in;
  // swipes and scrolls never do.
  water: true,
  waterTap: true,
  waterSteps: 1.5,
  waterDamping: 0.997,
  waterSponge: 4,
  // a narrow, slightly taller drop and a short trail make one thin (~40px) ring instead of two thick ones
  waterDrop: 9,
  waterRadius: 5,
  waterWake: 0.8,
  waterTrail: 6,
  rippleMouseOnly: true,
  rippleIgnore: 'a, button, input, textarea, select, label, [role="button"], [role="region"], [tabindex], .cursor-pointer'
};

// Desktop card hover: the demo video mounts only while the card is hovered and fades in over the
// cover once frames are actually playing, so there is no black flash while it buffers.
function CardDemo({ src, title }) {
  const [ready, setReady] = useState(false);
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      aria-label={`${title} demo`}
      onPlaying={() => setReady(true)}
      className={`absolute inset-0 w-full h-full object-cover scale-[1.03] transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

// Preview demo: the cover shows at once, a quiet spinner appears only if loading takes a moment, and
// the video fades in once it plays. Phones get the 720px file. If autoplay is refused (iOS Low Power
// Mode) or the reader prefers reduced motion, a play button is shown instead.
function DemoVideo({ project }) {
  const videoRef = useRef(null);
  const [src] = useState(() => (window.matchMedia('(max-width: 767px)').matches ? project.videoSmall : project.video));
  const [autoPlay] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [status, setStatus] = useState(autoPlay ? 'loading' : 'paused');

  const play = () => {
    setStatus('loading');
    videoRef.current?.play().catch(() => setStatus('paused'));
  };

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl md:rounded-3xl shadow-2xl border border-white/10 bg-zinc-900">
      <img src={project.poster} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        muted
        loop
        playsInline
        preload={autoPlay ? 'auto' : 'metadata'}
        aria-label={`${project.title} demo`}
        onCanPlay={(e) => { if (autoPlay && e.currentTarget.paused) play(); }}
        onPlaying={() => setStatus('playing')}
        onError={() => setStatus('error')}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${status === 'playing' ? 'opacity-100' : 'opacity-0'}`}
      />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 delay-300 starting:opacity-0">
          <span className="w-7 h-7 rounded-full border-2 border-white/15 border-t-white/70 animate-spin"></span>
        </div>
      )}
      {status === 'paused' && (
        <button
          onClick={play}
          aria-label="Play demo"
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/50 border border-white/25 hover:bg-white hover:text-black flex items-center justify-center transition-colors duration-300 cursor-pointer backdrop-blur-md"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z"></path>
          </svg>
        </button>
      )}
    </div>
  );
}

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  // Demo videos only play on a mouse hover; touch cards stay on the cover and play in the preview
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    // Phones and low-power devices: fewer re-rolls and no fine cloud detail. Same look, less CPU.
    const touch = window.matchMedia('(pointer: coarse)').matches;
    const lowPower = touch || (navigator.hardwareConcurrency || 8) <= 4;
    const field = window.CharacterField.create({
      ...FIELD_OPTIONS,
      rerollRate: lowPower ? 0.010 : 0.015,
      maskDetail: lowPower ? 0 : 5,
      // Touch screens have no cursor to decode under, so there ~5 script-style lines are always on
      // screen, each typing in slowly (letters scramble, then settle) and dissolving slowly, and a
      // tap shows a word where it lands. Desktop stays cursor-only.
      // phones resize while scrolling (address bar); keep the field, waves and words through it
      stableHeight: true,
      ambientWords: touch ? 5 : 0,
      ambientLexicon: AMBIENT_WORDS,
      decodeMax: 16,
      tapWord: touch
    });
    if (!field) return undefined;
    field.canvas.style.transition = 'opacity 0.8s ease';

    // Full strength in the hero, calmer once the reading sections reach the middle of the screen
    let inHero = null;
    const update = () => {
      const next = document.querySelector('#education');
      const hero = !next || next.getBoundingClientRect().top > window.innerHeight * 0.5;
      if (hero === inHero) return;
      inHero = hero;
      field.canvas.style.opacity = hero ? '1' : '0.6';
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; update(); });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      field.destroy();
    };
  }, []);

  useEffect(() => {
    if (selectedProject || isResumeOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedProject, isResumeOpen]);

  return (
    <div className="text-gray-200 min-h-screen font-sans selection:bg-gray-200 selection:text-black overflow-x-hidden relative scroll-smooth">
      
      <div className="relative z-10">
        
        {/* Navigation - Adjusted padding for better breathing room */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: transitionCurve }}
          className="w-full pt-8 md:pt-12 px-8 md:px-16 lg:px-24 xl:px-32 flex justify-between items-center absolute top-0 z-50"
        >
          <div className="text-white font-bold tracking-[0.2em] uppercase text-xs md:text-sm drop-shadow-md">
            Dheepak Karan
          </div>
          <div className="space-x-12 text-[9px] tracking-[0.3em] uppercase hidden md:flex text-gray-400 font-medium">
            <a href="#about" className="hover:text-white transition-colors duration-300">About</a>
            <a href="#education" className="hover:text-white transition-colors duration-300">Education</a>
            <a href="#experience" className="hover:text-white transition-colors duration-300">Experience</a>
            <a href="#projects" className="hover:text-white transition-colors duration-300">Projects</a>
          </div>
        </motion.nav>

        {/* Hero Section - Scaled down slightly for standard laptops (lg screens) */}
        <section id="about" className="min-h-screen flex items-center justify-center pt-24 pb-16 px-8 md:px-16 lg:px-24 xl:px-32">
          <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-16 xl:gap-20">
            
            {/* Left Column - Text */}
            <motion.div 
              initial="hidden" animate="visible" 
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
              className="flex-1 w-full mt-12 md:mt-0 max-w-2xl"
            >
              <motion.div variants={fadeUp} className="flex items-center gap-4 md:gap-6 mb-6 xl:mb-8">
                <div className="h-[1px] w-8 md:w-12 bg-white/20"></div>
                <p className="text-gray-400 tracking-[0.3em] uppercase text-[9px] md:text-[10px] font-medium drop-shadow-md">
                  Software Engineer
                </p>
              </motion.div>

              {/* Scaled down text for lg, massive only on xl to prevent cramped feeling */}
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-light text-white leading-[1.1] tracking-tighter mb-6 xl:mb-8 drop-shadow-lg">
                Engineering <br className="hidden md:block"/>
                <span className="text-gray-400 italic font-serif">scalable</span> <br className="hidden md:block"/>
                backend systems.
              </motion.h1>

              <motion.div variants={fadeUp} className="border-l border-white/10 pl-5 xl:pl-6 mb-10 xl:mb-12">
                <p className="text-gray-400 font-light text-xs sm:text-sm lg:text-sm xl:text-base max-w-sm xl:max-w-md leading-relaxed drop-shadow-md">
                  Quiet resilience. Navigating complexity and building robust APIs that withstand the storm. Always pushing for optimal performance and clean architecture.
                </p>
              </motion.div>
              
              <motion.div variants={fadeUp} className="flex flex-wrap gap-6 xl:gap-8 items-center text-[9px] xl:text-[10px] uppercase tracking-[0.2em] font-bold">
                <button 
                  onClick={() => setIsResumeOpen(true)}
                  className="text-black bg-white px-6 xl:px-8 py-3 xl:py-4 hover:bg-gray-200 active:scale-95 transition-all duration-300 shadow-lg w-full sm:w-auto text-center"
                >
                  View Resume
                </button>
                <a href="https://github.com/dheepakkaran" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors duration-300">
                  GITHUB
                </a>
                <a href="https://linkedin.com/in/dheepakkaran" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors duration-300">
                  LINKEDIN
                </a>
              </motion.div>
            </motion.div>

            {/* Right Column - Image scaled for better proportions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 0.4, ease: transitionCurve }}
              className="flex-1 w-full flex justify-center md:justify-end mt-12 md:mt-0"
            >
              <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[480px] aspect-[4/5] bg-zinc-900 group shadow-2xl">
                <img 
                  src={profilePic} 
                  alt="Dheepak Karan" 
                  className="w-full h-full object-cover grayscale opacity-90 transition-opacity duration-700 hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>
                <div className="absolute inset-[1rem] md:inset-[1.5rem] border border-white/10 pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="pt-16 md:pt-24 px-8 md:px-16 lg:px-24 xl:px-32">
          <div className="max-w-[1400px] w-full mx-auto">
            <div className="flex justify-start md:justify-end items-center gap-4 md:gap-6 mb-10 md:mb-12">
              <h2 className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-gray-400">
                01. Education
              </h2>
              <div className="h-[1px] w-8 md:w-12 bg-white/30"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ duration: 0.8, ease: transitionCurve }}
              className="space-y-8 md:space-y-10"
            >
              {educationData.map((edu) => (
                <div key={edu.school} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 hover:bg-white/[0.02] md:px-4 transition-colors duration-300 rounded-xl">
                  <div className="flex-1">
                    {/* Date and degree stack on phones; the degree is too long to share a line */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 mb-2">
                      <span className="text-[8px] md:text-[9px] tracking-[0.3em] text-gray-500 uppercase whitespace-nowrap">
                        {edu.period}
                      </span>
                      <span className="hidden sm:inline text-white/20">•</span>
                      <span className="text-[8px] md:text-[9px] tracking-[0.3em] text-gray-400 uppercase font-medium">
                        {edu.degree}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-3xl font-light text-white tracking-tight mb-2">
                      {edu.school}
                    </h3>
                    <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed max-w-xl">
                      {edu.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap md:justify-end gap-1.5 mt-2 md:mt-0 w-full md:max-w-[220px]">
                    {edu.coursework.map((course) => (
                      <span key={course} className="text-[8px] md:text-[9px] tracking-[0.1em] text-gray-400 uppercase px-2.5 py-1 bg-white/5 border border-white/10 rounded-full">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="pt-12 md:pt-16 px-8 md:px-16 lg:px-24 xl:px-32">
          <div className="max-w-[1400px] w-full mx-auto">
            <div className="flex justify-start md:justify-end items-center gap-4 md:gap-6 mb-10 md:mb-12">
              <h2 className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-gray-400">
                02. Experience
              </h2>
              <div className="h-[1px] w-8 md:w-12 bg-white/30"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }} 
              transition={{ duration: 0.8, ease: transitionCurve }}
              className="space-y-12 md:space-y-16 mb-14 md:mb-16"
            >
              <div className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 hover:bg-white/[0.02] md:px-4 transition-colors duration-300 rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[8px] md:text-[9px] tracking-[0.3em] text-gray-500 uppercase">
                      Apr 2022 — Jul 2023
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-[8px] md:text-[9px] tracking-[0.3em] text-gray-400 uppercase font-medium">
                      Software Engineer
                    </span>
                  </div>
                  <h3 className="text-xl md:text-3xl font-light text-white tracking-tight mb-2">
                    Guardian Life
                  </h3>
                  <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed max-w-xl">
                    Engineered robust backend microservices utilizing Java Spring Boot and Python FastAPI. Optimized complex database queries and pipelines, reducing latency by 30%.
                  </p>
                </div>
                <div className="flex flex-wrap md:justify-end gap-1.5 mt-2 md:mt-0 w-full md:max-w-[220px]">
                  {['Java Spring Boot', 'FastAPI', 'PostgreSQL', 'Kafka', 'Docker'].map((tech, i) => (
                    <span key={i} className="text-[8px] md:text-[9px] tracking-[0.1em] text-gray-400 uppercase px-2.5 py-1 bg-white/5 border border-white/10 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Projects Section */}
            <div id="projects" className="flex justify-start md:justify-end items-center gap-4 md:gap-6 mb-10 md:mb-12">
              <h2 className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-gray-400">
                03. Selected Works
              </h2>
              <div className="h-[1px] w-8 md:w-12 bg-white/30"></div>
            </div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "100px" }}
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            >
              <ProjectCarousel label="Selected works">
              {projectsData.map((project) => (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  onClick={() => setSelectedProject(project)}
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse') setPlayingId(project.id); }}
                  onPointerLeave={() => setPlayingId(null)}
                  className="group relative flex flex-col h-full overflow-hidden bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm cursor-pointer hover:bg-white/[0.04] hover:border-white/25 hover:-translate-y-1 active:scale-[0.99] transition-[background-color,border-color,translate,scale] duration-500"
                >
                  {/* Media - still poster, demo video plays on mouse hover */}
                  <div className="relative aspect-video overflow-hidden bg-zinc-900 border-b border-white/10">
                    <img
                      src={project.poster}
                      alt={`${project.title} preview`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                    />
                    {project.video && playingId === project.id && (
                      <CardDemo src={project.video} title={project.title} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                    {project.video && (
                      <span className="absolute top-4 left-4 flex items-center gap-2 text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-white/80 px-2.5 py-1 bg-black/50 border border-white/15 rounded-full backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70 group-hover:bg-red-500 transition-colors duration-300"></span>
                        <span className="hidden pointer-fine:inline">Hover to play</span>
                        <span className="pointer-fine:hidden">Tap to play</span>
                      </span>
                    )}
                  </div>

                  {/* Info strip - title and category on one line, tools as plain text */}
                  <div className="flex flex-1 items-start justify-between gap-4 px-5 py-4 md:px-6">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-base md:text-lg font-normal text-white tracking-tight leading-snug">
                          {project.title}
                        </h3>
                        <span className="text-[9px] md:text-[10px] tracking-[0.2em] text-gray-400 uppercase">
                          {project.category}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[11px] md:text-xs text-gray-400 leading-relaxed">
                        {/* Each tool stays whole; lines only break between tools */}
                        {project.tags.map((tag, i) => (
                          <React.Fragment key={tag}>
                            <span className="whitespace-nowrap">{tag}{i < project.tags.length - 1 && ' ·'}</span>{' '}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 mt-1 text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 hover:text-white transition-colors duration-300">
                      GitHub ↗
                    </a>
                  </div>
                </motion.div>
              ))}
              </ProjectCarousel>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-16 md:pt-24 pb-8 px-8 md:px-16 lg:px-24 xl:px-32">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
              <div>
                <p className="text-gray-400 text-[9px] md:text-[10px] tracking-[0.3em] uppercase mb-3 drop-shadow-md">Available for Summer 2027 internships &amp; co-ops</p>
                <a href="mailto:elumalaisanthakuma.d@northeastern.edu" className="inline-block text-2xl md:text-4xl text-white font-light tracking-tight hover:text-gray-300 active:scale-95 transition-all duration-300 drop-shadow-lg">
                  Let's talk.
                </a>
              </div>
              <ContributionHeatmap />
            </div>
            <div className="mt-10 md:mt-12 pt-5 border-t border-white/10">
              <p className="text-gray-500 text-[8px] md:text-[9px] tracking-[0.2em] uppercase">© {new Date().getFullYear()} Dheepak Karan. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Resume Modal */}
      <AnimatePresence>
        {isResumeOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
              onClick={() => setIsResumeOpen(false)}
            />
            <motion.div
              variants={modernModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-4xl h-[85vh] md:h-[90vh] z-10 flex flex-col bg-zinc-900 border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-4 md:px-6 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <span className="text-white text-xs tracking-[0.2em] uppercase font-medium">Resume</span>
                <div className="flex gap-4 items-center">
                  <a 
                    href="./Dheepak_Karan_Resume.pdf"
                    download
                    className="text-gray-400 hover:text-white transition-colors text-[10px] tracking-[0.1em] uppercase flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download
                  </a>
                  <button 
                    onClick={() => setIsResumeOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300 hover:rotate-90"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="w-full h-full bg-black/80 flex items-center justify-center relative">
                <div className="absolute flex flex-col items-center justify-center text-center p-6 z-0">
                  <p className="text-gray-400 text-sm mb-4">Preview not loading?</p>
                  <a href="./Dheepak_Karan_Resume.pdf" target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-white text-black text-xs uppercase tracking-widest font-bold rounded-sm">
                    Open / Download Resume
                  </a>
                </div>
                <iframe 
                  src="./Dheepak_Karan_Resume.pdf"
                  title="Dheepak Karan Resume"
                  className="w-full h-full border-none relative z-10 bg-transparent"
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Image Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
            {/* A full-screen blur over the moving background is costly on phones, so touch gets a plain dim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/85 pointer-fine:bg-black/70 pointer-fine:backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              variants={modernModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-5xl z-10"
            >
              {/* Top bar: GitHub and close sit above the demo on every screen size, so nothing covers it */}
              <div className="absolute -top-12 md:-top-14 right-0 z-20 flex items-center gap-2">
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View on GitHub"
                  title="View on GitHub"
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300 backdrop-blur-md"
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                </a>
                <button
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close preview"
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300 hover:rotate-90 cursor-pointer backdrop-blur-md"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {selectedProject.video ? (
                <DemoVideo key={selectedProject.id} project={selectedProject} />
              ) : selectedProject.poster ? (
                <img
                  src={selectedProject.poster}
                  alt={selectedProject.title}
                  className="w-full h-auto rounded-xl md:rounded-3xl shadow-2xl border border-white/10 object-cover md:object-contain bg-zinc-900/50"
                />
              ) : (
                <div className="w-full aspect-video bg-zinc-900 border border-white/10 rounded-xl md:rounded-3xl flex items-center justify-center">
                  <p className="text-gray-500 text-xs md:text-sm tracking-[0.2em] uppercase text-center px-4">Image Not Available</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}