import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Certification } from './types';

interface Props {
  certification: Certification | null;
  onClose: () => void;
}

const CertificationModal = ({ certification, onClose }: Props) => {
  if (!certification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-black/80 rounded-lg w-full max-w-2xl p-6 border border-white/10"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">{certification.title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          <div className="space-y-4">
            <img
              src={certification.image}
              alt={certification.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            
            <div>
              <p className="text-gray-300 mb-4">{certification.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">{certification.date}</span>
                <a
                  href={certification.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-gray-300"
                >
                  <span>Verify Badge</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CertificationModal;