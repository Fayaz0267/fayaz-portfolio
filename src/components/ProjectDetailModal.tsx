import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Zap, CheckCircle, Cpu, BarChart3, ShieldCheck, Trophy } from 'lucide-react';
import { Project } from './ProjectCard';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenLiveDemo: (title: string) => void;
  onOpenGithub: (title: string) => void;
}

// Map each project to premium detailed data
const DETAILED_PROJECTS_INFO: Record<string, {
  detailedDescription: string;
  role: string;
  metrics: { label: string; value: string; icon: React.FC<any> }[];
  features: string[];
}> = {
  "PayAI": {
    detailedDescription: "PayAI is an autonomous AI-driven corporate expenditure governance and micropayment execution agent. It ingests and interprets complex enterprise spending policies, continuously monitors payment requests, and automates micro-transactions using the x402 payment-required HTTP standard and AlgoKit on the Algorand blockchain. Whenever an expenditure exceeds policy limits, deviates from approved vendor categories, or triggers security thresholds, the agent halts auto-execution and mandates explicit cryptographic user approval.",
    role: "AI & Web3 Full-Stack Architect",
    metrics: [
      { label: "Policy Compliance", value: "99.9%", icon: ShieldCheck },
      { label: "Payment Speed", value: "<0.8s", icon: Zap },
      { label: "Chain Finality", value: "~2.8s", icon: Cpu }
    ],
    features: [
      "Autonomous policy extraction & natural language spending rule validation",
      "x402 HTTP micro-payment protocol integration for zero-friction API settlements",
      "AlgoKit & Algorand smart contracts for instantaneous, low-cost decentralized payments",
      "Interactive human-in-the-loop approval escalation whenever policy rules are breached",
      "Multi-tenant command center with Super Admin console & approval-gated waiting room"
    ]
  },
  "Agent Spend Policy": {
    detailedDescription: "PayAI (Agent Spend Policy) is an autonomous AI-driven corporate expenditure governance and micropayment execution agent.",
    role: "AI & Web3 Full-Stack Architect",
    metrics: [
      { label: "Policy Compliance", value: "99.9%", icon: ShieldCheck },
      { label: "Payment Speed", value: "<0.8s", icon: Zap },
      { label: "Chain Finality", value: "~2.8s", icon: Cpu }
    ],
    features: [
      "Autonomous policy extraction & natural language spending rule validation",
      "x402 HTTP micro-payment protocol integration for zero-friction API settlements"
    ]
  },
  "CampusEats": {
    detailedDescription: "CampusEats is an optimized high-concurrency web platform designed to streamline dining operations for university campuses. The platform bridges the gap between campus dining halls, independent vendors, and hungry students. Built to withstand peak lunch hours, it utilizes advanced state synchronization and localized caching to deliver responsive layouts, instant cart calculations, and bulletproof payment processes.",
    role: "Lead Frontend Architect",
    metrics: [
      { label: "Order Response", value: "0.12s", icon: Zap },
      { label: "User Satisfaction", value: "4.9/5", icon: Trophy },
      { label: "Peak Active Users", value: "1,200+", icon: Cpu }
    ],
    features: [
      "Real-time order tracking using secure WebSocket streaming connections",
      "Instant fuzzy-search filtering and categorized campus vendor directory",
      "Dynamic shopping cart with offline memory and auto-resume draft state",
      "Merchant control panel for real-time order queue triage and processing"
    ]
  },
  "DataMind": {
    detailedDescription: "DataMind is a state-of-the-art data analytics platform that leverages modern machine learning models to synthesize raw unstructured data streams. It renders high-fidelity real-time interactive charting dashboards that empower corporate stakeholders to run semantic queries, compile predictive reports, and inspect system telemetry profiles with zero learning curve.",
    role: "Full-Stack Engineer & ML Architect",
    metrics: [
      { label: "Query Accuracy", value: "98.4%", icon: ShieldCheck },
      { label: "Render Latency", value: "14ms", icon: Zap },
      { label: "Stream Throughput", value: "10GB/s", icon: BarChart3 }
    ],
    features: [
      "Natural language querying with automatic semantic extraction and AI response mapping",
      "Interactive SVG data visualizers built on customized D3 layout algorithms",
      "Next-quarter metrics prediction driven by server-side regression modeling",
      "Automated reports compile engine supporting secure multi-format exports (PDF/CSV)"
    ]
  },
  "VIATRA": {
    detailedDescription: "VIATRA is an AI smart city infrastructure computer vision framework engineered for micro-traffic coordinate monitoring and flow optimizing. Leveraging high-performance convolutional neural networks, VIATRA parses multiple parallel HD security feeds to classify vehicle entities, measure speed vectors, and coordinate traffic light interval phases in real-time.",
    role: "Computer Vision Researcher & Core Lead",
    metrics: [
      { label: "Feeds FPS", value: "60 FPS", icon: BarChart3 },
      { label: "Object Match", value: "99.1%", icon: ShieldCheck },
      { label: "Frame Capture", value: "<5ms", icon: Cpu }
    ],
    features: [
      "Sub-millisecond object detection overlays running on YOLOv9 architecture",
      "Automatic multi-lane counting, speed tracking, and incident logging algorithms",
      "Genetic optimization schedules dynamically coordinating municipal signal arrays",
      "Historical data hub projecting traffic pattern heatmaps for smart city planners"
    ]
  }
};

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenLiveDemo,
  onOpenGithub
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  // Handle escape key closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const details = DETAILED_PROJECTS_INFO[project.title] || {
    detailedDescription: project.description,
    role: "Full-Stack Developer",
    metrics: [
      { label: "Active State", value: "Live", icon: Zap },
      { label: "Code Integrity", value: "100%", icon: ShieldCheck }
    ],
    features: ["Fully modular responsive interface", "Optimized resource loading & animations"]
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark/85 dark:bg-black/90 backdrop-blur-md cursor-zoom-out"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.45)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.8)] border border-black/5 dark:border-white/10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-dark dark:text-white shadow-md border border-black/5 dark:border-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Immersive Visual Section */}
          <div className="relative w-full md:w-[45%] h-56 sm:h-72 md:h-auto overflow-hidden bg-dark shrink-0">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Visual gradient covers */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            
            {/* Project Showcase tag */}
            <div className="absolute bottom-6 left-6 text-white space-y-1.5 text-left">
              <span className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-[0.2em] uppercase rounded bg-primary text-white border border-white/20">
                Active Project
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-sans drop-shadow-md">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Right Side: Detailed Info Panel */}
          <div className="w-full md:w-[55%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-slate-50 dark:bg-slate-900/95">
            <div className="space-y-6 text-left">
              {/* Header section with role */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-bold">
                  {details.role}
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-dark dark:text-white uppercase tracking-tight">
                  Archived Case Study
                </h4>
              </div>

              {/* Comprehensive Description */}
              <p className="text-xs sm:text-sm text-dark/75 dark:text-slate-300 leading-relaxed font-sans font-medium">
                {details.detailedDescription}
              </p>

              {/* Highlight Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {details.metrics.map((metric, i) => {
                  const Icon = metric.icon;
                  return (
                    <div key={i} className="bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
                      <Icon className="w-4 h-4 text-primary mb-1 shrink-0" />
                      <div className="text-xs sm:text-sm font-black text-dark dark:text-white font-sans tracking-tight">{metric.value}</div>
                      <div className="text-[8px] font-mono uppercase text-dark/40 dark:text-slate-400 tracking-wider mt-0.5">{metric.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Main Core Features list */}
              <div className="space-y-2.5">
                <h5 className="text-[10px] font-mono tracking-[0.25em] text-dark/40 dark:text-slate-400 uppercase font-bold">
                  Key Specifications
                </h5>
                <ul className="space-y-2">
                  {details.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] sm:text-xs text-dark/80 dark:text-slate-200 font-sans font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies / Tags list */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-mono tracking-[0.25em] text-dark/40 dark:text-slate-400 uppercase font-bold">
                  Technology Frameworks
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono px-2 py-1 rounded bg-dark/5 dark:bg-slate-800 text-dark/80 dark:text-slate-200 border border-black/5 dark:border-white/10 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky/Bottom Footer Action Buttons */}
            <div className={`grid ${project.demoUrl ? 'grid-cols-2' : 'grid-cols-1'} gap-4 pt-6 mt-6 border-t border-black/10 dark:border-white/10 shrink-0`}>
              {project.demoUrl && (
                <button
                  onClick={() => onOpenLiveDemo(project.title)}
                  className="w-full py-3.5 bg-primary hover:bg-dark text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Zap className="w-4 h-4 text-neon animate-pulse" />
                  <span>VIEW LIVE DEMO</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </button>
              )}
              <button
                onClick={() => onOpenGithub(project.title)}
                className={`w-full py-3.5 ${
                  project.demoUrl
                    ? 'bg-white dark:bg-slate-800 hover:bg-black/5 dark:hover:bg-slate-700 text-dark dark:text-white border border-black/15 dark:border-white/15 shadow-sm hover:shadow-md'
                    : 'bg-primary hover:bg-dark dark:hover:bg-primary/80 text-white shadow-lg hover:shadow-xl'
                } font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 active:scale-95 cursor-pointer hover:-translate-y-0.5`}
              >
                <Github className="w-4 h-4" />
                <span>GITHUB SOURCE</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
