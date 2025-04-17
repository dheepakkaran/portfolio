import React from 'react';
import { motion } from 'framer-motion';
import TimelineGrid from './TimelineGrid';
import SectionHeader from './SectionHeader';

const EducationSection = () => {
  return (
    <section id="education" className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader />
        <TimelineGrid />
      </div>
    </section>
  );
};

export default EducationSection;