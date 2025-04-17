import React from 'react';
import TimelineGrid from './education/TimelineGrid';

const EducationSection = () => {
  return (
    <section id="education" className="py-8 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Timeline Grid */}
        <TimelineGrid />
      </div>
    </section>
  );
};

export default EducationSection;