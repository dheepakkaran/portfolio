import React from 'react';
import { motion } from 'framer-motion';

const IntroSection = () => {
  return (
    <section
      id="intro"
      className="h-screen flex flex-col justify-center items-center bg-black text-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-4 space-y-6"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-wider"
        >
          DHEEPAK KARAN ES.
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-400"
        >
          Empowering Tomorrow with Smarter AI
        </motion.p>
      </motion.div>
    </section>
  );
};

export default IntroSection;