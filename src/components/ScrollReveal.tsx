import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  stagger?: number;
  yOffset?: number;
  duration?: number;
  delay?: number;
  ease?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  stagger = 0.15,
  yOffset = 50,
  duration = 0.8,
  delay = 0,
  ease = 'power2.out',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      // Auto-detect targets: if there is only a single wrapper element (like a grid),
      // we stagger its children instead of the container itself to get perfect layout flow.
      let targets: HTMLCollection | NodeListOf<Element> = containerRef.current.children;
      if (targets.length === 1 && targets[0].children.length > 0) {
        targets = targets[0].children;
      }

      if (!targets || targets.length === 0) return;

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: yOffset,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%', // Trigger when the element reaches 85% of the viewport height
            toggleActions: 'play none none none', // Play only once on enter
          },
        }
      );
    }, containerRef);

    return () => ctx.revert(); // Clean up context and disconnect ScrollTriggers
  }, [stagger, yOffset, duration, delay, ease]);

  return (
    <div ref={containerRef} className="will-change-transform">
      {children}
    </div>
  );
};

export default ScrollReveal;
