import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { playClick, playHover } from '../utils/sound';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'bubble';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  size = 'bubble',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    bubble: 'w-12 h-12 md:w-14 md:h-14 text-sm'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    bubble: 20
  };

  const handleToggle = () => {
    playClick();
    toggleTheme();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <motion.button
      type="button"
      id="theme-toggle-btn"
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      onMouseEnter={playHover}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode (Currently Dark)' : 'Switch to dark mode (Currently Light)'}
      aria-live="polite"
      className={`relative inline-flex items-center justify-center rounded-full transition-colors duration-300 cursor-pointer select-none shadow-md hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-light dark:focus-visible:ring-offset-slate-900 border ${
        isDark
          ? 'bg-slate-800/95 text-amber-300 border-white/10 hover:bg-slate-700/90 hover:border-amber-400/40 shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
          : 'bg-white/95 text-slate-800 border-black/10 hover:bg-slate-50 hover:border-black/20 shadow-[0_4px_16px_rgba(0,0,0,0.12)]'
      } ${sizeClasses[size]} ${className}`}
    >
      {/* Screen reader live notification */}
      <span className="sr-only">
        {isDark ? 'Currently dark mode. Click to switch to light mode.' : 'Currently light mode. Click to switch to dark mode.'}
      </span>

      {/* Subtle ambient aura ring on hover */}
      <motion.div
        className={`absolute inset-0 rounded-full opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 ${
          isDark ? 'bg-amber-400/10' : 'bg-primary/5'
        }`}
      />

      {/* Animated Icon with 360-degree rotation & scale spring micro-interaction */}
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon-icon"
            initial={{ opacity: 0, rotate: -180, scale: 0.4 }}
            animate={{ 
              opacity: 1, 
              rotate: 0, 
              scale: 1,
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
                mass: 0.8
              }
            }}
            exit={{ 
              opacity: 0, 
              rotate: 180, 
              scale: 0.4,
              transition: { duration: 0.2, ease: 'easeIn' }
            }}
            className="relative flex items-center justify-center pointer-events-none"
          >
            <Moon 
              size={iconSizes[size]} 
              className="fill-amber-300/20 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" 
            />
            <Sparkles className="w-2.5 h-2.5 text-amber-200 absolute -top-1 -right-1 opacity-70 animate-pulse pointer-events-none" />
          </motion.div>
        ) : (
          <motion.div
            key="sun-icon"
            initial={{ opacity: 0, rotate: 180, scale: 0.4 }}
            animate={{ 
              opacity: 1, 
              rotate: 0, 
              scale: 1,
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
                mass: 0.8
              }
            }}
            exit={{ 
              opacity: 0, 
              rotate: -180, 
              scale: 0.4,
              transition: { duration: 0.2, ease: 'easeIn' }
            }}
            className="relative flex items-center justify-center pointer-events-none"
          >
            <Sun 
              size={iconSizes[size]} 
              className="text-amber-500 fill-amber-400/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showLabel && (
        <span className="ml-2 font-mono font-bold uppercase tracking-wider text-xs select-none">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
