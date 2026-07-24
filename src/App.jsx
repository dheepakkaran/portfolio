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
    id: "tamiltech",
    title: "TamilTech-QA", 
    category: "Generative AI & NLP",
    tags: ["Llama 3.1 8B", "QLoRA", "PEFT", "HuggingFace", "Transformers"],
    desc: "A Tamil-English code-switched benchmark for technical Q&A with QLoRA fine-tuning and novel evaluation metrics (CSPS / TTR / TCF). Published on HuggingFace Hub.",
    image: "/storage-preview.png",
    link: "https://github.com/dheepakkaran/TamilTech-QA"
  },
  { 
    id: "storage",
    title: "Scalable File Storage", 
    category: "Cloud Infrastructure",
    tags: ["Java", "Spring Boot", "Docker", "AWS S3", "SHA-256"],
    desc: "Chunk-based cloud storage with SHA-256 validation. Engineered modular backend architecture using Docker for high availability.",
    image: "/storage.png", 
    link: "https://github.com/dheepakkaran/scalable-file-storage"
  },
  { 
    id: "orderflow",
    title: "OrderFlow Microservices", 
    category: "Real-time Event Engine",
    tags: ["Apache Kafka", "Java", "PostgreSQL", "Event-Driven"],
    desc: "Event-driven processing handling 50k+ transactions. Achieved 331 orders/second throughput.",
    image: "/orderflow.png",
    link: "https://github.com/dheepakkaran/order-flow"
  },
  { 
    id: "equity",
    title: "Equity-Agent API", 
    category: "Algorithmic Pipeline",
    tags: ["Python", "FastAPI", "Machine Learning", "PostgreSQL"],
    desc: "Automated trading pipelines with ML integration for portfolio management and prediction accuracy.",
    image: "/equity.png", 
    link: "https://github.com/dheepakkaran/equity-agent"
  }
];

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Block scrolling when any modal is open
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
    <div className="bg-black text-gray-200 min-h-screen font-sans selection:bg-gray-200 selection:text-black overflow-x-hidden relative">
      
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full z-0 bg-black">
        <video 
          autoPlay
          loop
          muted 
          playsInline
          src="./bg-video.mp4" 
          className="w-full h-full object-cover opacity-[0.45] saturate-[0.7]"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10">
        
        {/* Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: transitionCurve }}
          className="w-full p-6 md:p-12 flex justify-between items-center mix-blend-difference absolute top-0 z-50"
        >
          <div className="text-white font-semibold tracking-[0.15em] uppercase text-xs md:text-base drop-shadow-md">
            Dheepak Karan
          </div>
          <div className="space-x-10 text-[10px] tracking-[0.3em] uppercase hidden md:flex text-gray-400">
            <a href="#about" className="hover:text-white transition-colors duration-300">About</a>
            <a href="#experience" className="hover:text-white transition-colors duration-300">Experience</a>
            <a href="#projects" className="hover:text-white transition-colors duration-300">Projects</a>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center pt-28 pb-16 px-6 md:px-24">
          <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
            
            <motion.div 
              initial="hidden" animate="visible" 
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
              className="flex-1 w-full mt-8 md:mt-0"
            >
              <motion.div variants={fadeUp} className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="h-[1px] w-8 md:w-12 bg-white/30"></div>
                <p className="text-gray-400 tracking-[0.3em] uppercase text-[9px] md:text-[10px] drop-shadow-md">
                  Software Engineer
                </p>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-light text-white leading-[1.15] md:leading-[1.1] tracking-tighter mb-6 md:mb-8 drop-shadow-lg">
                Engineering <span className="text-gray-400 italic font-serif">scalable</span> <br/>
                backend systems.
              </motion.h1>

              <motion.p variants={fadeUp} className="text-gray-300 font-light text-sm md:text-base max-w-lg leading-relaxed mb-10 md:mb-12 drop-shadow-md border-l border-white/20 pl-5 md:pl-6">
                Quiet resilience. Navigating complexity and building robust APIs that withstand the storm. Always pushing for optimal performance and clean architecture.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-wrap gap-6 md:gap-8 items-center text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium">
                <button 
                  onClick={() => setIsResumeOpen(true)}
                  className="text-black bg-white px-6 md:px-8 py-3 md:py-4 hover:bg-gray-300 active:scale-95 transition-all duration-300 drop-shadow-lg w-full sm:w-auto text-center"
                >
                  View Resume
                </button>
                <a href="https://github.com/dheepakkaran" target="_blank" rel="noreferrer" className="text-white relative group pb-1 drop-shadow-md">
                  GitHub
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </a>
                <a href="https://linkedin.com/in/dheepakkaran" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300 pb-1 drop-shadow-md">
                  LinkedIn
                </a>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.4, ease: transitionCurve }}
              className="flex-1 w-full flex justify-center md:justify-end mt-12 md:mt-0"
            >
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[450px] aspect-[3/4] rounded-sm overflow-hidden group">
                <img 
                  src={profilePic} 
                  alt="Dheepak Karan" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none"></div>
                <div className="absolute inset-4 border border-white/20 scale-[0.98] group-hover:scale-100 transition-transform duration-700 pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-16 md:py-24 px-6 md:px-24">
          <div className="max-w-7xl w-full mx-auto">
            
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
                02. Selected Works
              </h2>
              <div className="h-[1px] w-8 md:w-12 bg-white/30"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }} 
              transition={{ duration: 0.8, ease: transitionCurve }}
              className="space-y-6 md:space-y-8"
            >
              {projectsData.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 hover:bg-white/[0.02] active:scale-[0.98] md:active:scale-100 md:px-4 cursor-pointer transition-all duration-300 rounded-xl group"
                >
                  <div className="flex-1">
                    <span className="text-[8px] md:text-[9px] tracking-[0.3em] text-gray-500 uppercase block mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-xl md:text-3xl font-light text-white tracking-tight mb-2 group-hover:translate-x-1 transition-transform duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed max-w-xl">
                      {project.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap md:justify-end gap-1.5 mt-2 md:mt-0 w-full md:max-w-[220px]">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-[8px] md:text-[9px] tracking-[0.1em] text-gray-400 uppercase px-2.5 py-1 bg-white/5 border border-white/10 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 md:py-32 px-6 md:px-24 flex flex-col items-center justify-center text-center">
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
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
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
                    href="/Dheepak_Karan_Resume.pdf" 
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

              <div className="w-full h-full bg-black/50">
                <iframe 
                  src="/Dheepak_Karan_Resume.pdf" 
                  title="Dheepak Karan Resume"
                  className="w-full h-full border-none"
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
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
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

              {selectedProject.image ? (
                <a 
                  href={selectedProject.link} 
                  target="_blank" 
                  rel="noreferrer"
                  title="View Project Repository"
                  className="block w-full h-auto cursor-pointer group"
                >
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title} 
                    className="w-full h-auto rounded-xl md:rounded-3xl shadow-2xl border border-white/10 group-hover:border-white/30 group-hover:scale-[1.01] transition-all duration-500 ease-out object-cover md:object-contain bg-zinc-900/50"
                  />
                </a>
              ) : (
                <div className="w-full aspect-video bg-zinc-900 border border-white/10 rounded-xl md:rounded-3xl flex items-center justify-center">
                  <p className="text-gray-500 text-xs md:text-sm tracking-[0.2em] uppercase text-center px-4">Photo varala mapla</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}