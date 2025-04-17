import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Eye, Mail, Github, Linkedin, Twitter, MapPin, Phone } from 'lucide-react';
import ResumeModal from './common/ResumeModal';

const Footer = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  
  const openCalendly = () => {
    window.open('https://calendly.com/your-username', '_blank');
  };

  return (
    <>
      <footer className="bg-black text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            {/* Left Side: Name and Summary */}
            <div className="space-y-1.5 max-w-md">
              <h3 className="text-sm font-semibold text-white">DHEEPAK KARAN ES</h3>
              <p className="text-[10px] text-gray-400">
              Aspiring AI Engineer pursuing a master’s in Electrical and Computer Engineering at Northeastern University, Boston, with a strong foundation in Java, Spring Boot, and machine learning. Experienced in building data-driven microservices and AI solutions across domains. Passionate about geospatial AI, remote sensing, and creating real-world intelligent systems.
              </p>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <MapPin size={12} />
                <span>Boston, US</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <Phone size={12} />
                <span>+91 8939553460</span>
              </div>
              <p className="text-[8px] text-gray-500 italic">
                This portfolio was built with AI assistance to showcase modern web development practices.
              </p>
            </div>

            {/* Right Side: Sections */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
              {/* Top Row: Availability and Let's Connect */}
              <div className="flex flex-row justify-between gap-4 w-full">
                {/* Availability */}
                <div className="space-y-1.5 w-1/2">
                  <h3 className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                    Availability
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-green-400 text-[10px]">Available for Projects</span>
                    </div>
                    <p className="text-gray-400 text-[10px]">Response within 24h</p>
                    <p className="text-gray-500 text-[8px]">Mon-Fri, 9 AM - 5 PM IST</p>
                  </div>
                </div>

                {/* Let's Connect */}
                <div className="space-y-1.5 w-1/2">
                  <h3 className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                    Let's Connect
                  </h3>
                  <div className="flex flex-col gap-1">
                    <a
                      href="mailto:dheepakkaranes@gmail.com"
                      className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-[10px] group"
                    >
                      <div className="p-1 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                        <Mail size={12} className="text-gray-300" />
                      </div>
                      <span>dheepakkaranes@gmail.com</span>
                    </a>
                    <div className="flex items-center gap-1.5">
                      <a
                        href="https://github.com/dheepakkaran"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <Github size={12} className="text-gray-300" />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/dheepakkaran/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <Linkedin size={12} className="text-gray-300" />
                      </a>
                      <a
                        href="https://twitter.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <Twitter size={12} className="text-gray-300" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Together */}
              <div className="space-y-1.5 w-full">
                <h3 className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                  Work Together
                </h3>
                <div className="flex flex-col gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openCalendly}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-[10px] font-medium transition-colors"
                  >
                    <Calendar size={12} />
                    <span>Schedule a Call</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsResumeOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-white text-[10px] font-medium transition-colors"
                  >
                    <Eye size={12} />
                    <span>View Resume</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
};

export default Footer; 