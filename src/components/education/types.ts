export interface TimelineItem {
  title: string;
  institution?: string;
  company?: string;
  period: string;
  description: string;
  achievements?: string[];
}

export interface TimelineProps {
  title: string;
  items: TimelineItem[];
  type: 'education' | 'work';
}