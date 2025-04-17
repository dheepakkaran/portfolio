import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Mail } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleModal = ({ isOpen, onClose }: ScheduleModalProps) => {
  const openCalendly = () => {
    window.open('https://calendly.com/your-username', '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-black/80 backdrop-blur-md rounded-xl border border-white/10 p-6 max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Schedule a Call</h3>
                <button
                  onClick={onClose}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock size={16} />
                    <span className="text-sm">30 minutes meeting</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar size={16} />
                    <span className="text-sm">Available Mon-Fri, 9 AM - 5 PM IST</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail size={16} />
                    <span className="text-sm">You'll receive a calendar invite</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400">
                  Let's discuss your project requirements, potential collaboration, 
                  or any questions you might have about my work.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openCalendly}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    Schedule on Calendly
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = 'mailto:your.email@example.com'}
                    className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    Send Email Instead
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ScheduleModal; 