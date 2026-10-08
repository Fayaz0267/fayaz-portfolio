import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { LightProject, LIGHT_PROJECTS } from '../config/site';
import CircularGallery from './CircularGallery';

function QuickView({ project, onClose }: { project: LightProject; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={project.title} className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden">
        <div className="h-36 w-full overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-8">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-black text-dark dark:text-white">{project.title}</h3>
            <button type="button" onClick={onClose} aria-label="Close" className="p-2 -mt-2 -mr-2 rounded-lg text-dark/50 dark:text-slate-400 hover:text-dark dark:hover:text-white cursor-pointer flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-sm text-dark/70 dark:text-slate-300 leading-relaxed">{project.summary}</p>

          <div className="flex flex-wrap gap-2 mt-5">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/[0.04] dark:bg-white/10 text-dark/70 dark:text-slate-300">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-7">
            {project.caseStudyId && (
              <Link
                to={`/work/${project.caseStudyId}`}
                className="px-5 py-2.5 rounded-full text-white text-sm font-bold flex items-center gap-2"
                style={{ backgroundColor: project.accent }}
              >
                Read the case study
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full border border-black/15 dark:border-white/15 text-dark dark:text-white text-sm font-bold flex items-center gap-2 hover:border-primary/50 transition-colors">
                Live demo
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full border border-black/15 dark:border-white/15 text-dark dark:text-white text-sm font-bold flex items-center gap-2 hover:border-primary/50 transition-colors">
                <Github className="w-4 h-4" />
                Source
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** The "Things I've Built" section: a drag/scroll 3D cover carousel. Click a cover for a quick look. */
export default function InteractiveProjects() {
  const { theme } = useTheme() as any;
  const isDark = theme === 'dark';

  const [category, setCategory] = useState('All');
  const [active, setActive] = useState<LightProject | null>(null);

  const categories = useMemo(() => ['All', ...Array.from(new Set(LIGHT_PROJECTS.map((p) => p.category)))], []);
  const filtered = useMemo(
    () => (category === 'All' ? LIGHT_PROJECTS : LIGHT_PROJECTS.filter((p) => p.category === category)),
    [category]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-10" role="group" aria-label="Filter projects by category">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
              category === cat
                ? 'bg-dark dark:bg-primary text-white border-transparent shadow-md'
                : 'bg-white dark:bg-slate-800 text-dark/70 dark:text-slate-300 border-black/10 dark:border-white/10 hover:border-primary/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative h-[420px] sm:h-[480px] w-full rounded-3xl bg-white dark:bg-slate-800/90 border border-black/15 dark:border-white/10 shadow-xl overflow-hidden">
        <div className="absolute top-4 left-6 right-6 z-10 flex items-center justify-between text-[10px] font-mono text-dark/50 dark:text-white/60">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-bold">PROJECT GALLERY</span>
          </span>
          <span className="hidden sm:inline uppercase tracking-widest text-[9px] text-dark/40 dark:text-white/50">
            Drag / Swipe / Scroll to Rotate
          </span>
        </div>

        {/* Remounting on filter change gives the gallery a fresh item set and camera position */}
        <CircularGallery
          key={category}
          items={filtered.map((p) => ({ image: p.image, text: p.title }))}
          bend={3}
          textColor={isDark ? '#f8fafc' : '#0e0e12'}
          borderRadius={0.06}
          scrollEase={0.02}
          fontUrl="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700&display=swap"
          font="bold 24px 'Bricolage Grotesque'"
          onItemClick={(idx: number) => setActive(filtered[idx])}
        />
      </div>

      {active && <QuickView project={active} onClose={() => setActive(null)} />}
    </div>
  );
}