export const ADMIN_EMAIL = 'shahariar.sabbir.101@gmail.com';



export const DEFAULT_SITE_CONFIG = {
  greetingText: 'Hi, my name is',
  heroPrefix: 'I am',
  typewriterWords: ['a Learner.', 'a Web Developer.', 'a Problem Solver.'],
  tagline: 'Building scalable web solutions.',
  manifesto:
    'Building digital experiences that combine beautiful design with robust engineering.',
  resumeUrl: '',
  about:
    'I am a full-stack developer passionate about creating interactive and beautiful user experiences.',
  projectsPageTitle: 'Selected Works',
  projectsPageSubtitle: 'A collection of my recent projects, experiments, and open-source contributions.',
  blogPageTitle: 'Blog',
  blogPageSubtitle: 'Thoughts, tutorials, and deep dives into technology and design.',
  journalPageTitle: 'Journal',
  journalPageSubtitle: 'Philosophical thoughts, code musings, and micro-updates.',
  careerPageTitle: 'Career Journey',
  careerPageSubtitle: 'My professional journey and education.',
  experienceTabTitle: 'Experience',
  testimonialsTabTitle: 'Testimonials',
  testimonialsSectionTitle: 'Testimonials',
  testimonialsSectionSubtitle: 'What people say about working with me.',
  sectionVisibility: {
    // Home Page
    hero: true,
    about: true,
    skills: true,
    certifications: true,
    contactCTA: true,
    // Career Page
    experience: true,
    testimonials: true,
    manifesto: true,
    // Layout & Navigation
    topNavBar: true,
    footer: true,
    // Buttons & Controls
    resumeButton: true,
    ctaButton: true,
    themeToggleButton: true,
  },
  socialLinks: [
    { id: '1', platform: 'GitHub', url: 'https://github.com/', iconName: 'Github' },
    { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com/', iconName: 'Linkedin' },
    { id: '3', platform: 'Twitter', url: 'https://twitter.com/', iconName: 'Twitter' },
  ],
  navLinks: [
    { id: '1', path: '/', label: 'Home' },
    { id: '2', path: '/projects', label: 'Projects' },
    { id: '3', path: '/career', label: 'Career' },
    { id: '4', path: '/blog', label: 'Blog' },
    { id: '5', path: '/journal', label: 'Journal' },
    { id: '6', path: '/contact', label: 'Contact' },
    { id: '7', path: '/admin', label: 'Admin' },
  ],
  isAvailableForWork: true,
  ctaTitle: "Let's create your next big idea.",
  ctaButtonText: 'Contact Me',
  catAccentColor: '#FFFF00',
  catMessage: "You've reached the end! The developer is out walking his cat.",
  contactPageTitle: "Let's start a project\ntogether",
  contactPageText: "My inbox is always open. Whether you have a project or just want to say Hi. I would love to hear from you. Feel free to contact me and I'll get back to you."
};

export const COLLECTIONS = {
  PROJECTS: 'projects',
  BLOG: 'blogPosts',
  CAREER: 'career',
  CERTIFICATIONS: 'certifications',
  JOURNAL: 'journalEntries',
  TESTIMONIALS: 'testimonials',
  USERS: 'users',
  CONFIG: 'config',
  MESSAGES: 'contactMessages',
  SKILLS: 'skills'
};
