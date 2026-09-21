import React, { useState, useEffect, useRef, useMemo, lazy, Suspense, useCallback } from 'react';
import {
  Cpu,
  Globe,
  Code,
  Terminal,
  Workflow,
  Server,
  Zap,
  Network,
  Database,
  HardDrive,
  Box,
  Cloud,
  Flame,
  Layers,
  Palette,
  Brush,
  GitBranch,
  Settings,
  Laptop,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Github,
  Linkedin,
  Eye,
  Rocket,
  Pause,
  Play,
  RotateCw,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  Sparkles,
  Search,
  PenTool,
  Hammer,
  ArrowUp,
  Copy,
  Download,
  CalendarDays,
  Command,
  Volume2,
  VolumeX,
  ExternalLink,
  Quote
} from 'lucide-react';
import BubbleMenu, { MenuItem } from './components/BubbleMenu';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import ScrollStack, { ScrollStackItem } from './components/ScrollStack';
import ExpertiseCard, { ExpertiseItem } from './components/ExpertiseCard';
import ScrollFloat from './components/ScrollFloat';
import ScrollProgress from './components/ScrollProgress';
import ScrollReveal from './components/ScrollReveal';
import ThemeToggle from './components/ThemeToggle';
import IntroSplash from './components/IntroSplash';
import SectionDots, { DotSection } from './components/SectionDots';
import CommandPalette, { PaletteCommand } from './components/CommandPalette';
import TerminalModal from './components/TerminalModal';
import GithubStats from './components/GitHubStats';
import { useTheme } from './context/ThemeContext';
import { playClick, playHover, playSuccessChime } from './utils/sound';
import { useCoarsePointer, useReducedMotion, useSoundPref } from './hooks/usePrefs';
import { SITE, NOW, CASE_STUDIES, NOTES, TESTIMONIALS } from './config/site';

// Heavy / below-the-fold pieces load on demand
const CursorTrailCanvas = lazy(() => import('./components/CursorTrailCanvas'));
const ResumeSection = lazy(() => import('./components/ResumeSection'));

// ---------- Static data ----------
const PARTICLES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  size: Math.floor(Math.random() * 6) + 2,
  top: Math.floor(Math.random() * 100),
  left: Math.floor(Math.random() * 100),
  duration: Math.floor(Math.random() * 15) + 12,
  delay: Math.floor(Math.random() * 8),
}));

const TECH_STACK = [
  { name: "React", icon: "react", color: "#61DAFB", level: 5, category: "Frontend" },
  { name: "Vue.js", icon: "vue", color: "#4FC08D", level: 4, category: "Frontend" },
  { name: "TypeScript", icon: "typescript", color: "#3178C6", level: 5, category: "Language" },
  { name: "JavaScript", icon: "javascript", color: "#F7DF1E", level: 5, category: "Language" },
  { name: "Python", icon: "python", color: "#3776AB", level: 4, category: "Backend" },
  { name: "Node.js", icon: "node", color: "#339933", level: 5, category: "Backend" },
  { name: "Next.js", icon: "next", color: "#A855F7", level: 4, category: "Frontend" },
  { name: "GraphQL", icon: "graphql", color: "#E10098", level: 4, category: "Backend" },
  { name: "MongoDB", icon: "mongodb", color: "#47A248", level: 4, category: "Database" },
  { name: "PostgreSQL", icon: "postgresql", color: "#336791", level: 4, category: "Database" },
  { name: "Docker", icon: "docker", color: "#2496ED", level: 3, category: "DevOps" },
  { name: "AWS", icon: "aws", color: "#FF9900", level: 3, category: "Cloud" },
  { name: "Firebase", icon: "firebase", color: "#FFCA28", level: 4, category: "Backend" },
  { name: "Three.js", icon: "three", color: "#049EF4", level: 3, category: "3D" },
  { name: "Figma", icon: "figma", color: "#F24E1E", level: 4, category: "Design" },
  { name: "Sass", icon: "sass", color: "#CC6699", level: 5, category: "CSS" },
  { name: "Git", icon: "git", color: "#F05032", level: 5, category: "Tools" },
  { name: "Webpack", icon: "webpack", color: "#8DD6F9", level: 4, category: "Build" }
];
const TECH_CATEGORIES = ['All', ...Array.from(new Set(TECH_STACK.map((t) => t.category)))];

const HERO_ROLES = ["FULL-STACK DEVELOPER", "UI/UX SPECIALIST", "3D ANIMATION EXPERT"];

const PROCESS_STEPS = [
  {
    icon: Search,
    title: "Understand the problem",
    description: "We start with who the product is for and what it needs to do. I ask questions, map the user flow, and agree on scope before any code is written."
  },
  {
    icon: PenTool,
    title: "Design the experience",
    description: "Wireframes and interface designs in Figma, reviewed with you early, so layout and interactions are settled before development."
  },
  {
    icon: Hammer,
    title: "Build it properly",
    description: "Typed React and Node code, a clean data model, and components that are easy to change later. You see working builds as we go."
  },
  {
    icon: Rocket,
    title: "Ship and support",
    description: "Deployment, performance checks, and a handover you can actually use, with follow-up support after launch."
  }
];

const FONT_STYLES = `
  .portfolio-root { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
  .portfolio-root .font-sans { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
  .portfolio-root h1, .portfolio-root h2, .portfolio-root h3, .portfolio-root h4 {
    font-family: 'Bricolage Grotesque', 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  }
  .portfolio-root :focus-visible { outline: 2px solid #6C63FF; outline-offset: 3px; }
  .skip-link {
    position: fixed; left: 16px; top: -60px; z-index: 10002; padding: 10px 16px; border-radius: 9999px;
    background: #111; color: #fff; font-weight: 700; font-size: 14px; transition: top .2s;
  }
  .skip-link:focus { top: 16px; }
  @media (prefers-reduced-motion: reduce) {
    .portfolio-root *, .portfolio-root *::before, .portfolio-root *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
    .tech-track-scroller { animation: none !important; }
  }
`;

type ToastType = 'success' | 'info' | 'error';
type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

// Defined at module level so it keeps its identity between renders (ScrollFloat animations don't restart)
function SectionHeader({
  eyebrow,
  title,
  eyebrowClass = 'text-primary',
  blurb,
}: {
  eyebrow: string;
  title: string;
  eyebrowClass?: string;
  blurb?: string;
}) {
  return (
    <div className="text-center space-y-4 mb-14">
      <h2 className={`text-[10px] font-mono tracking-[0.3em] uppercase font-bold ${eyebrowClass}`}>{eyebrow}</h2>
      <div className="relative inline-block">
        <ScrollFloat text={title} />
        <span className="block h-[1px] w-24 bg-black/20 dark:bg-white/20 mx-auto mt-4" />
      </div>
      {blurb && (
        <p className="text-dark/60 dark:text-slate-300 text-sm max-w-lg mx-auto leading-relaxed font-sans">{blurb}</p>
      )}
    </div>
  );
}

export default function App() {
  const themeCtx = useTheme() as any;
  const { theme } = themeCtx;
  const isDark = theme === 'dark';

  const reduceMotion = useReducedMotion();
  const coarsePointer = useCoarsePointer();
  const { soundOn, toggleSound } = useSoundPref();

  // Sound helpers respect the visitor's choice (off by default)
  const click = useCallback(() => { if (soundOn) playClick(); }, [soundOn]);
  const hover = useCallback(() => { if (soundOn) playHover(); }, [soundOn]);
  const successChime = useCallback(() => { if (soundOn) playSuccessChime(); }, [soundOn]);

  const showCursorTrail = !coarsePointer && !reduceMotion;
  const particles = useMemo(
    () => (reduceMotion ? [] : coarsePointer ? PARTICLES.slice(0, 12) : PARTICLES),
    [reduceMotion, coarsePointer]
  );

  const EXPERTISE_DATA = useMemo<ExpertiseItem[]>(() => [
    {
      icon: Laptop,
      title: "Frontend Development",
      description: "Creating modular, responsive, and performance-optimized browser interfaces. Expert at designing user experiences with flawless components, state synchronization, and highly expressive animations.",
      tags: ["React.js", "Vue.js", "TypeScript", "Next.js", "GSAP", "Three.js"],
      themeColor: "primary",
      delay: 0
    },
    {
      icon: Server,
      title: "Backend & Cloud",
      description: "Designing scalable APIs, custom middleware networks, and safe database storage structures. Experienced in microservice choreography, secure token authorization, and automated cloud deployments.",
      tags: ["Node.js", "Python", "MongoDB", "PostgreSQL", "GraphQL", "Docker"],
      themeColor: "accent",
      delay: 0.15
    },
    {
      icon: Palette,
      title: "UI/UX & Physics Animation",
      description: "Enriching interfaces with delightful micro-interactions, canvas drawing, and scroll-bound physics. Deeply focused on responsive layouts, clean spacing hierarchies, and cohesive brand design.",
      tags: ["Figma", "Framer Motion", "GSAP", "TailwindCSS", "WebGL", "SVG Animation"],
      themeColor: "secondary",
      delay: 0.3
    }
  ], []);

  // Sections that exist on the page (optional ones appear only when they have content)
  const sections = useMemo<DotSection[]>(() => {
    const list: DotSection[] = [
      { id: 'home', label: 'Home' },
      ...(NOW.length ? [{ id: 'now', label: 'Now' }] : []),
      { id: 'expertise', label: 'Expertise' },
      { id: 'tech', label: 'Tech stack' },
      { id: 'github', label: 'GitHub' },
      ...(CASE_STUDIES.length ? [{ id: 'work', label: 'Case studies' }] : []),
      { id: 'philosophy', label: 'Manifesto' },
      { id: 'process', label: 'Process' },
      ...(NOTES.length ? [{ id: 'notes', label: 'Notes' }] : []),
      ...(TESTIMONIALS.length ? [{ id: 'testimonials', label: 'Kind words' }] : []),
      { id: 'resume', label: 'Resume' },
      { id: 'contact', label: 'Contact' },
    ];
    return list;
  }, []);

  const menuItems = useMemo<MenuItem[]>(() => [
    { label: 'Home', href: '#home', ariaLabel: 'Home', rotation: -8, hoverStyles: { bgColor: '#6C63FF', textColor: '#ffffff' } },
    { label: 'Expertise', href: '#expertise', ariaLabel: 'Expertise', rotation: 8, hoverStyles: { bgColor: '#36D1DC', textColor: '#ffffff' } },
    { label: 'Tech Stack', href: '#tech', ariaLabel: 'Tech Stack', rotation: 8, hoverStyles: { bgColor: '#FF6584', textColor: '#ffffff' } },
    ...(CASE_STUDIES.length
      ? [{ label: 'Case Studies', href: '#work', ariaLabel: 'Case studies', rotation: -8, hoverStyles: { bgColor: '#00ff9d', textColor: '#0a0a1a' } } as MenuItem]
      : []),
    { label: 'Manifesto', href: '#philosophy', ariaLabel: 'My Creative Manifesto', rotation: -8, hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' } },
    { label: 'Process', href: '#process', ariaLabel: 'How I work', rotation: 6, hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' } },
    { label: 'Resume', href: '#resume', ariaLabel: 'Dossier & Resume', rotation: 6, hoverStyles: { bgColor: '#36D1DC', textColor: '#ffffff' } },
    { label: 'Contact', href: '#contact', ariaLabel: 'Contact', rotation: 8, hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' } }
  ], []);

  // ---------- State ----------
  const [typedText, setTypedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [isCarouselReversed, setIsCarouselReversed] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [activeCategory, setActiveCategory] = useState('All');

  const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([]);
  const [showTop, setShowTop] = useState(false);
  const [expandedCase, setExpandedCase] = useState<string | null>(CASE_STUDIES[0]?.id ?? null);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');

  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const successIconRef = useRef<HTMLSpanElement>(null);

  // ---------- Derived ----------
  const filteredTech = useMemo(
    () => (activeCategory === 'All' ? TECH_STACK : TECH_STACK.filter((t) => t.category === activeCategory)),
    [activeCategory]
  );
  const loopedTech = useMemo(() => {
    const repeats = Math.max(2, Math.ceil(24 / Math.max(filteredTech.length, 1)));
    const base = Array.from({ length: repeats }).flatMap(() => filteredTech);
    return [...base, ...base];
  }, [filteredTech]);

  // ---------- Helpers ----------
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [reduceMotion]);

  const scrollToTop = () => {
    click();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const toggleTheme = useCallback(() => {
    if (typeof themeCtx.toggleTheme === 'function') themeCtx.toggleTheme();
    else if (typeof themeCtx.setTheme === 'function') themeCtx.setTheme(isDark ? 'light' : 'dark');
  }, [themeCtx, isDark]);

  const copyEmail = useCallback(async () => {
    click();
    try {
      await navigator.clipboard.writeText(SITE.email);
      addToast('Email address copied', 'success');
    } catch {
      addToast(`Copy failed. My email is ${SITE.email}`, 'info');
    }
  }, [addToast, click]);

  const getTechIconComponent = (icon: string) => {
    switch (icon) {
      case 'react': return Cpu;
      case 'vue': return Globe;
      case 'typescript': return Code;
      case 'javascript': return Terminal;
      case 'python': return Workflow;
      case 'node': return Server;
      case 'next': return Zap;
      case 'graphql': return Network;
      case 'mongodb': return Database;
      case 'postgresql': return HardDrive;
      case 'docker': return Box;
      case 'aws': return Cloud;
      case 'firebase': return Flame;
      case 'three': return Layers;
      case 'figma': return Palette;
      case 'sass': return Brush;
      case 'git': return GitBranch;
      case 'webpack': return Settings;
      default: return Code;
    }
  };

  // ---------- Effects ----------
  // Fonts, page title, analytics
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const add = (rel: string, href: string, crossOrigin?: string) => {
      const l = document.createElement('link');
      l.rel = rel;
      l.href = href;
      if (crossOrigin !== undefined) l.crossOrigin = crossOrigin;
      document.head.appendChild(l);
      links.push(l);
    };
    add('preconnect', 'https://fonts.googleapis.com');
    add('preconnect', 'https://fonts.gstatic.com', '');
    add(
      'stylesheet',
      'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap'
    );

    document.title = `${SITE.name} | ${SITE.role}`;

    let script: HTMLScriptElement | null = null;
    if (SITE.plausibleDomain) {
      script = document.createElement('script');
      script.defer = true;
      script.setAttribute('data-domain', SITE.plausibleDomain);
      script.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(script);
    }

    return () => {
      links.forEach((l) => l.remove());
      script?.remove();
    };
  }, []);

  // Typewriter
  useEffect(() => {
    if (reduceMotion) {
      setTypedText(HERO_ROLES[0]);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const currentText = HERO_ROLES[textIndex];

    const handleType = () => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setTypedText(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
          setTypingSpeed(100);
        } else {
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else if (charIndex > 0) {
        setTypedText(currentText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        setTypingSpeed(50);
      } else {
        setIsDeleting(false);
        setTextIndex((textIndex + 1) % HERO_ROLES.length);
        setTypingSpeed(300);
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex, typingSpeed, reduceMotion]);

  // Back-to-top visibility
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard shortcuts: Ctrl/Cmd+K opens the palette, ` opens the terminal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setTerminalOpen(false);
        setPaletteOpen((o) => !o);
      } else if (e.key === '`' && !typing && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setPaletteOpen(false);
        setTerminalOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Success animation once the button has re-rendered in its "sent" state
  useEffect(() => {
    if (formStatus !== 'sent' || reduceMotion) return;
    if (submitButtonRef.current) {
      gsap
        .timeline()
        .to(submitButtonRef.current, { backgroundColor: '#10b981', scale: 1.04, duration: 0.35, ease: 'power2.out' })
        .to(submitButtonRef.current, { scale: 1, duration: 0.25, ease: 'power2.inOut' });
    }
    if (successIconRef.current) {
      gsap.fromTo(
        successIconRef.current,
        { scale: 0, opacity: 0, rotation: -45 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.65, ease: 'back.out(2.5)', delay: 0.1 }
      );
    }
    const t = setTimeout(() => {
      if (submitButtonRef.current) {
        gsap.to(submitButtonRef.current, { backgroundColor: '', duration: 0.5, ease: 'power2.inOut' });
      }
      setFormStatus('idle');
    }, 4000);
    return () => clearTimeout(t);
  }, [formStatus, reduceMotion]);

  useEffect(() => {
    if (formStatus === 'sent' && reduceMotion) {
      const t = setTimeout(() => setFormStatus('idle'), 4000);
      return () => clearTimeout(t);
    }
  }, [formStatus, reduceMotion]);

  // ---------- Contact form ----------
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    click();

    // Bots fill the hidden field; humans never see it. Pretend success and drop it.
    if (honeypot) {
      setFormStatus('sent');
      return;
    }

    setFormStatus('sending');
    const senderName = formData.name;

    try {
      if (SITE.formEndpoint) {
        const res = await fetch(SITE.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          }),
        });
        if (!res.ok) throw new Error(`Form endpoint returned ${res.status}`);
        addToast(`Thanks ${senderName}! Your message was sent. I'll reply soon.`, 'success');
      } else {
        const body = `${formData.message}\n\n— ${formData.name} (${formData.email})`;
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(body)}`;
        addToast(`Thanks ${senderName}! Your email app is opening with the message ready to send.`, 'success');
      }
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFormStatus('sent');
      successChime();
    } catch {
      setFormStatus('error');
      addToast(`The message didn't send. Please try again or email ${SITE.email} directly.`, 'error');
    }
  };

  // ---------- Command palette + terminal data ----------
  const paletteCommands = useMemo<PaletteCommand[]>(() => {
    const nav: PaletteCommand[] = sections.map((s) => ({
      id: `go-${s.id}`,
      label: `Go to ${s.label}`,
      group: 'Navigate',
      keywords: s.id,
      run: () => goTo(s.id),
    }));

    const actions: PaletteCommand[] = [
      { id: 'theme', label: `Switch to ${isDark ? 'light' : 'dark'} theme`, group: 'Actions', keywords: 'dark light mode', run: toggleTheme },
      { id: 'sound', label: soundOn ? 'Turn sound off' : 'Turn sound on', group: 'Actions', keywords: 'audio mute', run: toggleSound },
      { id: 'copy-email', label: 'Copy email address', group: 'Actions', keywords: 'contact', run: copyEmail },
      { id: 'terminal', label: 'Open terminal', group: 'Actions', keywords: 'console command line', run: () => setTerminalOpen(true) },
      { id: 'github', label: 'Open GitHub profile', group: 'Links', run: () => window.open(SITE.githubUrl, '_blank', 'noopener,noreferrer') },
      { id: 'linkedin', label: 'Open LinkedIn profile', group: 'Links', run: () => window.open(SITE.linkedinUrl, '_blank', 'noopener,noreferrer') },
    ];

    if (SITE.resumeUrl) {
      actions.push({
        id: 'resume-dl',
        label: 'Download resume (PDF)',
        group: 'Actions',
        keywords: 'cv',
        run: () => window.open(SITE.resumeUrl, '_blank', 'noopener,noreferrer'),
      });
    }
    if (SITE.calendlyUrl) {
      actions.push({
        id: 'book',
        label: 'Book a call',
        group: 'Actions',
        keywords: 'meeting calendar schedule',
        run: () => window.open(SITE.calendlyUrl, '_blank', 'noopener,noreferrer'),
      });
    }
    return [...actions, ...nav];
  }, [sections, isDark, soundOn, toggleTheme, toggleSound, copyEmail, goTo]);

  const terminalData = useMemo(
    () => ({
      name: SITE.name,
      role: SITE.role,
      location: SITE.location,
      email: SITE.email,
      github: SITE.githubUrl,
      linkedin: SITE.linkedinUrl,
      skills: TECH_STACK.map((t) => t.name),
      projects: CASE_STUDIES.map((c) => ({ title: c.title, summary: c.summary, url: c.demoUrl })),
      sections,
    }),
    [sections]
  );

  // ---------- Render helpers ----------
  const renderTechTile = (tech: typeof TECH_STACK[number], key: string) => {
    const Icon = getTechIconComponent(tech.icon);
    return (
      <button
        type="button"
        key={key}
        onClick={() => addToast(`${tech.name}: level ${tech.level} of 5 (${tech.category})`, 'info')}
        aria-label={`${tech.name}, ${tech.category}, proficiency ${tech.level} out of 5`}
        className="w-[140px] sm:w-[160px] h-[140px] sm:h-[160px] mx-3 bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 hover:border-primary/20 dark:hover:border-primary/40 shadow-sm hover:shadow-lg rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 group flex-shrink-0 select-none"
      >
        <Icon className="w-10 h-10 sm:w-12 sm:h-12 mb-3 transition-transform group-hover:scale-110" style={{ color: tech.color }} />
        <span className="text-xs sm:text-sm font-semibold text-dark dark:text-white group-hover:text-primary transition-colors">{tech.name}</span>
        <span className="text-[9px] text-dark/40 dark:text-slate-400 font-mono mt-1 uppercase tracking-widest">{tech.category}</span>
        <span className="flex gap-1 mt-2" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: i < tech.level ? tech.color : 'rgba(148,163,184,0.35)' }}
            />
          ))}
        </span>
      </button>
    );
  };

  const skeleton = (h: string) => (
    <div className={`max-w-7xl mx-auto px-6 ${h}`} aria-hidden="true">
      <div className="w-full h-full rounded-3xl bg-black/5 dark:bg-white/5 animate-pulse" />
    </div>
  );

  const inputClass =
    "w-full px-4 py-3 bg-black/[0.02] dark:bg-slate-900/60 hover:bg-black/[0.04] dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-900 focus:border-primary/50 text-dark dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-black/10 dark:border-white/15 focus:ring-2 focus:ring-primary/10 transition-all outline-none";

  const dockButton =
    "w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 shadow-lg flex items-center justify-center text-dark dark:text-white hover:text-primary hover:-translate-y-0.5 transition-all cursor-pointer";

  return (
    <div className="portfolio-root min-h-screen bg-[#f8f9fa] dark:bg-[#0b0f17] text-dark dark:text-white overflow-x-hidden relative pb-12 transition-colors duration-300">
      <style>{FONT_STYLES}</style>
      <a href="#main" className="skip-link">Skip to content</a>

      <IntroSplash name={SITE.name.toUpperCase()} subtitle={SITE.role} />

      <ScrollProgress />
      {showCursorTrail && (
        <Suspense fallback={null}>
          <CursorTrailCanvas />
        </Suspense>
      )}

      <SectionDots sections={sections} onNavigate={goTo} />

      {/* Decorative watermarks */}
      <div className="absolute top-[-100px] left-[-50px] text-[320px] font-serif italic text-dark/[0.03] dark:text-white/[0.02] select-none pointer-events-none z-0 leading-none" aria-hidden="true">Studio</div>
      <div className="absolute top-[40%] right-[-100px] text-[280px] font-serif italic text-dark/[0.03] dark:text-white/[0.02] select-none pointer-events-none z-0 leading-none" aria-hidden="true">Fayaz</div>
      <div className="absolute bottom-[8%] left-[-80px] text-[280px] font-serif italic text-dark/[0.03] dark:text-white/[0.02] select-none pointer-events-none z-0 leading-none" aria-hidden="true">Design</div>

      {/* Viewport frame */}
      <div className="fixed inset-0 border-[8px] sm:border-[16px] md:border-[24px] border-[#f8f9fa] dark:border-[#0b0f17] pointer-events-none z-[110] transition-colors duration-300" />

      {/* Toasts */}
      <div className="fixed top-20 right-5 sm:right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-full shadow-xl flex items-center gap-3 border transition-all duration-300 animate-slide-in backdrop-blur-md bg-white/95 dark:bg-slate-800/95 border-black/5 dark:border-white/10 text-dark dark:text-white"
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />}
            {toast.type === 'info' && <Cpu className="w-5 h-5 text-primary flex-shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
            <span className="text-xs font-semibold tracking-wide leading-relaxed">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Utility dock (bottom left) */}
      <div className="fixed bottom-10 left-8 sm:left-12 z-[120] flex flex-col gap-3">
        <button type="button" onClick={() => setPaletteOpen(true)} className={dockButton} aria-label="Open command palette (Ctrl or Cmd + K)" title="Command palette (Ctrl/Cmd + K)">
          <Command className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => setTerminalOpen(true)} className={dockButton} aria-label="Open terminal (backtick key)" title="Terminal (`)">
          <Terminal className="w-4 h-4" />
        </button>
        <button type="button" onClick={toggleSound} className={dockButton} aria-pressed={soundOn} aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'} title={soundOn ? 'Sound on' : 'Sound off'}>
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Back to top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        className={`fixed bottom-10 right-8 sm:right-12 z-[120] w-12 h-12 rounded-full bg-dark dark:bg-primary text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-primary dark:hover:bg-primary/80 ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Background particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-primary to-accent opacity-[0.15] dark:opacity-[0.25] animate-float-particle"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              '--duration': `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0 opacity-40 transition-colors duration-300" aria-hidden="true" />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <BubbleMenu
          logo={
            <div className="h-12 md:h-14 px-5 sm:px-6 bg-white dark:bg-slate-800 rounded-full border border-black/5 dark:border-white/10 shadow-lg flex items-center gap-3 pointer-events-auto transition-colors duration-300">
              <span className="text-lg sm:text-xl font-black tracking-tighter text-dark dark:text-white">{SITE.shortName}</span>
              <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10"></div>
              <span className="text-[9px] uppercase tracking-widest font-semibold opacity-50 dark:opacity-60 text-dark dark:text-white">Portfolio</span>
            </div>
          }
          rightAction={<ThemeToggle size="bubble" />}
          items={menuItems}
          menuAriaLabel="Toggle navigation menu"
          menuBg={isDark ? "#1e293b" : "#ffffff"}
          menuContentColor={isDark ? "#f8fafc" : "#111111"}
          useFixedPosition={true}
          animationEase="back.out(1.5)"
          animationDuration={0.4}
          staggerDelay={0.1}
        />
      </header>

      <main id="main" className="relative z-10">

        {/* ---------- Hero ---------- */}
        <section id="home" className="min-h-screen flex items-center justify-center pt-32 pb-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 text-left space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/90 border border-black/10 dark:border-white/10 text-[10px] font-mono text-dark dark:text-white font-semibold tracking-widest uppercase shadow-sm transition-colors duration-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                AVAILABLE FOR FREELANCE & INNOVATION
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-dark dark:text-white">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-dark dark:from-white via-primary to-accent pb-2">
                  {SITE.name.toUpperCase()}
                </span>
                <span className="text-xl sm:text-3xl font-serif italic text-dark/70 dark:text-slate-300 block mt-3 min-h-[40px] transition-colors duration-300" aria-label={HERO_ROLES.join(', ')}>
                  <span aria-hidden="true">
                    {typedText}
                    <span className="text-primary animate-pulse ml-1">|</span>
                  </span>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-dark/70 dark:text-slate-300 leading-relaxed max-w-xl font-normal transition-colors duration-300">
                I design and build deeply immersive full-stack applications with state-of-the-art interactive graphics, fluid physics animations, and highly performant database architecture.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#contact"
                  onClick={click}
                  onMouseEnter={hover}
                  className="px-8 py-4 bg-dark dark:bg-primary text-white hover:bg-primary dark:hover:bg-primary/80 font-bold text-sm tracking-wide rounded-full flex items-center gap-2.5 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-primary/20"
                >
                  <Rocket className="w-4 h-4 text-neon" />
                  Start a project
                </a>
                {SITE.calendlyUrl && (
                  <a
                    href={SITE.calendlyUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={click}
                    onMouseEnter={hover}
                    className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-black/5 dark:hover:bg-slate-700 border border-black/15 dark:border-white/15 text-dark dark:text-white font-bold text-sm tracking-wide rounded-full flex items-center gap-2.5 transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
                  >
                    <CalendarDays className="w-4 h-4 text-primary" />
                    Book a call
                  </a>
                )}
                {SITE.resumeUrl && (
                  <a
                    href={SITE.resumeUrl}
                    download
                    onClick={click}
                    onMouseEnter={hover}
                    className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-black/5 dark:hover:bg-slate-700 border border-black/15 dark:border-white/15 text-dark dark:text-white font-bold text-sm tracking-wide rounded-full flex items-center gap-2.5 transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
                  >
                    <Download className="w-4 h-4 text-primary" />
                    Download resume
                  </a>
                )}
                <a
                  href="#resume"
                  onClick={click}
                  onMouseEnter={hover}
                  className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-black/5 dark:hover:bg-slate-700 border border-black/15 dark:border-white/15 text-dark dark:text-white font-bold text-sm tracking-wide rounded-full flex items-center gap-2.5 transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
                >
                  <Eye className="w-4 h-4 text-primary" />
                  View my resume
                </a>
              </div>

              <dl className="flex flex-wrap gap-x-10 gap-y-4 pt-6 border-t border-black/10 dark:border-white/10 max-w-xl">
                <div>
                  <dd className="text-2xl font-black text-dark dark:text-white">{TECH_STACK.length}</dd>
                  <dt className="text-xs text-dark/60 dark:text-slate-400">Technologies I work with</dt>
                </div>
                <div>
                  <dd className="text-2xl font-black text-dark dark:text-white">{EXPERTISE_DATA.length}</dd>
                  <dt className="text-xs text-dark/60 dark:text-slate-400">Core disciplines</dt>
                </div>
                <div>
                  <dd className="text-2xl font-black text-dark dark:text-white">Remote</dd>
                  <dt className="text-xs text-dark/60 dark:text-slate-400">Open to freelance roles</dt>
                </div>
              </dl>

              {!coarsePointer && (
                <p className="text-xs text-dark/50 dark:text-slate-400">
                  Tip: press{' '}
                  <kbd className="px-1.5 py-0.5 rounded border border-black/15 dark:border-white/15 font-mono">Ctrl/Cmd + K</kbd>{' '}
                  to jump anywhere, or{' '}
                  <kbd className="px-1.5 py-0.5 rounded border border-black/15 dark:border-white/15 font-mono">`</kbd>{' '}
                  to open the terminal.
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
              className="lg:col-span-5 flex flex-col items-center justify-center relative"
            >
              {!reduceMotion && (
                <div className="absolute -top-12 -right-8 hidden xl:block z-10 pointer-events-none" aria-hidden="true">
                  <div className="cube-container">
                    <div className="cube">
                      <div className="cube-face front"><Cpu className="w-8 h-8 text-primary" /></div>
                      <div className="cube-face back"><Code className="w-8 h-8 text-accent" /></div>
                      <div className="cube-face right"><Workflow className="w-8 h-8 text-neon" /></div>
                      <div className="cube-face left"><Server className="w-8 h-8 text-secondary" /></div>
                      <div className="cube-face top"><Database className="w-8 h-8 text-accent" /></div>
                      <div className="cube-face bottom"><Terminal className="w-8 h-8 text-primary" /></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute w-[320px] h-[320px] bg-primary/5 dark:bg-primary/15 rounded-full filter blur-[65px] animate-pulse pointer-events-none" aria-hidden="true" />

              <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full overflow-hidden border-[12px] border-white dark:border-slate-800 shadow-2xl animate-float-image relative group z-10 outline outline-1 outline-black/5 dark:outline-white/10 transition-colors duration-300">
                <img
                  src="https://www.image2url.com/r2/default/images/1779259947253-91889616-0fc3-40e4-aa25-db6a8a6330ff.jpeg"
                  alt={SITE.name}
                  width={360}
                  height={360}
                  fetchPriority="high"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ---------- Now ---------- */}
        {NOW.length > 0 && (
          <section id="now" className="py-16 px-6 max-w-7xl mx-auto scroll-mt-20">
            <SectionHeader eyebrow="RIGHT NOW" title="What I'm up to" eyebrowClass="text-accent" />
            <ScrollReveal stagger={0.12}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {NOW.map((item) => (
                  <div key={item.label} className="bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 rounded-3xl p-7 shadow-md transition-colors duration-300">
                    <h3 className="text-sm font-bold text-primary mb-2">{item.label}</h3>
                    <p className="text-sm text-dark/70 dark:text-slate-300 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* ---------- Expertise ---------- */}
        <section id="expertise" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
          <SectionHeader eyebrow="MY STRENGTHS" title="Areas of Expertise" />
          <ScrollReveal stagger={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {EXPERTISE_DATA.map((item, idx) => (
                <ExpertiseCard key={idx} item={item} />
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ---------- Tech stack ---------- */}
        <section id="tech" className="py-24 bg-black/[0.01] dark:bg-white/[0.01] border-y border-black/5 dark:border-white/5 relative scroll-mt-20 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 mb-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="space-y-4">
                <h2 className="text-[10px] font-mono tracking-[0.3em] text-accent uppercase font-bold">MY ARMORY</h2>
                <ScrollFloat text="Technical Stack" containerClassName="justify-start text-left" />
                <p className="text-dark/60 dark:text-slate-300 text-sm max-w-lg leading-relaxed font-sans">
                  Filter by category, then select any tile to see my proficiency. The dots on each tile show my level out of five.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-8" role="group" aria-label="Filter technologies by category">
              {TECH_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => { click(); setActiveCategory(cat); }}
                  aria-pressed={activeCategory === cat}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-dark dark:bg-primary text-white border-transparent shadow-md'
                      : 'bg-white dark:bg-slate-800 text-dark/70 dark:text-slate-300 border-black/10 dark:border-white/10 hover:border-primary/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 overflow-hidden py-4 select-none relative">
            <div className="flex overflow-hidden">
              <div
                key={`track1-${activeCategory}`}
                className="tech-track-scroller"
                style={{
                  '--scroll-duration': `${42 * speedMultiplier}s`,
                  '--scroll-play-state': isCarouselPaused ? 'paused' : 'running',
                  '--scroll-direction': isCarouselReversed ? 'reverse' : 'normal',
                } as React.CSSProperties}
              >
                {loopedTech.map((tech, idx) => renderTechTile(tech, `t1-${idx}`))}
              </div>
            </div>
            <div className="flex overflow-hidden">
              <div
                key={`track2-${activeCategory}`}
                className="tech-track-scroller"
                style={{
                  '--scroll-duration': `${42 * speedMultiplier}s`,
                  '--scroll-play-state': isCarouselPaused ? 'paused' : 'running',
                  '--scroll-direction': isCarouselReversed ? 'normal' : 'reverse',
                } as React.CSSProperties}
              >
                {[...loopedTech].reverse().map((tech, idx) => renderTechTile(tech, `t2-${idx}`))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- GitHub ---------- */}
        <section id="github" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
          <SectionHeader
            eyebrow="OPEN SOURCE"
            title="Live from GitHub"
            eyebrowClass="text-accent"
            blurb="These numbers are pulled from my public GitHub profile when you load the page."
          />
          <GithubStats username={SITE.githubUser} profileUrl={SITE.githubUrl} />
        </section>

        {/* ---------- Case studies ---------- */}
        {CASE_STUDIES.length > 0 && (
          <section id="work" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
            <SectionHeader
              eyebrow="CASE STUDIES"
              title="Things I've Built"
              blurb="Two projects in more detail: what they do, what they're made with, and how big they were."
            />
            <div className="space-y-6">
              {CASE_STUDIES.map((cs) => {
                const open = expandedCase === cs.id;
                return (
                  <article
                    key={cs.id}
                    className="bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 rounded-3xl shadow-md overflow-hidden transition-colors duration-300"
                  >
                    <div className="h-1.5" style={{ background: cs.accent }} aria-hidden="true" />
                    <div className="p-7 sm:p-9">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-2xl">
                          <h3 className="text-2xl sm:text-3xl font-black text-dark dark:text-white">{cs.title}</h3>
                          <p className="mt-3 text-sm sm:text-base text-dark/70 dark:text-slate-300 leading-relaxed">{cs.summary}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {cs.demoUrl && (
                            <a href={cs.demoUrl} target="_blank" rel="noreferrer" onClick={click} className="px-5 py-2.5 rounded-full bg-dark dark:bg-primary text-white text-sm font-bold flex items-center gap-2 hover:bg-primary dark:hover:bg-primary/80 transition-colors">
                              <ExternalLink className="w-4 h-4" aria-hidden="true" />
                              Live demo
                            </a>
                          )}
                          {cs.githubUrl && (
                            <a href={cs.githubUrl} target="_blank" rel="noreferrer" onClick={click} className="px-5 py-2.5 rounded-full border border-black/15 dark:border-white/15 text-dark dark:text-white text-sm font-bold flex items-center gap-2 hover:border-primary/50 transition-colors">
                              <Github className="w-4 h-4" aria-hidden="true" />
                              Source code
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-5">
                        {cs.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-full text-[11px] font-semibold bg-black/[0.04] dark:bg-white/10 text-dark/70 dark:text-slate-300">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => { click(); setExpandedCase(open ? null : cs.id); }}
                        aria-expanded={open}
                        aria-controls={`case-${cs.id}`}
                        className="mt-6 text-sm font-semibold text-primary hover:underline cursor-pointer"
                      >
                        {open ? 'Hide details' : 'Show details'}
                      </button>

                      {open && (
                        <div id={`case-${cs.id}`} className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-black/10 dark:border-white/10">
                          <div className="lg:col-span-2">
                            <h4 className="text-sm font-bold text-dark dark:text-white mb-3">What it does</h4>
                            <ul className="space-y-2.5">
                              {cs.highlights.map((h) => (
                                <li key={h} className="flex gap-3 text-sm text-dark/70 dark:text-slate-300 leading-relaxed">
                                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: cs.accent }} aria-hidden="true" />
                                  {h}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <dl className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                            <div>
                              <dt className="text-xs text-dark/50 dark:text-slate-400">Build time</dt>
                              <dd className="text-lg font-bold text-dark dark:text-white">{cs.stats.devTime}</dd>
                            </div>
                            <div>
                              <dt className="text-xs text-dark/50 dark:text-slate-400">Lines of code</dt>
                              <dd className="text-lg font-bold text-dark dark:text-white">{cs.stats.lines}</dd>
                            </div>
                            <div>
                              <dt className="text-xs text-dark/50 dark:text-slate-400">Difficulty</dt>
                              <dd className="text-lg font-bold text-dark dark:text-white flex items-center gap-2">
                                {cs.stats.difficultyLabel}
                                <span className="flex gap-1" aria-hidden="true">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i < cs.stats.difficulty ? cs.accent : 'rgba(148,163,184,0.35)' }} />
                                  ))}
                                </span>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ---------- Manifesto ---------- */}
        <section id="philosophy" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
          <SectionHeader
            eyebrow="CREATIVE MANIFESTO"
            title="My Core Manifesto"
            eyebrowClass="text-accent"
            blurb="Scroll inside the vault below to explore the mindsets that steer every project from concept to launch."
          />

          <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-[32px] p-2 sm:p-6 shadow-inner relative overflow-hidden h-[450px] sm:h-[500px] flex flex-col justify-between transition-colors duration-300">
            <div className="absolute top-4 left-6 flex items-center gap-1.5 z-10" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 text-[10px] font-mono text-dark/30 dark:text-white/40 tracking-wider">CREATIVE_MANIFESTO.md</span>
            </div>

            <div className="flex-grow overflow-hidden mt-6">
              <ScrollStack itemDistance={80} itemScale={0.03} itemStackDistance={24} stackPosition="15%" scaleEndPosition="5%" baseScale={0.9} rotationAmount={-1} blurAmount={1} useWindowScroll={false}>
                <ScrollStackItem itemClassName="border border-black/5 dark:border-white/10 hover:border-primary/20 dark:hover:border-primary/40 bg-white dark:bg-slate-800 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 h-full justify-between">
                    <div className="space-y-4 max-w-xl text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/5 dark:bg-primary/20 border border-primary/10 dark:border-primary/30 text-primary dark:text-primary-light text-xs font-bold font-mono">
                        <Terminal className="w-3.5 h-3.5" />
                        PILLAR 01
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-dark dark:text-white tracking-tight">User Experience Above All</h4>
                      <p className="text-dark/70 dark:text-slate-300 text-sm leading-relaxed font-sans">
                        Digital experiences should feel organic, responsive, and natural. Interfaces are most powerful when they fade into the background, letting the user's intent guide the experience seamlessly through clear visual hierarchies, elegant typography, and deliberate negative space.
                      </p>
                    </div>
                    <div className="hidden md:flex w-24 h-24 rounded-full bg-primary/5 dark:bg-primary/20 items-center justify-center border border-primary/10 dark:border-primary/30 text-primary shrink-0">
                      <Palette className="w-10 h-10" />
                    </div>
                  </div>
                </ScrollStackItem>

                <ScrollStackItem itemClassName="border border-black/5 dark:border-white/10 hover:border-accent/20 dark:hover:border-accent/40 bg-white dark:bg-slate-800 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 h-full justify-between">
                    <div className="space-y-4 max-w-xl text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/5 dark:bg-accent/20 border border-accent/10 dark:border-accent/30 text-accent text-xs font-bold font-mono">
                        <Cpu className="w-3.5 h-3.5" />
                        PILLAR 02
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-dark dark:text-white tracking-tight">Clean, Scalable Architecture</h4>
                      <p className="text-dark/70 dark:text-slate-300 text-sm leading-relaxed font-sans">
                        High performance is a fundamental user requirement. Writing expressive, strongly-typed TypeScript and modular components with zero waste leads to applications that are incredibly fast to load, easy to adapt, and completely robust under real-world workloads.
                      </p>
                    </div>
                    <div className="hidden md:flex w-24 h-24 rounded-full bg-accent/5 dark:bg-accent/20 items-center justify-center border border-accent/10 dark:border-accent/30 text-accent shrink-0">
                      <Layers className="w-10 h-10" />
                    </div>
                  </div>
                </ScrollStackItem>

                <ScrollStackItem itemClassName="border border-black/5 dark:border-white/10 hover:border-secondary/20 dark:hover:border-secondary/40 bg-white dark:bg-slate-800 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 h-full justify-between">
                    <div className="space-y-4 max-w-xl text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary/5 dark:bg-secondary/20 border border-secondary/10 dark:border-secondary/30 text-secondary text-xs font-bold font-mono">
                        <Sparkles className="w-3.5 h-3.5" />
                        PILLAR 03
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-dark dark:text-white tracking-tight">Curiosity & Constant Evolution</h4>
                      <p className="text-dark/70 dark:text-slate-300 text-sm leading-relaxed font-sans">
                        True design and coding craft are forged by persistent exploration and continuous learning. Every transition, micro-interaction, and physics-bound gesture is carefully tuned to match real spatial intuition, creating cohesive digital narratives that stand the test of time.
                      </p>
                    </div>
                    <div className="hidden md:flex w-24 h-24 rounded-full bg-secondary/5 dark:bg-secondary/20 items-center justify-center border border-secondary/10 dark:border-secondary/30 text-secondary shrink-0">
                      <Flame className="w-10 h-10 animate-pulse" />
                    </div>
                  </div>
                </ScrollStackItem>
              </ScrollStack>
            </div>

            <div className="absolute bottom-3 right-6 text-[9px] font-mono text-dark/30 dark:text-white/40 select-none hidden sm:block" aria-hidden="true">
              USE WHEEL OR DRAG TO INNER-SCROLL VAULT
            </div>
          </div>
        </section>

        {/* ---------- Process ---------- */}
        <section id="process" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
          <SectionHeader
            eyebrow="HOW I WORK"
            title="From Idea to Launch"
            blurb="Every project follows the same four steps, so you always know what is happening and what comes next."
          />
          <ScrollReveal stagger={0.12}>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROCESS_STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <li key={step.title} className="relative bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 rounded-3xl p-7 shadow-md transition-colors duration-300">
                    <span className="absolute top-5 right-6 text-4xl font-serif italic text-dark/10 dark:text-white/10 select-none" aria-hidden="true">{idx + 1}</span>
                    <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-primary/20 border border-primary/10 dark:border-primary/30 text-primary flex items-center justify-center mb-5">
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-dark/70 dark:text-slate-300 leading-relaxed">{step.description}</p>
                  </li>
                );
              })}
            </ol>
          </ScrollReveal>
        </section>

        {/* ---------- Notes / blog (only when there are entries) ---------- */}
        {NOTES.length > 0 && (
          <section id="notes" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
            <SectionHeader eyebrow="WRITING" title="Notes" eyebrowClass="text-accent" blurb="Short write-ups on things I've built and learned along the way." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {NOTES.map((note) => (
                <a key={note.url} href={note.url} target="_blank" rel="noreferrer" className="block bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 rounded-3xl p-7 shadow-md hover:border-primary/40 transition-colors">
                  <time dateTime={note.date} className="text-xs text-dark/50 dark:text-slate-400">
                    {new Date(note.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </time>
                  <h3 className="mt-2 text-xl font-bold text-dark dark:text-white">{note.title}</h3>
                  <p className="mt-2 text-sm text-dark/70 dark:text-slate-300 leading-relaxed">{note.summary}</p>
                  {note.tags && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {note.tags.map((t) => (
                        <span key={t} className="px-2.5 py-0.5 rounded-full text-[11px] bg-primary/5 dark:bg-primary/20 text-primary">{t}</span>
                      ))}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ---------- Testimonials (only when there are real quotes) ---------- */}
        {TESTIMONIALS.length > 0 && (
          <section id="testimonials" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
            <SectionHeader eyebrow="KIND WORDS" title="What People Say" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <figure key={t.name} className="bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 rounded-3xl p-7 shadow-md">
                  <Quote className="w-6 h-6 text-primary mb-4" aria-hidden="true" />
                  <blockquote className="text-sm text-dark/80 dark:text-slate-200 leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-bold text-dark dark:text-white">{t.name}</span>
                    <span className="block text-xs text-dark/50 dark:text-slate-400">{t.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ---------- Resume ---------- */}
        <Suspense fallback={skeleton('h-96')}>
          <ResumeSection />
        </Suspense>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
          <SectionHeader eyebrow="GET IN TOUCH" title="Start a Project" eyebrowClass="text-accent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-5 flex flex-col justify-between"
            >
              <div className="bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 rounded-3xl p-8 space-y-8 flex flex-col justify-center h-full shadow-md transition-colors duration-300">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3">Let's Build Something Amazing</h3>
                  <p className="text-dark/70 dark:text-slate-300 text-sm leading-relaxed">
                    Have an innovative idea, full-stack product request, or business proposal? Reach out directly! I typically respond within a couple of business hours.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-primary/5 dark:bg-primary/20 flex items-center justify-center border border-primary/10 dark:border-primary/30 text-primary"><Mail className="w-5 h-5" /></div>
                    <div className="flex-grow min-w-0">
                      <span className="block text-[9px] text-dark/40 dark:text-slate-400 font-mono uppercase tracking-widest">Email</span>
                      <a href={`mailto:${SITE.email}`} className="text-sm font-bold text-dark dark:text-white hover:text-primary transition-colors break-all">{SITE.email}</a>
                    </div>
                    <button type="button" onClick={copyEmail} title="Copy email address" aria-label="Copy email address" className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-dark/60 dark:text-slate-300 hover:text-primary hover:border-primary/40 transition-colors cursor-pointer flex-shrink-0">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-primary/5 dark:bg-primary/20 flex items-center justify-center border border-primary/10 dark:border-primary/30 text-primary"><Phone className="w-5 h-5" /></div>
                    <div>
                      <span className="block text-[9px] text-dark/40 dark:text-slate-400 font-mono uppercase tracking-widest">Phone</span>
                      <a href={SITE.phoneHref} className="text-sm font-bold text-dark dark:text-white hover:text-primary transition-colors">{SITE.phone}</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-primary/5 dark:bg-primary/20 flex items-center justify-center border border-primary/10 dark:border-primary/30 text-primary"><MapPin className="w-5 h-5" /></div>
                    <div>
                      <span className="block text-[9px] text-dark/40 dark:text-slate-400 font-mono uppercase tracking-widest">Location</span>
                      <span className="text-sm font-bold text-dark dark:text-white">{SITE.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-primary/5 dark:bg-primary/20 flex items-center justify-center border border-primary/10 dark:border-primary/30 text-primary"><Clock className="w-5 h-5" /></div>
                    <div>
                      <span className="block text-[9px] text-dark/40 dark:text-slate-400 font-mono uppercase tracking-widest">Availability</span>
                      <span className="text-sm font-bold text-primary">Open for Remote Freelance Roles</span>
                    </div>
                  </div>
                </div>

                {(SITE.calendlyUrl || SITE.resumeUrl) && (
                  <div className="flex flex-wrap gap-3">
                    {SITE.calendlyUrl && (
                      <a href={SITE.calendlyUrl} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full bg-dark dark:bg-primary text-white text-sm font-bold flex items-center gap-2 hover:bg-primary dark:hover:bg-primary/80 transition-colors">
                        <CalendarDays className="w-4 h-4" aria-hidden="true" />
                        Book a call
                      </a>
                    )}
                    {SITE.resumeUrl && (
                      <a href={SITE.resumeUrl} download className="px-5 py-3 rounded-full border border-black/15 dark:border-white/15 text-dark dark:text-white text-sm font-bold flex items-center gap-2 hover:border-primary/50 transition-colors">
                        <Download className="w-4 h-4" aria-hidden="true" />
                        Download resume
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="lg:col-span-7"
            >
              <form onSubmit={handleContactSubmit} className="bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 rounded-3xl p-8 space-y-6 shadow-md transition-colors duration-300">
                {/* Honeypot: hidden from people, tempting to bots */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label htmlFor="company">Company (leave empty)</label>
                  <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-mono text-dark/60 dark:text-slate-300">Your Name</label>
                    <input type="text" id="name" required autoComplete="name" placeholder="e.g. John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-mono text-dark/60 dark:text-slate-300">Your Email</label>
                    <input type="email" id="email" required autoComplete="email" placeholder="e.g. john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-mono text-dark/60 dark:text-slate-300">Subject</label>
                  <input type="text" id="subject" required placeholder="What project or concept is this about?" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={inputClass} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-mono text-dark/60 dark:text-slate-300">Message Description</label>
                  <textarea id="message" required rows={5} placeholder="Explain the milestones, stack details, or design directions..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={`${inputClass} resize-none`} />
                </div>

                <button
                  ref={submitButtonRef}
                  type="submit"
                  disabled={formStatus === 'sending' || formStatus === 'sent'}
                  className="w-full px-6 py-4 bg-dark dark:bg-primary hover:bg-primary dark:hover:bg-primary/80 text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none hover:shadow-lg cursor-pointer"
                >
                  {formStatus === 'sending' ? (
                    <>
                      <Send className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : formStatus === 'sent' ? (
                    <>
                      <span ref={successIconRef} className="inline-block">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </span>
                      <span>{SITE.formEndpoint ? 'Message sent' : 'Email app opened'}</span>
                    </>
                  ) : formStatus === 'error' ? (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>Try again</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send message</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Overlays */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={paletteCommands} />
      <TerminalModal
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        data={terminalData}
        onNavigate={goTo}
        onToggleTheme={toggleTheme}
      />

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 bg-white dark:bg-slate-900 py-16 px-6 relative z-10 select-none transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-6 text-center">
          <div className="flex gap-4">
            <a href={SITE.githubUrl} target="_blank" rel="noreferrer" title="GitHub" aria-label="GitHub profile" className="w-12 h-12 rounded-full bg-black/[0.02] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 flex items-center justify-center text-dark dark:text-white hover:text-white hover:bg-primary dark:hover:bg-primary hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
              <Github className="w-5 h-5" />
            </a>
            <a href={SITE.linkedinUrl} target="_blank" rel="noreferrer" title="LinkedIn" aria-label="LinkedIn profile" className="w-12 h-12 rounded-full bg-black/[0.02] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 flex items-center justify-center text-dark dark:text-white hover:text-white hover:bg-primary dark:hover:bg-primary hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={`mailto:${SITE.email}`} title="Email" aria-label="Send an email" className="w-12 h-12 rounded-full bg-black/[0.02] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 flex items-center justify-center text-dark dark:text-white hover:text-white hover:bg-primary dark:hover:bg-primary hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
              <Mail className="w-5 h-5" />
            </a>
          </div>

          <p className="text-dark/80 dark:text-slate-300 text-sm font-semibold">
            &copy; {new Date().getFullYear()} {SITE.name}. All Rights Reserved.
          </p>

          <p className="text-dark/40 dark:text-slate-500 text-xs font-mono max-w-sm leading-relaxed">
            Crafted with passion using React, TypeScript, Tailwind CSS, and React Bits BubbleMenu.
          </p>
        </div>
      </footer>
    </div>
  );
}
