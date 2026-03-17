import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, BookOpen, FileText, Mail } from 'lucide-react';

interface Props {
  activeView?: string;
  onMyStoryClick?: () => void;
  onTerminalClick?: () => void;
  onResumeClick?: () => void;
  onContactClick?: () => void;
}

export const RightSidebar = ({ activeView = 'intro', onMyStoryClick, onTerminalClick, onResumeClick, onContactClick }: Props) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const mobileVisible = activeView === 'intro';

  const desktopButtons = [
    { id: 'story',    label: 'My Story',      icon: BookOpen,     onClick: () => onMyStoryClick?.(),  style: 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/10' },
    { id: 'terminal', label: "Dheepak's OS",  icon: TerminalIcon, onClick: () => onTerminalClick?.(), style: 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.3)] hover:bg-gray-200' },
  ];

  const mobileButtons = [
    { id: 'story',    label: 'My Story',      icon: BookOpen,     onClick: () => onMyStoryClick?.(),  style: 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/10' },
    { id: 'terminal', label: "Dheepak's OS",  icon: TerminalIcon, onClick: () => onTerminalClick?.(), style: 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.3)] hover:bg-gray-200' },
    { id: 'resume',   label: 'Resume',        icon: FileText,     onClick: () => onResumeClick?.(),   style: 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/10' },
    { id: 'contact',  label: 'Contact',       icon: Mail,         onClick: () => onContactClick?.(),  style: 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/10' },
  ];

  const buildIcons = (buttons: typeof desktopButtons, isMobile = false) =>
    buttons.map((btn) => {
      const Icon = btn.icon;
      const isHovered = hoveredId === btn.id;

      return (
        <div
          key={btn.id}
          className="relative flex items-center"
          onMouseEnter={() => setHoveredId(btn.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Desktop hover tooltip */}
          <AnimatePresence>
            {isHovered && !isMobile && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute right-12 whitespace-nowrap text-xs font-medium text-white bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full pointer-events-none"
              >
                {btn.label}
              </motion.span>
            )}
          </AnimatePresence>

          <button
            onClick={btn.onClick}
            className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} rounded-full flex items-center justify-center transition-all duration-200 ${btn.style}`}
          >
            <Icon className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
          </button>
        </div>
      );
    });

  return (
    <>
      {/* Desktop — My Story + OS only, top-right */}
      <motion.nav
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="hidden md:flex fixed right-5 top-20 z-50 flex-col items-center gap-1"
      >
        <div className="w-px h-8 bg-white/20 mb-2" />
        {buildIcons(desktopButtons)}
        <div className="w-px h-8 bg-white/20 mt-2" />
      </motion.nav>

      {/* Mobile — minimized icons, top-right, fades when inside section */}
      <motion.nav
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: mobileVisible ? 1 : 0, x: mobileVisible ? 0 : 20, pointerEvents: mobileVisible ? 'auto' : 'none' }}
        transition={{ duration: 0.35 }}
        className="flex md:hidden fixed right-3 top-20 z-50 flex-col items-center gap-1"
      >
        {buildIcons(mobileButtons, true)}
      </motion.nav>
    </>
  );
};
