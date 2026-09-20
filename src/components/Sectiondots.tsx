import React, { useEffect, useState } from 'react';

export interface DotSection {
  id: string;
  label: string;
}

interface SectionDotsProps {
  sections: DotSection[];
  onNavigate: (id: string) => void;
}

/** Highlights the section currently in view and lets people jump between sections. Hidden on small screens. */
export default function SectionDots({ sections, onNavigate }: SectionDotsProps) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Page sections"
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-[100] flex-col gap-3"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onNavigate(s.id)}
            aria-label={`Go to ${s.label}`}
            aria-current={isActive ? 'true' : undefined}
            className="group relative flex items-center justify-end cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded-full"
          >
            <span className="absolute right-6 px-2.5 py-1 rounded-md bg-dark dark:bg-slate-700 text-white text-[11px] whitespace-nowrap opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 transition-all pointer-events-none">
              {s.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-3 h-3 bg-primary shadow-[0_0_0_4px_rgba(108,99,255,0.2)]'
                  : 'w-2 h-2 bg-dark/25 dark:bg-white/30 group-hover:bg-primary/60'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}