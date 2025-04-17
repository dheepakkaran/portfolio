import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProfileSection from './about/ProfileSection';
import SkillGrid from './about/SkillGrid';
import CertificationsList from './about/CertificationsList';
import { Certification } from './about/types';

const AboutSection = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <section id="about" className="py-8 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-8 text-center"
        >
          About Me
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Profile, Summary, and Skills */}
          <div className="space-y-6">
            <ProfileSection />
            
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-lg text-gray-300"
              >
                Whispers of machines, tuned to the pulse of data, they dream in algorithms and sculpt the future. With minds entwined in neural whispers, they weave stories of intelligence unseen. In the symphony of code and cognition, they seek to unlock the mysteries of tomorrow through artificial vision.
              </motion.p>

              <div>
                <h3 className="text-xl font-semibold mb-3">Technical Skills</h3>
                <SkillGrid />
              </div>
            </div>
          </div>

          {/* Right Column: Certifications */}
          <CertificationsList
            onCertificationClick={setSelectedCert}
            selectedCertification={selectedCert}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;