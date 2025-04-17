import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { Certification } from './types';

interface Props {
  certification: Certification;
  onClick: () => void;
}

const CertificationCard: React.FC<Props> = ({ certification, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 p-4 rounded-lg cursor-pointer border border-white/10 hover:bg-white/10 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <Award className="w-6 h-6 text-white" />
        <ExternalLink className="w-4 h-4 text-gray-400" />
      </div>
      
      <h4 className="text-base font-semibold mt-2 mb-1 text-white">{certification.title}</h4>
      <p className="text-gray-400 text-xs mb-1">{certification.issuer}</p>
      <p className="text-gray-500 text-xs">{certification.date}</p>
    </motion.div>
  );
};

export default CertificationCard;