import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { TimelineItem as TimelineItemType } from './types';

interface Props {
  item: TimelineItemType;
  index: number;
  type: 'education' | 'work';
}

const TimelineItem = ({ item, index, type }: Props) => {
  const colors = type === 'education' 
    ? { border: 'border-blue-400', text: 'text-blue-300', bg: 'from-blue-900/20 to-blue-800/10' }
    : { border: 'border-purple-400', text: 'text-purple-300', bg: 'from-purple-900/20 to-purple-800/10' };

  return (
    <motion.div
      initial={{ opacity: 0, x: type === 'education' ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="relative pl-8 group"
    >
      {/* Timeline dot */}
      <div 
        className={`absolute left-0 top-0 w-4 h-4 rounded-full border-2 ${colors.border} bg-black 
          group-hover:scale-125 transition-transform duration-300`} 
      />
      
      {/* Card */}
      <div className={`bg-gradient-to-br ${colors.bg} rounded-lg p-4 border border-white/10 
        group-hover:border-white/20 transition-colors`}>
        <div className="flex justify-between items-start mb-2">
          <h4 className={`text-base font-semibold ${colors.text}`}>{item.title}</h4>
          <span className="text-xs text-gray-400">{item.period}</span>
        </div>
        <p className="text-xs text-gray-400 mb-1">{item.institution || item.company}</p>
        <p className="text-xs text-gray-500">{item.description}</p>
        
        {item.achievements && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: "auto", opacity: 1 }}
            viewport={{ once: true }}
            className="mt-2 pt-2 border-t border-white/10"
          >
            <ul className="space-y-1">
              {item.achievements.map((achievement, i) => (
                <li key={i} className="text-xs text-gray-400 flex items-start gap-1">
                  <ArrowRight size={10} className={colors.text} className="mt-1 flex-shrink-0" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TimelineItem;