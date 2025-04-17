import React from 'react';
import { motion } from 'framer-motion';
import CertificationCard from './CertificationCard';
import CertificationModal from './CertificationModal';
import { certifications } from './certifications';
import { Certification } from './types';

interface Props {
  onCertificationClick: (cert: Certification) => void;
  selectedCertification: Certification | null;
}

const CertificationsList = ({ onCertificationClick, selectedCertification }: Props) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Certifications</h3>
      <div className="grid grid-cols-2 gap-3 max-w-lg">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <CertificationCard
              certification={cert}
              onClick={() => onCertificationClick(cert)}
            />
          </motion.div>
        ))}
      </div>
      
      <CertificationModal
        certification={selectedCertification}
        onClose={() => onCertificationClick(null)}
      />
    </div>
  );
};

export default CertificationsList;