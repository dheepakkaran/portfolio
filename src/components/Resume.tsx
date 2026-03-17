import { motion } from 'framer-motion';
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const Resume = ({ onBack }: Props) => {
  return (
    <section className="min-h-screen flex flex-col pt-20 pb-6">
      <div className="container mx-auto px-6 md:px-16 flex flex-col h-full flex-1">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </motion.button>

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            href="/portfolio/assets/resume.pdf"
            download="Dheepak_Karan_Resume.pdf"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-white text-black hover:bg-gray-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </motion.a>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-500 uppercase tracking-[0.35em] text-xs mb-1"
        >
          Resume
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-2xl md:text-4xl font-bold text-white mb-6"
        >
          Dheepak Karan ES.
        </motion.h2>

        {/* Desktop — PDF iframe */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="hidden md:flex flex-1 rounded-xl border border-white/10 overflow-hidden"
          style={{ minHeight: '70vh' }}
        >
          <iframe
            src="/portfolio/assets/resume.pdf"
            className="w-full h-full"
            style={{ minHeight: '70vh', border: 'none' }}
            title="Resume"
          />
        </motion.div>

        {/* Mobile — open/download buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex md:hidden flex-1 flex-col items-center justify-center gap-6"
        >
          {/* Icon */}
          <div className="w-24 h-24 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
            <FileText className="w-10 h-10 text-white/60" />
          </div>

          <div className="text-center">
            <p className="text-white font-semibold text-base mb-1">Dheepak_Karan_Resume.pdf</p>
            <p className="text-gray-500 text-xs">PDF Document</p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <a
              href="/portfolio/assets/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-sm font-semibold rounded-xl bg-white text-black hover:bg-gray-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View Resume
            </a>
            <a
              href="/portfolio/assets/resume.pdf"
              download="Dheepak_Karan_Resume.pdf"
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-sm font-semibold rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <Download className="w-4 h-4" /> Download PDF
            </a>
          </div>

          <p className="text-gray-600 text-[11px] text-center max-w-xs">
            Tap "View Resume" to open the PDF in your browser, or download it directly to your device.
          </p>
        </motion.div>

      </div>
    </section>
  );
};
