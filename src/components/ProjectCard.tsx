import React from 'react';
import { Zap, Github, Clock, Code, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export interface ProjectStats {
  devTime: string;
  linesCount: string;
  difficultyLabel: string;
  difficulty: number;
}

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  stats?: ProjectStats;
  demoUrl?: string;
  githubUrl?: string;
}

interface ProjectCardProps {
  project: Project;
  idx: number;
  totalProjects: number;
  onOpenLiveDemo: (title: string) => void;
  onOpenGithub: (title: string) => void;
  onSelectProject?: (project: Project) => void;
}

const ProjectCardComponent: React.FC<ProjectCardProps> = ({
  project,
  idx,
  totalProjects,
  onOpenLiveDemo,
  onOpenGithub,
  onSelectProject,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
      transition={{
        duration: 0.55,
        ease: [0.21, 0.47, 0.32, 0.98],
        delay: (idx % 2) * 0.1,
      }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
      className="bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden hover:border-primary/40 shadow-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-2xl transition-all duration-300 flex flex-col h-full group"
    >
      <div 
        className="relative h-48 overflow-hidden bg-black/5 dark:bg-slate-900 cursor-pointer"
        onClick={() => onSelectProject?.(project)}
      >
        <img
          src={project.image}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
        
        {/* Floating index badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-black/10 dark:border-white/15 text-[10px] font-mono text-primary font-bold shadow-sm">
          0{idx + 1} / 0{totalProjects}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow space-y-4">
        <h4 
          onClick={() => onSelectProject?.(project)}
          className="text-xl font-bold tracking-tight text-dark dark:text-white transition-colors cursor-pointer hover:text-primary dark:hover:text-primary-light"
        >
          {project.title}
        </h4>
        
        <p className="text-dark/70 dark:text-slate-300 text-sm leading-relaxed flex-grow transition-colors">
          {project.description}
        </p>

        {project.stats && (
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-black/[0.02] dark:bg-slate-900/60 border border-black/5 dark:border-white/10 text-[10px] font-mono text-dark/60 dark:text-slate-400 select-none">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{project.stats.devTime}</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-r border-black/10 dark:border-white/10 px-3">
              <Code className="w-3.5 h-3.5 text-accent" />
              <span>{project.stats.linesCount} lines</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-secondary" />
              <span className="font-bold text-dark/80 dark:text-slate-200">{project.stats.difficultyLabel}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 py-2">
          {project.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-slate-700/60 border border-black/5 dark:border-white/10 text-dark/80 dark:text-slate-200">
              {tag}
            </span>
          ))}
        </div>

        <div className={`grid ${project.demoUrl ? 'grid-cols-2' : 'grid-cols-1'} gap-3 pt-2`}>
          {project.demoUrl && (
            <button
              onClick={() => onOpenLiveDemo(project.title)}
              className="px-4 py-2.5 bg-primary text-white hover:bg-dark dark:hover:bg-primary/80 font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-neon" />
              Live Demo
            </button>
          )}
          <button
            onClick={() => onOpenGithub(project.title)}
            className={`px-4 py-2.5 ${
              project.demoUrl
                ? 'bg-white dark:bg-slate-800 hover:bg-black/5 dark:hover:bg-slate-700 text-dark dark:text-white border border-black/10 dark:border-white/15'
                : 'bg-primary hover:bg-dark dark:hover:bg-primary/80 text-white'
            } font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-sm`}
          >
            <Github className="w-3.5 h-3.5" />
            Github Repo
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectCard = React.memo(ProjectCardComponent);
export default ProjectCard;
