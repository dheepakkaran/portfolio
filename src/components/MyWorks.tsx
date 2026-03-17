import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Github, ExternalLink } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'PLC-Based Water Cooling System',
    short: 'Control system for power generator heat management.',
    description: 'Designed and implemented a PLC-based water cooling control system prototype for power generators. The system automates heat removal cycles, monitors temperature thresholds, and ensures power stability through Ladder Logic programming.',
    tags: ['PLC', 'Ladder Logic', 'LOGO Soft', 'Embedded'],
    github: '#',
    demo: '#',
    year: '2022',
  },
  {
    id: 2,
    title: 'Stock Revenue Insights',
    short: 'Tesla & GameStop stock analysis using Python.',
    description: 'Built a data pipeline to extract, clean, and visualize stock price and revenue data for Tesla and GameStop. Used BeautifulSoup for web scraping, yfinance for real-time data, and Pandas/Matplotlib for analysis and visualization.',
    tags: ['Python', 'BeautifulSoup', 'yfinance', 'Pandas', 'Matplotlib'],
    github: 'https://github.com/dheepakkaran/dheepakkaran',
    demo: '#',
    year: '2023',
  },
  {
    id: 3,
    title: 'Policy Recommendation Chatbot',
    short: 'AI chatbot for personalized insurance policy suggestions.',
    description: 'Developed an AI-powered chatbot that recommends personalized insurance policies based on user input. Built with Spring Boot microservices architecture, integrated NLP for intent recognition, and deployed on AWS with SQS for message queuing.',
    tags: ['Spring Boot', 'Java', 'AWS', 'SQS', 'NLP'],
    github: '#',
    demo: '#',
    year: '2023',
  },
  {
    id: 4,
    title: 'Real-Time Object Detection',
    short: 'Live object detection pipeline with YOLOv8.',
    description: 'Built a real-time object detection system using YOLOv8 trained on a custom dataset. Processes live webcam feed at 30fps, draws bounding boxes with confidence scores, and supports multi-class detection with OpenCV visualization.',
    tags: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch', 'CUDA'],
    github: '#',
    demo: '#',
    year: '2024',
  },
  {
    id: 5,
    title: 'NLP Sentiment Analyzer',
    short: 'BERT-powered multi-class sentiment analysis API.',
    description: 'Fine-tuned a BERT model on product review datasets for multi-class sentiment classification (positive, negative, neutral). Exposed as a REST API via FastAPI, containerized with Docker, and integrated with a Streamlit dashboard for visualization.',
    tags: ['Python', 'BERT', 'Hugging Face', 'FastAPI', 'Docker', 'Streamlit'],
    github: '#',
    demo: '#',
    year: '2024',
  },
  {
    id: 6,
    title: 'Portfolio Website',
    short: 'Personal portfolio with dynamic animations & voice.',
    description: 'Designed and built a personal portfolio from scratch using React and TypeScript. Features include animated hero section, word-by-word story reveal with Web Speech API voice sync, terminal-style OS, and smooth page transitions using Framer Motion.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Web Speech API'],
    github: 'https://github.com/dheepakkaran',
    demo: '#',
    year: '2025',
  },
];

type Project = typeof projects[0];

interface Props {
  onBack: () => void;
}

export const MyWorks = ({ onBack }: Props) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const [slideDir, setSlideDir] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const total = projects.length;
  const prevIdx = (current - 1 + total) % total;
  const nextIdx = (current + 1) % total;

  const paginate = (dir: number) => {
    setSlideDir(dir);
    setCurrent((prev) => (prev + dir + total) % total);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) paginate(diff > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-16">

        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8 md:mb-10">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <span className="text-gray-500 text-xs uppercase tracking-widest">{current + 1} / {total}</span>
              </div>

              <p className="text-gray-500 uppercase tracking-[0.35em] text-xs mb-2">My Works</p>
              <h2 className="text-2xl md:text-5xl font-bold text-white mb-8 md:mb-10">Projects</h2>

              {/* ── MOBILE: single card + swipe ── */}
              <div className="md:hidden">
                <div
                  className="relative"
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current}
                      initial={{ opacity: 0, x: slideDir * 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: slideDir * -40 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      onClick={() => setSelected(projects[current])}
                      className="w-full rounded-2xl border border-white/20 bg-white/5 p-6 flex flex-col gap-4 cursor-pointer active:bg-white/10 transition-colors"
                    >
                      {/* Year + hint */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-[11px] uppercase tracking-widest">{projects[current].year}</span>
                        <span className="text-gray-600 text-[11px] uppercase tracking-widest">tap to explore →</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-white font-bold text-xl leading-snug">
                        {projects[current].title}
                      </h3>

                      {/* Divider */}
                      <div className="w-10 h-[1.5px] bg-white/30" />

                      {/* Short desc */}
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {projects[current].short}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto pt-1">
                        {projects[current].tags.slice(0, 4).map((t) => (
                          <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                            {t}
                          </span>
                        ))}
                        {projects[current].tags.length > 4 && (
                          <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500">
                            +{projects[current].tags.length - 4}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Swipe arrows */}
                  <div className="flex items-center justify-between mt-5">
                    <button
                      onClick={() => paginate(-1)}
                      className="w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center active:bg-white/20 transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    {/* Dots */}
                    <div className="flex gap-1.5">
                      {projects.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setSlideDir(i > current ? 1 : -1); setCurrent(i); }}
                          className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/20'}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => paginate(1)}
                      className="w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center active:bg-white/20 transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── DESKTOP: 3-card carousel ── */}
              <div className="hidden md:block">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => paginate(-1)}
                    className="shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="flex gap-4 flex-1 overflow-hidden">
                    {[prevIdx, current, nextIdx].map((idx, pos) => {
                      const p = projects[idx];
                      const isCenter = pos === 1;
                      return (
                        <motion.div
                          key={`${idx}-${pos}`}
                          animate={{ scale: isCenter ? 1 : 0.88, opacity: isCenter ? 1 : 0.4 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          onClick={() => isCenter && setSelected(p)}
                          className={`flex-1 rounded-xl border p-6 flex flex-col gap-3
                            ${isCenter
                              ? 'border-white/20 bg-white/5 cursor-pointer hover:bg-white/10'
                              : 'border-white/5 bg-white/[0.02] pointer-events-none'
                            }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-gray-600 text-xs">{p.year}</span>
                            {isCenter && <span className="text-gray-600 text-xs uppercase tracking-widest">click to explore</span>}
                          </div>
                          <h3 className="text-white font-semibold text-base md:text-lg leading-snug">{p.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed">{p.short}</p>
                          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                            {p.tags.slice(0, 3).map((t) => (
                              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">{t}</span>
                            ))}
                            {p.tags.length > 3 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500">+{p.tags.length - 3}</span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => paginate(1)}
                    className="shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-center gap-1.5 mt-6">
                  {projects.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`rounded-full transition-all ${i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>

            </motion.div>

          ) : (
            /* ── PROJECT DETAIL ── */
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest mb-8 md:mb-10 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> All Projects
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                {/* Left */}
                <div className="flex flex-col justify-center">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-600 text-xs mb-3 md:mb-4"
                  >
                    {selected.year}
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-2xl md:text-4xl font-bold text-white leading-tight mb-5 md:mb-6"
                  >
                    {selected.title}
                  </motion.h2>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="w-14 h-[2px] bg-white origin-left mb-5 md:mb-6"
                  />
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-sm leading-relaxed"
                  >
                    {selected.description}
                  </motion.p>
                </div>

                {/* Right */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-col gap-6 md:gap-8 justify-center"
                >
                  <div>
                    <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">Tools & Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.tags.map((t) => (
                        <span key={t} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">Links</p>
                    <div className="flex gap-3">
                      {selected.github !== '#' ? (
                        <a
                          href={selected.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-white text-black hover:bg-gray-200 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" /> GitHub
                        </a>
                      ) : (
                        <span className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed">
                          <Github className="w-3.5 h-3.5" /> Private Repo
                        </span>
                      )}
                      {selected.demo !== '#' && (
                        <a
                          href={selected.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
