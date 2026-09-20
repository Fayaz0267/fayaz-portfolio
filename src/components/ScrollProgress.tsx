import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const ScrollProgress: React.FC = () => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!progressBarRef.current) return;

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const progress = window.scrollY / totalScroll;

      // Use GSAP for buttery-smooth updates
      gsap.to(progressBarRef.current, {
        scaleX: progress,
        duration: 0.15,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    };

    // Run once on load
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-full h-[4px] z-[200] pointer-events-none origin-left select-none"
      style={{ backfaceVisibility: 'hidden' }}
    >
      {/* Background shadow glow */}
      <div className="absolute inset-0 bg-primary/20 blur-[1px]" />
      
      {/* Dynamic Animated Core Bar */}
      <div
        ref={progressBarRef}
        className="h-full w-full bg-gradient-to-r from-primary via-accent to-neon origin-left scale-x-0 shadow-[0_2px_10px_rgba(108,99,255,0.4)]"
      />
    </div>
  );
};

export default ScrollProgress;
