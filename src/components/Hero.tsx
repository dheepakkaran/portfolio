import React from 'react';
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center pt-20 md:pt-20 -mt-10 md:mt-0">
      <div className="container mx-auto px-4 md:px-16 flex flex-row items-end gap-0 w-full">

        {/* LEFT — Text */}
        <div className="flex-1 flex flex-col items-start justify-center pb-10 md:pb-20 pl-4 md:pl-0 self-start md:self-end pt-8 md:pt-0">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gray-500 uppercase tracking-[0.2em] text-[9px] md:text-xs mb-4 md:mb-5 whitespace-nowrap"
          >
            AI Engineer · Researcher
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="text-[1.9rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] font-bold text-white leading-tight mb-5 md:mb-6"
          >
            DHEEPAK<br />KARAN<br />
            <span className="text-gray-500">ES.</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="w-10 md:w-14 h-[2px] bg-white origin-left mb-4 md:mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-[140px] md:max-w-xs"
          >
            Empowering Tomorrow<br />with Smarter AI
          </motion.p>
        </div>

        {/* RIGHT — Profile photo, fades into bg at bottom */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-1 justify-end items-end self-end pr-2 md:pr-0 translate-y-10 md:translate-y-0"
          style={{ maxHeight: '85vh' }}
        >
          <img
            src="/portfolio/assets/profile.jpeg"
            alt="Dheepak Karan"
            style={{
              height: 'clamp(40vh, 56vw, 82vh)',
              width: 'auto',
              objectFit: 'cover',
              objectPosition: 'top',
              WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
            }}
          />
        </motion.div>

      </div>
    </section>
  );
};
