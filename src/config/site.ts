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
export interface CaseStudyScreen {
  /** Path under /public, e.g. "/case-studies/payai-1.png" */
  src: string;
  caption: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  problem: string;
  approach: string;
  result: string;
  highlights: string[];
  tags: string[];
  stats: { devTime: string; lines: string; difficultyLabel: string; difficulty: number };
  demoUrl?: string;
  githubUrl?: string;
  accent: string;
  cover: string;
  screens: CaseStudyScreen[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'payai',
    title: 'PayAI',
    tagline: 'An AI agent that spends money inside the rules you set',
    summary:
      'An autonomous AI agent that reads corporate spending policies and pays for things with micropayments, asking a human whenever a payment goes beyond the rules.',
    problem:
      'Companies want AI agents to handle routine purchases and subscriptions, but nobody wants to hand an agent an unmonitored company card. Every existing "agent payments" demo skipped the governance layer.',
    approach:
      'I built a multi-tenant command center on top of a policy engine: organizations sign up and are gated behind a Super Admin approval queue, and once active, their agents can only spend inside per-tenant rules. Payments run as real micropayments via the x402 protocol and AlgoKit, settling on the Algorand ARC Testnet. Anything outside policy pauses for a human approval instead of failing silently.',
    result:
      'The result is a working demo of policy-governed agent spending: a Super Admin console for onboarding and oversight, a live dashboard tracking wallet balance and settlement velocity in real time, and a full audit trail of every agent transaction.',
    highlights: [
      'Multi-tenant RBAC: organizations register, then wait in an approval queue until a Super Admin verifies them',
      'Super Admin console with a real-time approval queue, tenant registry, and system health view',
      'Live dashboard showing wallet balance, address, and settlement velocity on the Algorand ARC Testnet',
      'Executes micropayments using the x402 protocol and AlgoKit',
      'Requires human approval whenever a transaction exceeds policy rules',
    ],
    tags: ['AI Agent', 'x402 Protocol', 'AlgoKit', 'Algorand', 'Smart Contracts', 'Policy Engine', 'TypeScript', 'RBAC'],
    stats: { devTime: '4 weeks', lines: '7,600', difficultyLabel: 'Expert', difficulty: 5 },
    demoUrl: 'https://pay-pemaxj03m-fayaz0267s-projects.vercel.app/',
    githubUrl: 'https://github.com/Fayaz0267/PayAI',
    accent: '#6C63FF',
    cover: '/case-studies/payai-1.png',
    screens: [
      { src: '/case-studies/payai-1.png', caption: 'Universal login with gated organization signup and Super Admin access' },
      { src: '/case-studies/payai-2.png', caption: 'Agent wallet dashboard: balance, address, and live settlement velocity' },
      { src: '/case-studies/payai-3.png', caption: 'Super Admin console: pending organization approval queue and system health' },
    ],
  },
  {
    id: 'campuseats',
    title: 'CampusEats',
    tagline: 'AI-powered food ordering, built for how a campus actually runs',
    summary:
      'A food ordering app for university campuses, with separate flows for students, canteens, and admins.',
    problem:
      'Campus canteens run on queues and guesswork: students wait in line not knowing what is available, and canteens have no early signal of demand until the rush hits.',
    approach:
      'I designed role-based onboarding so students, canteen staff, and admins each land in the right experience, then built a student app around a natural-language "Ask CampusEats" search and a recommendation feed personalized from favorites, order history, and ratings. Menu management and order status update in real time over WebSockets so canteens and students stay in sync.',
    result:
      'A working ordering flow from role selection through checkout, with an AI search bar that understands requests like "something spicy under ₹150" and a home feed that adapts to what each student actually orders.',
    highlights: [
      'Role-based onboarding for students, canteen staff, and admins',
      'Natural-language menu search ("something spicy under ₹150")',
      'Personalized recommendations from favorites, order history, and ratings',
      'Live order tracking and real-time menu management over WebSockets',
    ],
    tags: ['React', 'Express', 'Node.js', 'MongoDB', 'Tailwind CSS', 'WebSockets'],
    stats: { devTime: '3 weeks', lines: '4,200', difficultyLabel: 'Intermediate', difficulty: 3 },
    demoUrl: 'https://campuseats-landing-page.vercel.app/',
    githubUrl: 'https://github.com/Fayaz0267/campuseats-frontend',
    accent: '#FF8A3D',
    cover: '/case-studies/campuseats-1.png',
    screens: [
      { src: '/case-studies/campuseats-1.png', caption: 'Landing page: AI-powered campus food ordering' },
      { src: '/case-studies/campuseats-2.png', caption: 'Role selection: students, canteen staff, and admins each get their own flow' },
      { src: '/case-studies/campuseats-3.png', caption: 'Student home feed with AI search and personalized recommendations' },
    ],
  },
];

// ---------- Lighter project grid (interactive projects section) ----------
// Projects without real screenshots stay text/tag-only — no stock photos.
export interface LightProject {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  category: string;
  accent: string;
  /** Cover image for the 3D gallery. Path under /public. */
  image: string;
  githubUrl?: string;
  demoUrl?: string;
  /** If set, links through to a full /work/:id case study page instead of just github/demo. */
  caseStudyId?: string;
}

export const LIGHT_PROJECTS: LightProject[] = [
  {
    id: 'payai',
    title: 'PayAI',
    summary: 'Policy-governed AI agent payments on Algorand, with a multi-tenant admin console.',
    tags: ['AI Agent', 'Algorand', 'TypeScript'],
    category: 'AI',
    accent: '#6C63FF',
    image: '/case-studies/payai-1.png',
    githubUrl: 'https://github.com/Fayaz0267/PayAI',
    demoUrl: 'https://pay-pemaxj03m-fayaz0267s-projects.vercel.app/',
    caseStudyId: 'payai',
  },
  {
    id: 'campuseats',
    title: 'CampusEats',
    summary: 'AI-powered campus food ordering with role-based student, canteen, and admin flows.',
    tags: ['React', 'Node.js', 'MongoDB'],
    category: 'Full-stack',
    accent: '#FF8A3D',
    image: '/case-studies/campuseats-1.png',
    githubUrl: 'https://github.com/Fayaz0267/campuseats-frontend',
    demoUrl: 'https://campuseats-landing-page.vercel.app/',
    caseStudyId: 'campuseats',
  },
  {
    id: 'datamind',
    title: 'DataMind',
    summary: 'An AI-powered analytics platform with semantic query insights and predictive metrics.',
    tags: ['React Native', 'Python', 'GraphQL', 'D3.js'],
    category: 'AI',
    accent: '#22C55E',
    image: '/projects/datamind-cover.svg',
    githubUrl: 'https://github.com/Fayaz0267/DataMind',
  },
  {
    id: 'viatra',
    title: 'VIATRA',
    summary: 'Computer vision traffic management for smart cities, using YOLOv9 to predict and coordinate flow.',
    tags: ['Python', 'OpenCV', 'YOLOv9', 'PostgreSQL'],
    category: 'Computer Vision',
    accent: '#EAB308',
    image: '/projects/viatra-cover.svg',
    githubUrl: 'https://github.com/Fayaz0267/VIATRA',
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