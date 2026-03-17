import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, Briefcase, Code2, ExternalLink } from 'lucide-react';

const education = [
  {
    degree: 'MS — Electrical & Computer Engineering',
    school: 'Northeastern University',
    detail: 'Computer Vision · Machine Learning · Algorithms',
    year: '2025 –',
  },
  {
    degree: 'BE — Electrical & Electronics Engineering',
    school: 'Anna University',
    detail: 'Circuit Design · Embedded Systems · Control',
    year: '2018 – 2022',
  },
];

const experience = [
  {
    role: 'Java Developer',
    company: 'Guardian India (MNC)',
    detail: 'Built AI-powered policy recommendation chatbot. Scalable microservices on AWS.',
    tags: ['Spring Boot', 'Java', 'AWS'],
  },
];

const skills = [
  { group: 'AI / ML', items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Hugging Face', 'OpenCV', 'YOLOv8'] },
  { group: 'Backend', items: ['Spring Boot', 'FastAPI', 'Flask', 'Docker', 'AWS'] },
  { group: 'Data', items: ['Python', 'Pandas', 'NumPy', 'MLflow', 'W&B'] },
];

const socials = [
  { label: 'LinkedIn',   href: 'https://www.linkedin.com/in/dheepak-karan-es/' },
  { label: 'GitHub',     href: 'https://github.com/dheepakkaran' },
  { label: 'X',          href: 'https://x.com/dheepakkaran' },
  { label: 'LeetCode',   href: 'https://leetcode.com/u/___ka__ran___/' },
  { label: 'NeetCode',   href: 'https://neetcode.io/' },
  { label: 'HackerRank', href: 'https://www.hackerrank.com/dheepakkaranes' },
  { label: 'Medium',     href: 'https://medium.com/@dheepakkaranes' },
];

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

interface Props {
  onBack: () => void;
}

export const AboutMe = ({ onBack }: Props) => {
  return (
    <section className="min-h-screen flex items-start md:items-center pt-20 pb-8">
      <div className="container mx-auto px-6 md:px-16 w-full">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest mb-6 md:mb-10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </motion.button>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
        >
          {/* LEFT — Identity */}
          <div className="flex flex-col justify-center">
            <motion.p variants={item} className="text-gray-500 uppercase tracking-[0.35em] text-xs mb-3">
              About Me
            </motion.p>

            <motion.h1 variants={item} className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3">
              DHEEPAK<br />KARAN<br />
              <span className="text-gray-500">ES.</span>
            </motion.h1>

            <motion.div variants={item} className="w-14 h-[2px] bg-white mb-4" />

            <motion.p variants={item} className="text-gray-400 text-sm leading-relaxed mb-5 max-w-sm">
              AI Engineer & Researcher pursuing MS at Northeastern University.
              Passionate about Computer Vision, Machine Learning, and building
              systems that solve real-world problems.
            </motion.p>

            {/* Social links */}
            <motion.div variants={item} className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 rounded-full transition-all"
                >
                  {s.label} <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Details */}
          <div className="flex flex-col gap-5 md:gap-7">

            {/* Education */}
            <motion.div variants={item}>
              <div className="flex items-center gap-2 text-white text-xs uppercase tracking-widest mb-3">
                <GraduationCap className="w-4 h-4" /> Education
              </div>
              <div className="flex flex-col gap-3 border-l border-white/10 pl-4">
                {education.map((e) => (
                  <div key={e.degree}>
                    <p className="text-white text-sm font-semibold leading-snug">{e.degree}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{e.school} · {e.year}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{e.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div variants={item}>
              <div className="flex items-center gap-2 text-white text-xs uppercase tracking-widest mb-3">
                <Briefcase className="w-4 h-4" /> Experience
              </div>
              <div className="flex flex-col gap-3 border-l border-white/10 pl-4">
                {experience.map((e) => (
                  <div key={e.role}>
                    <p className="text-white text-sm font-semibold">{e.role}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{e.company}</p>
                    <p className="text-gray-600 text-xs mt-1">{e.detail}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {e.tags.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div variants={item}>
              <div className="flex items-center gap-2 text-white text-xs uppercase tracking-widest mb-3">
                <Code2 className="w-4 h-4" /> Skills
              </div>
              <div className="flex flex-col gap-2.5">
                {skills.map((s) => (
                  <div key={s.group} className="flex items-start gap-3">
                    <span className="text-gray-600 text-[10px] uppercase tracking-wider w-14 pt-0.5 shrink-0">{s.group}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {s.items.map((sk) => (
                        <span key={sk} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
