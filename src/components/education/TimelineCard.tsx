import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Award } from 'lucide-react';
import { TimelineItem as TimelineItemType } from './types';

interface Props {
  item: TimelineItemType;
  type: 'education' | 'work';
  align: 'left' | 'right';
}

const TimelineCard = ({ item, type, align }: Props) => {
  const statusBadge = item.period === 'Current' ? (
    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded-full">
      Current
    </span>
  ) : null;

  return (
    <div className={`relative w-full ${align === 'right' ? 'lg:pr-6' : 'lg:pl-6'}`}>
      {/* Connection dot */}
      <div className={`absolute top-4 ${align === 'right' ? 'lg:-right-2' : 'lg:-left-2'} w-3 h-3 rounded-full border-2 
        border-white/30 bg-black hidden lg:block`} />
      
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 
        transition-all duration-300 hover:border-white/20 group w-full">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-white group-hover:text-white/80">{item.title}</h4>
          <div className="flex items-center gap-2">
            {statusBadge}
            <span className="flex items-center text-[10px] text-gray-400 gap-1">
              <Calendar size={10} />
              {item.period}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
          <MapPin size={12} />
          <span>{item.institution || item.company}</span>
        </div>

        <p className="text-xs text-gray-400 mb-2">{item.description}</p>
        
        {item.achievements && (
          <div className="space-y-1">
            {item.achievements.map((achievement, i) => (
              <div key={i} className="flex items-start gap-1 text-[10px] text-gray-500">
                <Award size={10} className="mt-0.5 flex-shrink-0" />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineCard;