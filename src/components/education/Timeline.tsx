import React from 'react';
import { motion } from 'framer-motion';
import TimelineItem from './TimelineItem';
import { TimelineProps } from './types';

const Timeline: React.FC<TimelineProps> = ({ title, items, type }) => {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: type === 'education' ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-6" // Reduced margin
      >
        <h3 className="text-xl font-semibold inline-block bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          {title}
        </h3>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 opacity-30" />

        {/* Timeline items */}
        <div className="space-y-6"> {/* Reduced spacing between items */}
          {items.map((item, index) => (
            <TimelineItem
              key={index}
              item={item}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;