import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Hero } from './components/Hero';
import { MyStory } from './components/MyStory';
import { AboutMe } from './components/AboutMe';
import { MyWorks } from './components/MyWorks';
import { Achievements } from './components/Achievements';
import { Contact } from './components/Contact';
import { RightSidebar } from './components/RightSidebar';
import { Sidebar } from './components/Sidebar';
import { Resume } from './components/Resume';
import { TerminalSection } from './components/TerminalSection';
import { SEO } from './components/SEO';
import { ErrorBoundary } from './components/ErrorBoundary';

type View = 'intro' | 'story' | 'about' | 'resume' | 'works' | 'achievements' | 'contact' | 'terminal';

export function App() {
  const [view, setView] = useState<View>('intro');

  const goTo = (v: View) => setView(v);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <SEO
          title="Portfolio"
          description="Portfolio of Dheepak Developer, showcasing creative development and innovative solutions"
        />
        <div style={{ position: 'relative', backgroundColor: 'black', overflow: 'hidden' }} className="min-h-screen">

          {/* Blurred background */}
          <div style={{
            position: 'fixed',
            inset: '-30px',
            backgroundImage: 'url(/portfolio/assets/profile.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(14px)',
            transform: 'scale(1.08)',
            zIndex: 0,
          }} />

          {/* Dark overlay */}
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.68)', zIndex: 1, pointerEvents: 'none' }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <RightSidebar activeView={view} onMyStoryClick={() => goTo('story')} onTerminalClick={() => goTo('terminal')} onResumeClick={() => goTo('resume')} onContactClick={() => goTo('contact')} />
            <Sidebar
              activeView={view}
              onHomeClick={() => goTo('intro')}
              onAboutClick={() => goTo('about')}
              onResumeClick={() => goTo('resume')}
              onWorksClick={() => goTo('works')}
              onAchievementsClick={() => goTo('achievements')}
              onContactClick={() => goTo('contact')}
            />
            <main>
              <AnimatePresence mode="wait">
                {view === 'intro' && (
                  <motion.div key="intro"
                    initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <Hero />
                  </motion.div>
                )}
                {view === 'story' && (
                  <motion.div key="story"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <MyStory onBack={() => goTo('intro')} />
                  </motion.div>
                )}
                {view === 'about' && (
                  <motion.div key="about"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <AboutMe onBack={() => goTo('intro')} />
                  </motion.div>
                )}
                {view === 'resume' && (
                  <motion.div key="resume"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <Resume onBack={() => goTo('intro')} />
                  </motion.div>
                )}
                {view === 'works' && (
                  <motion.div key="works"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <MyWorks onBack={() => goTo('intro')} />
                  </motion.div>
                )}
                {view === 'achievements' && (
                  <motion.div key="achievements"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <Achievements onBack={() => goTo('intro')} />
                  </motion.div>
                )}
                {view === 'contact' && (
                  <motion.div key="contact"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <Contact onBack={() => goTo('intro')} />
                  </motion.div>
                )}
                {view === 'terminal' && (
                  <motion.div key="terminal"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <TerminalSection onBack={() => goTo('intro')} />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
