import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import profilePic from './profile.jpeg'; 

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
    image: "./projects/incident-triage.webp",
    link: "https://github.com/dheepakkaran/incident-triage-agent"
  },
  {
    id: "llm-gateway",
    title: "LLM Gateway",
    category: "Serverless Infrastructure",
    tags: ["AWS Lambda", "DynamoDB", "Python", "EventBridge", "Telegram"],
    poster: "./projects/llm-gateway-poster.jpg",
    image: "./projects/llm-gateway.webp",
    link: "https://github.com/dheepakkaran/llm-gateway"
  },
  {
    id: "leetbot",
    title: "LeetBot",
    category: "Automation",
    tags: ["Python", "GitHub Actions", "Gemini", "Telegram Bot"],
    poster: "./projects/leetbot-poster.jpg",
    image: "./projects/leetbot.webp",
    link: "https://github.com/dheepakkaran/leetbot"
  },
  {
    id: "xg-from-words",
    title: "xG From Words",
    category: "Sports Analytics & NLP",
    tags: ["Python", "Sentence Transformers", "XGBoost", "scikit-learn"],
    poster: "./projects/xg-from-words-poster.jpg",
    image: "./projects/xg-from-words.webp",
    link: "https://github.com/dheepakkaran/xg-from-words"
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

function ContributionHeatmap() {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

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

  // Nothing is better than a broken card
  if (failed) return null;

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

  return (
    <a
      href={`https://github.com/${GITHUB_USER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`GitHub contributions for ${GITHUB_USER}`}
      className="group block w-full max-w-xl mx-auto p-5 md:p-6 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/25 hover:-translate-y-1 transition-[background-color,border-color,translate] duration-500"
    >
      <div className="grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out">
        <div className="grid gap-[2px] md:gap-[3px] h-4 mb-1.5" style={gridColumns}>
          {monthLabels.map((label, i) => (
            <span key={i} className="text-[9px] md:text-[10px] leading-4 text-gray-500 whitespace-nowrap">
              {label}
            </span>
          ))}
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-[2px] md:gap-[3px]" style={gridColumns}>
          {columns.flatMap((week, w) =>
            Array.from({ length: 7 }, (_, d) => {
              const day = week[d];
              const shade = !data ? `${heatLevels[0]} animate-pulse` : day ? heatLevels[day.level] : "bg-transparent";
              const label = day
                ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${toLocalDate(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                : undefined;
              return <div key={`${w}-${d}`} title={label} className={`aspect-square rounded-[2px] ${shade}`} />;
            })
          )}
        </div>
      </div>
    </a>
  );
}

// Just the route from a maps app: start marker, drawn path, destination pin
const ROUTE_PATH = "M40 118 C 70 112, 74 72, 108 66 S 158 90, 184 60 S 212 36, 222 34";

function RouteMap({ from, to }) {
  const drawIn = (delay = 0) => ({
    initial: { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true },
    transition: { duration: 1.4, delay, ease: transitionCurve }
  });
  const popIn = (delay) => ({
    initial: { opacity: 0, y: 4 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay, ease: transitionCurve }
  });

  return (
    <svg
      viewBox="0 0 260 150"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      role="img"
      aria-label={`${from} to ${to}`}
    >
      {/* Route: soft casing underneath, bright line on top */}
      <motion.path d={ROUTE_PATH} stroke="rgba(255,255,255,0.16)" strokeWidth="8" strokeLinecap="round" fill="none" {...drawIn()} />
      <motion.path d={ROUTE_PATH} stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" fill="none" {...drawIn()} />

      {/* Start marker */}
      <circle cx="40" cy="118" r="5" fill="#0b0b0b" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      <text x="34" y="138" fill="rgba(255,255,255,0.55)" fontSize="8" letterSpacing="1.5">{from.toUpperCase()}</text>

      {/* Destination pin */}
      <motion.g {...popIn(1.3)}>
        <path transform="translate(215 16)" fill="rgba(255,255,255,0.9)" d="M7 0C3.1 0 0 3.1 0 7c0 5.2 7 11 7 11s7-5.8 7-11c0-3.9-3.1-7-7-7zm0 9.6A2.6 2.6 0 1 1 7 4.4a2.6 2.6 0 0 1 0 5.2z" />
        <text x="208" y="27" fill="rgba(255,255,255,0.55)" fontSize="8" letterSpacing="1.5" textAnchor="end">{to.toUpperCase()}</text>
      </motion.g>
    </svg>
  );
}

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  // Demo animations are heavy, so a card only mounts its webp while hovered
  const [playingId, setPlayingId] = useState(null);

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
    <div className="bg-black text-gray-200 min-h-screen font-sans selection:bg-gray-200 selection:text-black overflow-x-hidden relative scroll-smooth">
      
      {/* Background Video - ULTIMATE PERFORMANCE FIX FOR ZERO LAG */}
      <div className="fixed inset-0 w-full h-full z-0 bg-black pointer-events-none">
        <video 
          autoPlay
          loop
          muted 
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
        >
          <source src="./bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/65"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
      </div>

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

        {/* Experience Section */}
        <section id="experience" className="pt-16 md:pt-24 px-8 md:px-16 lg:px-24 xl:px-32">
          <div className="max-w-[1400px] w-full mx-auto">
            <div className="flex justify-start md:justify-end items-center gap-4 md:gap-6 mb-10 md:mb-12">
              <h2 className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-gray-400">
                01. Experience
              </h2>
              <div className="h-[1px] w-8 md:w-12 bg-white/30"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }} 
              transition={{ duration: 0.8, ease: transitionCurve }}
              className="space-y-12 md:space-y-16 mb-20 md:mb-24"
            >
              {/* Content on the left, the route line on the right (on top for phones) */}
              <div className="flex flex-col-reverse md:flex-row md:items-center gap-5 md:gap-8 p-5 md:p-6 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-base md:text-lg font-normal text-white tracking-tight leading-snug">
                      Guardian Life
                    </h3>
                    <span className="text-[9px] md:text-[10px] tracking-[0.2em] text-gray-400 uppercase whitespace-nowrap">
                      Software Engineer
                    </span>
                  </div>
                  <p className="mt-2 text-gray-300 font-light text-xs md:text-sm leading-relaxed max-w-2xl">
                    Engineered robust backend microservices utilizing Java Spring Boot and Python FastAPI. Optimized complex database queries and pipelines, reducing latency by 30%.
                  </p>
                  <p className="mt-2 text-[11px] md:text-xs text-gray-400 leading-relaxed">
                    {['Java Spring Boot', 'FastAPI', 'PostgreSQL', 'Kafka', 'Docker'].map((tech, i, all) => (
                      <React.Fragment key={tech}>
                        <span className="whitespace-nowrap">{tech}{i < all.length - 1 && ' ·'}</span>{' '}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
                <div className="w-full md:w-[260px] h-[150px] shrink-0">
                  <RouteMap from="Apr 2022" to="Jul 2023" />
                </div>
              </div>
            </motion.div>

            {/* Projects Section */}
            <div id="projects" className="flex justify-start md:justify-end items-center gap-4 md:gap-6 mb-10 md:mb-12">
              <h2 className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-gray-400">
                02. Selected Works
              </h2>
              <div className="h-[1px] w-8 md:w-12 bg-white/30"></div>
            </div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "100px" }}
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
            >
              {projectsData.map((project) => (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  onClick={() => setSelectedProject(project)}
                  onMouseEnter={() => setPlayingId(project.id)}
                  onMouseLeave={() => setPlayingId(null)}
                  className="group relative flex flex-col overflow-hidden bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm cursor-pointer hover:bg-white/[0.04] hover:border-white/25 hover:-translate-y-1 active:scale-[0.99] transition-[background-color,border-color,translate,scale] duration-500"
                >
                  {/* Media - still poster, demo animation plays on hover */}
                  <div className="relative aspect-video overflow-hidden bg-zinc-900 border-b border-white/10">
                    <img
                      src={project.poster}
                      alt={`${project.title} preview`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                    />
                    {project.image && playingId === project.id && (
                      <img
                        src={project.image}
                        alt={`${project.title} demo`}
                        className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                    {project.image && (
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
            </motion.div>

            {/* GitHub contribution heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ duration: 0.8, ease: transitionCurve }}
              className="mt-4 md:mt-6"
            >
              <ContributionHeatmap />
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-16 md:pt-20 pb-24 md:pb-32 px-8 md:px-16 lg:px-24 xl:px-32 flex flex-col items-center justify-center text-center">
          <p className="text-gray-400 text-[9px] md:text-[10px] tracking-[0.3em] uppercase mb-4 drop-shadow-md">Available for Fall 2026 roles</p>
          <a href="mailto:elumalaisanthakuma.d@northeastern.edu" className="text-2xl md:text-4xl text-white font-light hover:text-gray-300 active:scale-95 transition-all duration-300 pb-12 drop-shadow-lg">
            Let's talk.
          </a>
          <p className="text-gray-500 text-[8px] md:text-[9px] tracking-[0.2em] uppercase">© {new Date().getFullYear()} Dheepak Karan. All rights reserved.</p>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              variants={modernModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-5xl z-10"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 md:-top-14 md:right-0 w-10 h-10 rounded-full bg-black/50 md:bg-white/10 border border-white/20 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300 z-20 hover:rotate-90 cursor-pointer backdrop-blur-md"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {(selectedProject.image || selectedProject.poster) ? (
                <a 
                  href={selectedProject.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="View Project Repository"
                  className="block w-full h-auto cursor-pointer group"
                >
                  <img 
                    src={selectedProject.image || selectedProject.poster} 
                    alt={selectedProject.title} 
                    className="w-full h-auto rounded-xl md:rounded-3xl shadow-2xl border border-white/10 group-hover:border-white/30 group-hover:scale-[1.01] transition-all duration-500 ease-out object-cover md:object-contain bg-zinc-900/50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/40 rounded-xl md:rounded-3xl">
                     <span className="text-white text-xs tracking-widest uppercase border border-white px-4 py-2 bg-black/50 backdrop-blur-sm">View on GitHub</span>
                  </div>
                </a>
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