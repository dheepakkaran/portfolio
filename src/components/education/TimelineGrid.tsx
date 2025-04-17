import React from 'react';
import { motion } from 'framer-motion';
import { education, experience } from './data';
import TimelineCard from './TimelineCard';
import { GraduationCap, Briefcase } from 'lucide-react';

const TimelineGrid = () => {
  return (
    <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 relative">
      {/* Connecting line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/50 via-white/30 to-transparent hidden lg:block" />
      
      {/* Education Section */}
      <div className="lg:pr-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Education</h3>
        </div>
        <div className="space-y-6">
          {education.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="w-full"
            >
              <TimelineCard item={item} type="education" align="right" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div className="lg:pl-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Experience</h3>
        </div>
        <div className="space-y-6">
          {experience.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="w-full"
            >
              <TimelineCard item={item} type="work" align="left" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineGrid;