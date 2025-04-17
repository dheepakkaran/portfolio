import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal = ({ isOpen, onClose }: ResumeModalProps) => {
  if (!isOpen) return null;

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('/resume.pdf', '_blank');
  };

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
            className="fixed inset-0 z-50 flex flex-col items-center p-2 sm:p-4 md:p-8"
          >
            {/* Header */}
            <div className="w-full max-w-5xl flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-white font-semibold text-sm sm:text-base">Resume</h3>
              <div className="flex items-center gap-2 sm:gap-4">
                <a
                  href="/resume.pdf"
                  onClick={handleDownload}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white text-xs sm:text-sm transition-colors"
                >
                  <Download size={14} className="sm:w-4 sm:h-4 w-3 h-3" />
                  <span>Download</span>
                </a>
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} className="sm:w-6 sm:h-6 w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="w-full h-full max-w-5xl bg-white rounded-lg overflow-hidden">
              {/* Desktop PDF Viewer */}
              <div className="hidden md:block w-full h-full min-h-[80vh]">
                <iframe
                  src="/resume.pdf"
                  className="w-full h-full"
                  title="Resume Preview"
                />
              </div>

              {/* Mobile PDF Viewer */}
              <div className="md:hidden w-full h-full min-h-[60vh] flex items-center justify-center bg-gray-100">
                <div className="text-center p-4">
                  <p className="text-gray-600 text-sm mb-2">Viewing PDF in mobile browser</p>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm transition-colors"
                  >
                    <ExternalLink size={14} />
                    <span>Open PDF</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResumeModal; 