import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

const paragraphs = [
  { text: 'The Boy Who Listened to the Sky', center: true, bold: true },
  { text: `In a quiet village where streetlights flickered and radios spoke louder than textbooks, a little boy sat beside an old wooden window, wondering how voices from the clouds could predict the rain. That boy was me. I didn't have gadgets or Google, but I had questions — big ones. Why does the rain come when they say it will? How do they know? That mystery became my first spark.` },
  { text: `I wasn't born with privilege. My slippers were torn, my shirt too big, and my dreams too wild for the people around me. But even then, I wrote those dreams in dusty notebooks and believed, Success is not born from comfort, but from chaos and courage. I fought through doubts, rejections, and a world where English felt like a foreign land. From being told I wasn't good enough after scoring less in higher secondary to becoming one of the top performers in my college coding platform, I made one thing clear — I may bend, but I don't break.` },
  { text: `College wasn't just about classes. I built electric vehicles, solved coding challenges, danced on stage, played pivot for my football team, and clicked prize-winning photographs. Every moment shaped me — not just as an engineer, but as a human. Later, I worked in the IT world, where I created a personalized policy recommendation chatbot using AI. I wasn't just writing code; I was solving real problems.` },
  { text: `I took a bold risk by quitting my job to pursue a master's at IIT Madras, dedicating months of focused preparation — only to fall short of the GATE cutoff, with the next chance a year away. Rather than wait in limbo, I pivoted toward the USA. Exams had long been a personal struggle, and it took two determined attempts before I finally scored a 7 in IELTS. This breakthrough unlocked offers from leading universities in the US, Australia, and Ireland. I ultimately chose Northeastern University for my MS in Electrical and Computer Engineering, concentrating in Computer Vision, Machine Learning, and Algorithms — not just for its prestige, but because it embodies resilience, growth, and the power of transforming setbacks into milestones.` },
  { text: `I carry with me my village, my struggles, my silent tears, and my loud hopes. Because in the end, You're not where you come from, you're what you rise to become.` },
];

const fullText = paragraphs.map((p) => p.text).join(' ');

const allWords: { paraIndex: number; globalIndex: number; text: string }[] = [];
let gIdx = 0;
paragraphs.forEach((para, pi) => {
  para.text.split(' ').forEach((word) => {
    allWords.push({ paraIndex: pi, globalIndex: gIdx++, text: word });
  });
});
const totalWords = allWords.length;
const wordsByPara = paragraphs.map((_, pi) => allWords.filter((w) => w.paraIndex === pi));

interface Props {
  onBack: () => void;
}

export const MyStory = ({ onBack }: Props) => {
  const [revealedCount, setRevealedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const buildUtterance = () => {
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'en-US';
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    utterance.addEventListener('boundary', (e: SpeechSynthesisEvent) => {
      if (e.name !== 'word') return;
      const count = fullText.substring(0, e.charIndex).trim().split(/\s+/).filter(Boolean).length;
      setRevealedCount(count + 1);
    });
    utterance.addEventListener('end', () => {
      setRevealedCount(totalWords);
      setIsPlaying(false);
    });

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => v.lang === 'en-US' && (v.name.includes('Google') || v.name.includes('Samantha'))) ||
      voices.find((v) => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;

    return utterance;
  };

  const handlePlay = () => {
    if (!hasStarted) {
      // First play — start from beginning
      window.speechSynthesis.cancel();
      setRevealedCount(0);
      const utt = buildUtterance();
      utteranceRef.current = utt;
      window.speechSynthesis.speak(utt);
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      // Resume
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
  };

  const handleRestart = () => {
    window.speechSynthesis.cancel();
    setRevealedCount(0);
    setHasStarted(false);
    setIsPlaying(false);
    setTimeout(() => {
      const utt = buildUtterance();
      utteranceRef.current = utt;
      window.speechSynthesis.speak(utt);
      setIsPlaying(true);
      setHasStarted(true);
    }, 100);
  };

  const handleBack = () => {
    window.speechSynthesis.cancel();
    onBack();
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-start pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            {hasStarted && (
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : hasStarted ? 'Resume' : 'Listen'}
            </button>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-500 uppercase tracking-[0.35em] text-xs mb-2 md:mb-3"
        >
          My Story
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-2xl md:text-5xl font-bold text-white mb-6 md:mb-10 leading-snug"
        >
          The Boy Who<br />
          <span className="text-gray-500">Listened to the Sky.</span>
        </motion.h2>

        {/* Story text */}
        <div className="book-story text-white max-w-3xl"
          style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)', lineHeight: '1.95' }}
        >
          {paragraphs.map((para, pi) => (
            pi === 0 ? null : (
              <p
                key={pi}
                className="mb-4 md:mb-5 text-left sm:text-justify"
              >
                {wordsByPara[pi].map((w) => (
                  <span
                    key={w.globalIndex}
                    style={{
                      display: 'inline-block',
                      marginRight: '0.28em',
                      opacity: w.globalIndex < revealedCount ? 1 : 0.15,
                      transform: w.globalIndex < revealedCount ? 'translateY(0)' : 'translateY(6px)',
                      transition: 'opacity 0.18s ease-out, transform 0.18s ease-out',
                    }}
                  >
                    {w.text}
                  </span>
                ))}
              </p>
            )
          ))}
        </div>

      </div>
    </section>
  );
};
