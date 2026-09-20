import { useCallback, useEffect, useState } from 'react';

export const SOUND_KEY = 'portfolio-sound';

export function useMediaFlag(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export const useReducedMotion = () => useMediaFlag('(prefers-reduced-motion: reduce)');
export const useCoarsePointer = () => useMediaFlag('(pointer: coarse)');

/** Sound is OFF by default. The choice is remembered in localStorage. */
export function useSoundPref() {
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SOUND_KEY) === 'on';
    } catch {
      return false;
    }
  });

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_KEY, next ? 'on' : 'off');
      } catch {
        /* storage unavailable, keep in-memory only */
      }
      return next;
    });
  }, []);

  return { soundOn, toggleSound };
}