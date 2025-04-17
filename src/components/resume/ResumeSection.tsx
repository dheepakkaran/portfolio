import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import ResumePreview from './ResumePreview';

const ResumeSection = () => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Resume</h3>
      <p className="text-gray-400 mb-4">
        Get a detailed overview of my skills and experience.
      </p>
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPreview(true)}
          className="flex-1 px-8 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
        >
          <Eye size={20} />
          Quick View
        </motion.button>
        
        <motion.a
          href="/path-to-your-resume.pdf"
          download
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-8 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
        >
          <Download size={20} />
          Download CV
        </motion.a>
      </div>

      <ResumePreview isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </div>
  );
};

export default ResumeSection;