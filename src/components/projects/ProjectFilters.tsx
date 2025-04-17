import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = ['All', 'Machine Learning', 'Web Development', 'Data Science'];

const ProjectFilters = ({ selectedFilter, onFilterChange }: Props) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {filters.map((filter) => (
        <motion.button
          key={filter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            selectedFilter === filter
              ? 'bg-white text-black'
              : 'bg-white/5 text-white hover:bg-white/10'
          }`}
        >
          {filter}
        </motion.button>
      ))}
    </div>
  );
};

export default ProjectFilters;