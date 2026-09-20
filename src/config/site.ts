// Everything you are likely to edit lives here.
// Empty strings / empty arrays switch the related feature off gracefully.

export interface SiteConfig {
  name: string;
  shortName: string;
  role: string;
  email: string;
  phone: string;
  phoneHref: string;
  location: string;
  githubUser: string;
  githubUrl: string;
  linkedinUrl: string;
  /** Your production URL, used for SEO tags and the sitemap. */
  siteUrl: string;
  /** Formspree (or similar) endpoint, e.g. https://formspree.io/f/abcdwxyz. Empty = open visitor's email app instead. */
  formEndpoint: string;
  /** Calendly / Cal.com link. Empty = hide the "Book a call" buttons. */
  calendlyUrl: string;
  /** Put your PDF in /public with this name. Empty = hide the download buttons. */
  resumeUrl: string;
  /** Plausible analytics domain, e.g. "fayaz.dev". Empty = no analytics script. */
  plausibleDomain: string;
}

export const SITE: SiteConfig = {
  name: 'Shaik Mahammad Fayaz',
  shortName: 'SMF',
  role: 'Full-stack developer & UI/UX specialist',
  email: 'shaikfayaz0267@gmail.com',
  phone: '+91 7993639873',
  phoneHref: 'tel:+917993639873',
  location: 'Hyderabad, India',
  githubUser: 'Fayaz0267',
  githubUrl: 'https://github.com/Fayaz0267',
  linkedinUrl: 'https://www.linkedin.com/in/shaik-mahammad-fayaz-1009bb338',
  siteUrl: 'https://your-domain.dev',
  formEndpoint: '',
  calendlyUrl: '',
  resumeUrl: '/Fayaz_Resume.pdf',
  plausibleDomain: '',
};

// ---------- "Now" section (edit freely; hidden if empty) ----------
export interface NowItem {
  label: string;
  text: string;
}

export const NOW: NowItem[] = [
  { label: 'Building', text: 'AI agents that make payments under policy rules, following on from PayAI.' },
  { label: 'Learning', text: 'Smart contracts on Algorand and deeper TypeScript patterns.' },
  { label: 'Open to', text: 'Remote freelance projects in full-stack web and interactive UI.' },
];

// ---------- Case studies (built from your existing project data) ----------
export interface CaseStudy {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
  tags: string[];
  stats: { devTime: string; lines: string; difficultyLabel: string; difficulty: number };
  demoUrl?: string;
  githubUrl?: string;
  accent: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'payai',
    title: 'PayAI',
    summary:
      'An autonomous AI agent that reads corporate spending policies and pays for things with micropayments, asking a human whenever a payment goes beyond the rules.',
    highlights: [
      'Interprets corporate spending policies with a policy engine',
      'Executes micropayments using x402 and AlgoKit on the Algorand ARC Testnet',
      'Requires user approval whenever a transaction exceeds policy rules',
    ],
    tags: ['AI Agent', 'x402 Protocol', 'AlgoKit', 'Algorand', 'Smart Contracts', 'Policy Engine', 'TypeScript'],
    stats: { devTime: '4 weeks', lines: '7,600', difficultyLabel: 'Expert', difficulty: 5 },
    demoUrl: 'https://pay-pemaxj03m-fayaz0267s-projects.vercel.app/',
    githubUrl: 'https://github.com/Fayaz0267/PayAI',
    accent: '#6C63FF',
  },
  {
    id: 'campuseats',
    title: 'CampusEats',
    summary:
      'A food ordering app for university campuses, with separate flows for students, canteens, and admins.',
    highlights: [
      'Role-based student, canteen, and admin experiences',
      'Real-time menu management',
      'Instant ordering over WebSockets',
    ],
    tags: ['React', 'Express', 'Node.js', 'MongoDB', 'Tailwind CSS', 'WebSockets'],
    stats: { devTime: '3 weeks', lines: '4,200', difficultyLabel: 'Intermediate', difficulty: 3 },
    demoUrl: 'https://campuseats-io.vercel.app/',
    githubUrl: 'https://github.com/Fayaz0267/campuseats-frontend',
    accent: '#36D1DC',
  },
];

// ---------- Notes / blog (hidden until you add entries) ----------
export interface Note {
  title: string;
  date: string; // e.g. "2026-09-01"
  summary: string;
  url: string;
  tags?: string[];
}

export const NOTES: Note[] = [
  // { title: 'What I learned building an AI payments agent', date: '2026-09-01', summary: '...', url: 'https://...', tags: ['AI', 'Algorand'] },
];

// ---------- Testimonials (hidden until you add real quotes) ----------
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  // { quote: '...', name: '...', role: '...' },
];