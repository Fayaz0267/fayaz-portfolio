import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface IntroSplashProps {
  name: string;
  subtitle: string;
  onDone?: () => void;
}

const SEEN_KEY = 'portfolio-intro-seen';

function shouldSkip(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true;
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

/** The single orchestrated page-load moment: name rises in, then the curtain lifts. Plays once per session. */
export default function IntroSplash({ name, subtitle, onDone }: IntroSplashProps) {
  const [visible, setVisible] = useState(() => !shouldSkip());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) {
      onDone?.();
      return;
    }
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          onComplete: () => {
            try {
              sessionStorage.setItem(SEEN_KEY, '1');
            } catch {
              /* ignore */
            }
            setVisible(false);
            onDone?.();
          },
        })
        .fromTo(
          '.intro-char',
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.03, ease: 'power3.out' }
        )
        .fromTo('.intro-sub', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.15')
        .to(root, { yPercent: -100, duration: 0.7, ease: 'power3.inOut', delay: 0.5 });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  const words = name.split(' ');

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[10001] bg-[#0b0f17] text-white flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-3xl sm:text-6xl font-black tracking-tight">
        {words.map((word, wi) => (
          <span key={wi} className="inline-flex overflow-hidden pb-1">
            {word.split('').map((ch, ci) => (
              <span key={ci} className="intro-char inline-block">
                {ch}
              </span>
            ))}
          </span>
        ))}
      </div>
      <p className="intro-sub mt-5 text-sm sm:text-base text-slate-300 opacity-0">{subtitle}</p>
    </div>
  );
}