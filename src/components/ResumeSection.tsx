import React from 'react';
import { motion } from 'motion/react';
import { FileText, Sparkles, ExternalLink } from 'lucide-react';
import { playClick, playHover } from '../utils/sound';

// The PDF lives in your project's /public folder, so it is deployed with the
// site and served identically to every visitor on every device.
const RESUME_URL = '/Shaik_Mahammad_Fayaz_Resume.pdf';
const RESUME_FILE_NAME = 'Shaik_Mahammad_Fayaz_Resume.pdf';

export const ResumeSection: React.FC = () => {
  return (
    <section id="resume" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20 relative select-none">

      {/* Structural visual background frame */}
      <div className="absolute inset-0 border border-black/[0.03] dark:border-white/[0.03] pointer-events-none rounded-3xl z-0" />

      {/* Header Container */}
      <div className="text-center space-y-4 mb-16 relative z-10">
        <h2 className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-bold">PROFESSIONAL CREDENTIALS</h2>
        <div className="flex items-center justify-center gap-3">
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-dark dark:text-white uppercase font-sans">
            My Resume
          </h3>
          <span className="px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 text-[8px] font-mono font-bold uppercase tracking-widest">
            AUTHENTICATED VAULT
          </span>
        </div>
        <p className="text-dark/60 dark:text-slate-300 text-sm max-w-lg mx-auto leading-relaxed font-sans">
          Welcome to my digital resume vault. Tap the button below to view or export my complete professional dossier in fluid PDF format.
        </p>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col justify-between p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-800/95 border border-black/15 dark:border-white/15 shadow-2xl relative overflow-hidden text-center min-h-[340px]">
            {/* Visual decorations */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10 flex flex-col items-center">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                <FileText className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-dark/40 dark:text-slate-400 uppercase font-bold tracking-[0.2em]">VERIFIED DOSSIER</span>
                <h4 className="text-2xl font-black text-dark dark:text-white uppercase font-sans tracking-tight">Shaik Mahammad Fayaz</h4>
              </div>

              {/* Document details */}
              <div className="p-3.5 px-6 rounded-2xl bg-black/[0.02] dark:bg-slate-900/60 border border-black/5 dark:border-white/10 inline-flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-dark/5 dark:bg-slate-800 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-accent" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold text-dark dark:text-white truncate max-w-[200px] sm:max-w-[300px]">
                    {RESUME_FILE_NAME}
                  </p>
                  <p className="text-[9px] text-dark/40 dark:text-slate-400 font-mono">
                    Uploaded & Authenticated Document
                  </p>
                </div>
              </div>

              <p className="text-xs text-dark/60 dark:text-slate-300 max-w-md leading-relaxed font-sans">
                Click the highlighted button below to view, download, or print the full professional PDF document in an isolated window instantly!
              </p>
            </div>

            {/* Highlighted Launch Trigger: a real link, so it works reliably on mobile too */}
            <div className="pt-8 relative z-10">
              <motion.a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                onMouseEnter={playHover}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto sm:px-12 py-4 rounded-2xl bg-gradient-to-r from-primary via-indigo-600 to-accent text-white font-black text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/10 group active:scale-95 mx-auto"
              >
                <Sparkles className="w-4 h-4 text-neon animate-pulse" />
                <span>MY RESUME (OPEN PDF)</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;