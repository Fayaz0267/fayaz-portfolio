import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CASE_STUDIES } from '../config/site';
import ScrollReveal from '../components/ScrollReveal';

export default function CaseStudyPage() {
  const { id } = useParams<{ id: string }>();
  const caseStudy = CASE_STUDIES.find((c) => c.id === id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (caseStudy) document.title = `${caseStudy.title} | Case study`;
  }, [caseStudy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null || !caseStudy) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? i : (i + 1) % caseStudy.screens.length));
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? i : (i - 1 + caseStudy.screens.length) % caseStudy.screens.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, caseStudy]);

  if (!caseStudy) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0b0f17] text-dark dark:text-white transition-colors duration-300">
      <div className="h-2" style={{ background: caseStudy.accent }} aria-hidden="true" />

      <header className="max-w-4xl mx-auto px-6 pt-10">
        <Link to="/#work" className="inline-flex items-center gap-2 text-sm font-semibold text-dark/60 dark:text-slate-400 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to portfolio
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold" style={{ color: caseStudy.accent }}>
          Case Study
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black text-dark dark:text-white tracking-tight">{caseStudy.title}</h1>
        <p className="mt-3 text-lg text-dark/70 dark:text-slate-300">{caseStudy.tagline}</p>

        <div className="flex flex-wrap gap-2 mt-6">
          {caseStudy.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-black/[0.04] dark:bg-white/10 text-dark/70 dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-7">
          {caseStudy.demoUrl && (
            <a href={caseStudy.demoUrl} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full text-white text-sm font-bold flex items-center gap-2" style={{ backgroundColor: caseStudy.accent }}>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Live demo
            </a>
          )}
          {caseStudy.githubUrl && (
            <a href={caseStudy.githubUrl} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full border border-black/15 dark:border-white/15 text-dark dark:text-white text-sm font-bold flex items-center gap-2 hover:border-primary/50 transition-colors">
              <Github className="w-4 h-4" aria-hidden="true" />
              Source code
            </a>
          )}
        </div>

        <dl className="grid grid-cols-3 gap-4 mt-10 max-w-md">
          <div>
            <dt className="text-xs text-dark/50 dark:text-slate-400">Build time</dt>
            <dd className="text-lg font-bold text-dark dark:text-white">{caseStudy.stats.devTime}</dd>
          </div>
          <div>
            <dt className="text-xs text-dark/50 dark:text-slate-400">Lines of code</dt>
            <dd className="text-lg font-bold text-dark dark:text-white">{caseStudy.stats.lines}</dd>
          </div>
          <div>
            <dt className="text-xs text-dark/50 dark:text-slate-400">Difficulty</dt>
            <dd className="text-lg font-bold text-dark dark:text-white">{caseStudy.stats.difficultyLabel}</dd>
          </div>
        </dl>

        {caseStudy.screens.length > 0 && (
          <ScrollReveal stagger={0.1}>
            <div className="mt-14 space-y-10">
              {caseStudy.screens.map((screen, idx) => (
                <figure key={screen.src}>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="block w-full rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-lg cursor-zoom-in"
                    aria-label={`Open larger view: ${screen.caption}`}
                  >
                    <img src={screen.src} alt={screen.caption} loading="lazy" className="w-full h-auto block" />
                  </button>
                  <figcaption className="mt-3 text-sm text-dark/60 dark:text-slate-400">{screen.caption}</figcaption>
                </figure>
              ))}
            </div>
          </ScrollReveal>
        )}

        <div className="mt-16 space-y-10 max-w-2xl">
          <section>
            <h2 className="text-xs font-mono tracking-[0.2em] uppercase font-bold" style={{ color: caseStudy.accent }}>The problem</h2>
            <p className="mt-3 text-base text-dark/80 dark:text-slate-200 leading-relaxed">{caseStudy.problem}</p>
          </section>
          <section>
            <h2 className="text-xs font-mono tracking-[0.2em] uppercase font-bold" style={{ color: caseStudy.accent }}>The approach</h2>
            <p className="mt-3 text-base text-dark/80 dark:text-slate-200 leading-relaxed">{caseStudy.approach}</p>
          </section>
          <section>
            <h2 className="text-xs font-mono tracking-[0.2em] uppercase font-bold" style={{ color: caseStudy.accent }}>The result</h2>
            <p className="mt-3 text-base text-dark/80 dark:text-slate-200 leading-relaxed">{caseStudy.result}</p>
          </section>
          <section>
            <h2 className="text-xs font-mono tracking-[0.2em] uppercase font-bold" style={{ color: caseStudy.accent }}>Highlights</h2>
            <ul className="mt-3 space-y-2.5">
              {caseStudy.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-dark/70 dark:text-slate-300 leading-relaxed">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: caseStudy.accent }} aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10">
          <Link to="/#work" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to all projects
          </Link>
        </div>
      </main>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85"
          role="dialog"
          aria-modal="true"
          aria-label={caseStudy.screens[lightboxIndex].caption}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setLightboxIndex(null);
          }}
        >
          <button type="button" onClick={() => setLightboxIndex(null)} aria-label="Close" className="absolute top-6 right-6 p-2 rounded-lg text-white/80 hover:text-white cursor-pointer">
            <X className="w-6 h-6" />
          </button>

          {caseStudy.screens.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setLightboxIndex((i) => (i === null ? i : (i - 1 + caseStudy.screens.length) % caseStudy.screens.length))}
                aria-label="Previous screenshot"
                className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex((i) => (i === null ? i : (i + 1) % caseStudy.screens.length))}
                aria-label="Next screenshot"
                className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <figure className="max-w-4xl w-full">
            <img
              src={caseStudy.screens[lightboxIndex].src}
              alt={caseStudy.screens[lightboxIndex].caption}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <figcaption className="mt-4 text-center text-sm text-white/70">{caseStudy.screens[lightboxIndex].caption}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}