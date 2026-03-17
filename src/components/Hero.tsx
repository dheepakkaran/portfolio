import React from 'react';
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6 md:px-16 flex flex-row items-end gap-0">

        {/* LEFT — Text */}
        <div className="flex-1 flex flex-col items-start justify-center pb-12 md:pb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gray-500 uppercase tracking-[0.35em] text-xs mb-5"
          >
            AI Engineer · Researcher
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="text-[2.4rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] font-bold text-white leading-tight mb-6"
          >
            DHEEPAK<br />KARAN<br />
            <span className="text-gray-500">ES.</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="w-14 h-[2px] bg-white origin-left mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xs"
          >
            Empowering Tomorrow<br />with Smarter AI
          </motion.p>
        </div>

        {/* RIGHT — Profile photo, fades into bg at bottom */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-1 justify-end items-end self-end"
          style={{ maxHeight: '85vh' }}
        >
          <img
            src="/portfolio/assets/profile.jpeg"
            alt="Dheepak Karan"
            style={{
              height: 'clamp(42vh, 60vw, 82vh)',
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
