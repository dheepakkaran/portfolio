import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ResumePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumePreview = ({ isOpen, onClose }: ResumePreviewProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto text-black p-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Resume Overview</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Quick Overview Section */}
            <div>
              <h4 className="text-xl font-semibold mb-3">Professional Summary</h4>
              <p className="text-gray-600">
                Senior Full Stack Developer with 5+ years of experience in building scalable web applications.
                Specialized in React, Node.js, and cloud technologies.
              </p>
            </div>

            {/* Key Skills */}
            <div>
              <h4 className="text-xl font-semibold mb-3">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'GraphQL'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Experience */}
            <div>
              <h4 className="text-xl font-semibold mb-3">Recent Experience</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold">Senior Software Engineer at Google</h5>
                  <p className="text-gray-600 text-sm">2020 - Present</p>
                  <p className="text-gray-600 mt-1">
                    Led development of cloud-based solutions and mentored junior developers.
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <h4 className="text-xl font-semibold mb-3">Education</h4>
              <div>
                <h5 className="font-semibold">Master of Computer Science</h5>
                <p className="text-gray-600">Stanford University, 2020</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResumePreview;