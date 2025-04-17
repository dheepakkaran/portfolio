import React from 'react';
import { 
  Code2, 
  Database, 
  Cloud, 
  Layout, 
  Terminal, 
  Cpu, 
  Box, 
  GitBranch,
  Server,
  Globe
} from 'lucide-react';

const icons = [
  { Icon: Code2, position: 'top-1/4 left-10', opacity: '0.03', size: 48 },
  { Icon: Database, position: 'top-1/3 right-16', opacity: '0.02', size: 56 },
  { Icon: Cloud, position: 'bottom-1/4 left-20', opacity: '0.03', size: 52 },
  { Icon: Layout, position: 'top-20 left-1/3', opacity: '0.02', size: 44 },
  { Icon: Terminal, position: 'bottom-16 right-1/4', opacity: '0.03', size: 50 },
  { Icon: Cpu, position: 'top-1/2 right-32', opacity: '0.02', size: 46 },
  { Icon: Box, position: 'bottom-32 left-1/4', opacity: '0.02', size: 54 },
  { Icon: GitBranch, position: 'top-16 right-1/3', opacity: '0.03', size: 48 },
  { Icon: Server, position: 'bottom-1/3 right-16', opacity: '0.02', size: 52 },
  { Icon: Globe, position: 'top-3/4 left-16', opacity: '0.03', size: 46 }
];

const SkillBackgroundIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, position, opacity, size }, index) => (
        <div
          key={index}
          className={`absolute ${position}`}
          style={{ opacity }}
        >
          <Icon size={size} />
        </div>
      ))}
    </div>
  );
};

export default SkillBackgroundIcons;