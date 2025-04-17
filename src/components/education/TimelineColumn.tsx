import React from 'react';
import { LucideIcon } from 'lucide-react';
import TimelineItem from './TimelineItem';
import { TimelineItem as TimelineItemType } from './types';

interface Props {
  title: string;
  icon: LucideIcon;
  items: TimelineItemType[];
  type: 'education' | 'work';
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const TimelineColumn = ({ title, icon: Icon, items, type, iconColor, gradientFrom, gradientTo }: Props) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} 
          flex items-center justify-center border border-white/10`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <h3 className={`text-xl font-bold ${iconColor}`}>{title}</h3>
      </div>

      <div className="relative">
        <div className={`absolute left-2 top-0 bottom-0 w-[1px] bg-gradient-to-b 
          ${type === 'education' ? 'from-blue-500/50 via-blue-400/30' : 'from-purple-500/50 via-purple-400/30'} 
          to-transparent`} />
        
        <div className="space-y-6">
          {items.map((item, index) => (
            <TimelineItem
              key={index}
              item={item}
              index={index}
              type={type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};