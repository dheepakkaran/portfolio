import React from 'react';
import { motion } from 'framer-motion';

const skills = [
  'Machine Learning',
  'Deep Learning',
  'Python',
  'TensorFlow',
  'PyTorch',
  'Scikit-learn',
  'Pandas',
  'NumPy',
  'Data Science'
];

const SkillGrid = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex flex-wrap gap-2"
    >
      {skills.map((skill) => (
        <span
          key={skill}
          className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-gray-300 border border-white/10 hover:bg-white/10 transition-colors"
        >
          {skill}
        </span>
      ))}
    </motion.div>
  );
};

export default SkillGrid;