import React from 'react';
import { motion } from 'framer-motion';

const ProfileSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-start space-x-6"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 
          transition-transform hover:shadow-xl hover:shadow-white/10"
      >
        <img
          src="/profile.jpg"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      <div>
        <h3 className="text-2xl font-bold mb-2">DHEEPAK KARAN ES</h3>
        <p className="text-gray-400">Optimizing algorithms for scalability and efficiency.</p>
      </div>
    </motion.div>
  );
};

export default ProfileSection;