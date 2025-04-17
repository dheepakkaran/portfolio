import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <p className="text-gray-400 text-sm max-w-2xl mx-auto">
        A timeline of my professional growth and academic achievements
      </p>
    </motion.div>
  );
}

export default SectionHeader;