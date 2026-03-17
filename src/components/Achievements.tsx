import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Users, Zap, Code2, Network, Star } from 'lucide-react';

const categories = [
  {
    id: 'leadership',
    label: 'Leadership & Honors',
    shortLabel: 'Leadership',
    icon: Trophy,
    items: [
      {
        title: 'AI for India — Guinness World Record Contributor',
        org: 'GUVI',
        year: '2023',
        description:
          'Collaborated with 1,00,000+ aspirants as part of the AI for India initiative by GUVI to learn and build a face recognition model at scale — contributing to a Guinness World Record for the largest AI learning event.',
      },
      {
        title: 'Volunteer Programming Instructor',
        org: 'Family-Driven School',
        year: '2024 – 2025',
        description:
          'Volunteered at a family-driven school supporting programming lab sessions, assisting students with foundational coding concepts, and helping maintain basic academic and financial records.',
      },
    ],
  },
  {
    id: 'extracurricular',
    label: 'Extra Curricular',
    shortLabel: 'Extra',
    icon: Star,
    items: [
      {
        title: 'Football Team — Pivot Player',
        org: 'College Sports Team',
        year: '2018 – 2022',
        description:
          'Played as pivot for the college football team, participating in inter-department and inter-college tournaments. Developed strong teamwork and leadership under pressure.',
      },
      {
        title: 'Prize-Winning Photographer',
        org: 'College Cultural Events',
        year: '2019 – 2022',
        description:
          'Captured award-winning photographs at college cultural fests and events. Recognized for creative composition and technical precision in photography competitions.',
      },
      {
        title: 'Stage Performer — Cultural Fest',
        org: 'College Annual Day',
        year: '2019 – 2021',
        description:
          'Performed on stage during college annual day and cultural events, demonstrating confidence, creativity, and the ability to engage an audience.',
      },
    ],
  },
  {
    id: 'clubs',
    label: 'Club Activities',
    shortLabel: 'Clubs',
    icon: Users,
    items: [
      {
        title: 'AI / ML Interest Group Member',
        org: 'College Tech Club',
        year: '2020 – 2022',
        description:
          'Active member of the AI/ML interest group — participated in workshops, paper reading sessions, and internal hackathons focused on machine learning applications.',
      },
      {
        title: 'EV Project Team — Electric Vehicle Build',
        org: 'Engineering Club',
        year: '2021',
        description:
          'Collaborated in a cross-functional team to design and build an electric vehicle prototype, handling electrical system design, circuit integration, and performance testing.',
      },
    ],
  },
  {
    id: 'hackathons',
    label: 'Hackathons & Coding',
    shortLabel: 'Coding',
    icon: Code2,
    items: [
      {
        title: 'Top Performer — College Coding Platform',
        org: 'Internal Ranking',
        year: '2020 – 2022',
        description:
          'Ranked among the top performers on the college coding platform, consistently solving algorithmic challenges across data structures, dynamic programming, and system design.',
      },
      {
        title: 'HackerRank Problem Solver',
        org: 'HackerRank',
        year: 'Ongoing',
        description:
          'Actively solving challenges on HackerRank across domains including Python, Java, SQL, and algorithms. Maintained consistent streaks and earned skill badges.',
      },
      {
        title: 'LeetCode Competitive Coder',
        org: 'LeetCode',
        year: 'Ongoing',
        description:
          'Regular participant on LeetCode, focusing on medium-to-hard level problems in arrays, graphs, and dynamic programming to sharpen problem-solving skills.',
      },
    ],
  },
  {
    id: 'networking',
    label: 'Networking Events',
    shortLabel: 'Network',
    icon: Network,
    items: [
      {
        title: 'IBM AI Engineering Professional Certificate',
        org: 'IBM / Coursera',
        year: '2023',
        description:
          'Completed the IBM AI Engineering Professional Certificate — covering deep learning, computer vision, NLP, and model deployment using TensorFlow and PyTorch.',
      },
      {
        title: 'Tech Community Contributor',
        org: 'Medium / LinkedIn',
        year: 'Ongoing',
        description:
          'Sharing insights on AI/ML trends, project learnings, and career experiences through Medium articles and LinkedIn posts — building a network of like-minded engineers and researchers.',
      },
    ],
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

interface Props {
  onBack: () => void;
}

export const Achievements = ({ onBack }: Props) => {
  const [activeTab, setActiveTab] = useState('leadership');
  const activeCategory = categories.find((c) => c.id === activeTab)!;

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-8">
      <div className="container mx-auto px-6 md:px-16">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest mb-6 md:mb-10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </motion.button>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-500 uppercase tracking-[0.35em] text-xs mb-2"
        >
          Achievements
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-2xl md:text-5xl font-bold text-white mb-6 md:mb-8"
        >
          Honors & Activities
        </motion.h2>

        {/* Tabs — horizontally scrollable on mobile, wrap on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 md:mb-8"
        >
          {/* Mobile: icon-only tabs in a single scrollable row */}
          <div className="flex md:hidden gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all border shrink-0
                    ${isActive
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-gray-400 border-white/10'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Desktop: wrapped tabs with full labels */}
          <div className="hidden md:flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                    ${isActive
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon className="w-3 h-3" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Active category label on mobile */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeTab + '-label'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex md:hidden text-white text-xs uppercase tracking-widest mb-4"
          >
            {activeCategory.label}
          </motion.p>
        </AnimatePresence>

        {/* Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={container}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
          >
            {activeCategory.items.map((entry, i) => (
              <motion.div
                key={i}
                variants={item}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 md:p-5 flex flex-col gap-2 hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white text-sm font-semibold leading-snug">{entry.title}</h3>
                  <span className="text-gray-600 text-[10px] shrink-0 mt-0.5">{entry.year}</span>
                </div>
                <p className="text-gray-500 text-[11px] uppercase tracking-wider">{entry.org}</p>
                <p className="text-gray-400 text-xs leading-relaxed mt-1">{entry.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
