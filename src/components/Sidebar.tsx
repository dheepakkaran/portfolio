import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  User,
  FileText,
  Briefcase,
  Trophy,
  Mail,
} from 'lucide-react';

const desktopItems = [
  { id: 'intro',        label: 'Home',         icon: Home },
  { id: 'about',        label: 'About Me',     icon: User },
  { id: 'resume',       label: 'Resume',       icon: FileText },
  { id: 'works',        label: 'My Works',     icon: Briefcase },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'contact',      label: 'Contact',      icon: Mail },
];

const mobileItems = [
  { id: 'intro',        label: 'Home',         icon: Home },
  { id: 'about',        label: 'About Me',     icon: User },
  { id: 'works',        label: 'My Works',     icon: Briefcase },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
];

interface Props {
  activeView?: string;
  onHomeClick?: () => void;
  onAboutClick?: () => void;
  onResumeClick?: () => void;
  onWorksClick?: () => void;
  onAchievementsClick?: () => void;
  onContactClick?: () => void;
}

export const Sidebar = ({ activeView = 'intro', onHomeClick, onAboutClick, onResumeClick, onWorksClick, onAchievementsClick, onContactClick }: Props) => {
  const [activeId, setActiveId] = useState('intro');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Keep activeId in sync with activeView from App
  useEffect(() => {
    setActiveId(activeView);
  }, [activeView]);

  const handleClick = (id: string) => {
    setActiveId(id);
    if (id === 'intro') { onHomeClick?.(); return; }
    if (id === 'about') { onAboutClick?.(); return; }
    if (id === 'resume') { onResumeClick?.(); return; }
    if (id === 'works') { onWorksClick?.(); return; }
    if (id === 'achievements') { onAchievementsClick?.(); return; }
    if (id === 'contact') { onContactClick?.(); return; }
  };

  // On mobile: hide when inside a section (not intro), show when on intro
  const mobileVisible = activeView === 'intro';

  const buildIcons = (items: typeof desktopItems, tooltipSide: 'left' | 'right' = 'left', isMobile = false) =>
    items.map((item) => {
      const Icon = item.icon;
      const isActive = activeId === item.id;
      const isHovered = hoveredId === item.id;

      return (
        <div
          key={item.id}
          className="relative flex items-center"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Desktop hover tooltip */}
          <AnimatePresence>
            {isHovered && !isMobile && (
              <motion.span
                initial={{ opacity: 0, x: tooltipSide === 'left' ? 8 : -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tooltipSide === 'left' ? 8 : -8 }}
                transition={{ duration: 0.18 }}
                className={`absolute whitespace-nowrap text-xs font-medium text-white bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full pointer-events-none z-10 ${tooltipSide === 'left' ? 'left-12' : 'right-12'}`}
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Mobile permanent label — always visible to the right */}
          {isMobile && (
            <span
              className={`absolute whitespace-nowrap text-[10px] font-medium pointer-events-none z-10 left-12
                ${isActive ? 'text-white' : 'text-gray-500'}`}
            >
              {item.label}
            </span>
          )}

          <button
            onClick={() => handleClick(item.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200
              ${isActive
                ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        </div>
      );
    });

  return (
    <>
      {/* Desktop — all icons, vertical left sidebar centered */}
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-1"
      >
        <div className="w-px h-8 bg-white/20 mb-2" />
        {buildIcons(desktopItems, 'left')}
        <div className="w-px h-8 bg-white/20 mt-2" />
      </motion.nav>

      {/* Mobile — 4 icons only, bottom-left */}
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: mobileVisible ? 1 : 0, x: mobileVisible ? 0 : -20, pointerEvents: mobileVisible ? 'auto' : 'none' }}
        transition={{ duration: 0.35 }}
        className="flex md:hidden fixed left-4 bottom-2 z-50 flex-col items-center gap-1"
      >
        <div className="w-px h-6 bg-white/20 mb-1" />
        {buildIcons(mobileItems, 'left', true)}
        <div className="w-px h-6 bg-white/20 mt-1" />
      </motion.nav>
    </>
  );
};
