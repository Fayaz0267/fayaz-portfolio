import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

export interface ExpertiseItem {
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
  themeColor: 'primary' | 'accent' | 'secondary';
  delay?: number;
}

interface ExpertiseCardProps {
  item: ExpertiseItem;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary/5 group-hover:bg-primary/10',
    border: 'border-primary/10 group-hover:border-primary/30',
    text: 'text-primary',
  },
  accent: {
    bg: 'bg-accent/5 group-hover:bg-accent/10',
    border: 'border-accent/10 group-hover:border-accent/30',
    text: 'text-accent',
  },
  secondary: {
    bg: 'bg-secondary/5 group-hover:bg-secondary/10',
    border: 'border-secondary/10 group-hover:border-secondary/30',
    text: 'text-secondary',
  }
};

const ExpertiseCardComponent: React.FC<ExpertiseCardProps> = ({ item }) => {
  const { icon: Icon, title, description, tags, themeColor, delay = 0 } = item;
  const classes = colorClasses[themeColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={`bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 shadow-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-2xl hover:${classes.border} hover:-translate-y-2 transition-all duration-500 rounded-3xl p-8 relative overflow-hidden group flex flex-col h-full`}
    >
      <div className={`w-16 h-16 rounded-2xl ${classes.bg} flex items-center justify-center mb-6 border ${classes.border} transition-all duration-300`}>
        <Icon className={`w-8 h-8 ${classes.text} group-hover:scale-110 transition-transform duration-300`} />
      </div>
      <h4 className="text-xl font-bold text-dark dark:text-white mb-4 transition-colors">{title}</h4>
      <p className="text-dark/70 dark:text-slate-300 text-sm leading-relaxed mb-6 font-sans flex-grow transition-colors">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono tracking-wider font-semibold uppercase px-2.5 py-1 bg-black/5 dark:bg-slate-700/60 text-dark/80 dark:text-slate-200 border border-black/5 dark:border-white/10 rounded-lg transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export const ExpertiseCard = React.memo(ExpertiseCardComponent);
export default ExpertiseCard;
