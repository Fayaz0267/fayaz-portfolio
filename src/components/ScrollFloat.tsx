import React from 'react';
import { motion } from 'motion/react';

interface ScrollFloatProps {
  text: string;
  className?: string;
  containerClassName?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const charVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: 55,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 14,
    },
  },
};

export const ScrollFloat: React.FC<ScrollFloatProps> = ({
  text,
  className = '',
  containerClassName = '',
}) => {
  // Split by space to get words, so we can preserve line breaks on word boundaries
  const words = text.split(' ');

  return (
    <motion.h3
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`inline-flex flex-wrap justify-center gap-x-[0.3em] gap-y-[0.1em] text-3xl sm:text-5xl font-black font-sans text-dark dark:text-white uppercase tracking-tight relative transition-colors duration-300 ${containerClassName}`}
      style={{ perspective: '800px' }}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap overflow-hidden py-1">
          {word.split('').map((char, charIdx) => (
            <motion.span
              key={charIdx}
              variants={charVariants}
              className={`inline-block origin-bottom ${className}`}
              style={{ display: 'inline-block', backfaceVisibility: 'hidden' }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h3>
  );
};

export default ScrollFloat;
