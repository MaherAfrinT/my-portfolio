import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from './constants';

const DEFAULT_SKILLS = [
  {
    category: 'Web Engineering',
    iconName: 'Globe',
    items: [
      { name: 'React', icon: 'react' },
      { name: 'JavaScript (ES6+)', icon: 'javascript' },
      { name: 'Tailwind CSS', icon: 'tailwindcss' },
      { name: 'HTML5 & CSS3', icon: 'html5' },
      { name: 'Node.js', icon: 'nodedotjs' },
    ],
  },
  {
    category: 'CSE Core',
    iconName: 'Terminal',
    items: [
      { name: 'C / C++', icon: 'cplusplus' },
      { name: 'Python', icon: 'python' },
      { name: 'Data Structures', icon: 'codeforces' },
      { name: 'Algorithms', icon: 'leetcode' },
      { name: 'OOP', icon: 'gnubash' },
    ],
  },
  {
    category: 'Linguistics',
    iconName: 'Code',
    items: [
      { name: 'English (Fluent)', icon: 'googletranslate' },
      { name: 'Japanese (Learning)', icon: 'duolingo' },
      { name: 'Arabic (Learning)', icon: 'rosettastone' },
      { name: 'Bengali (Native)', icon: 'google' },
    ],
  },
  {
    category: 'Tools & OS',
    iconName: 'Wrench',
    items: [
      { name: 'Git & GitHub', icon: 'github' },
      { name: 'VS Code', icon: 'visualstudiocode' },
      { name: 'Firebase', icon: 'firebase' },
      { name: 'Linux / Ubuntu', icon: 'ubuntu' },
    ],
  },
];

const DEFAULT_EXPERIENCE = [
  {
    role: 'Senior Software Engineer',
    company: 'TechNova Inc.',
    period: '2023 - Present',
    desc: 'Leading a team of 5 engineers to build a scalable microservices architecture.',
    achievements: [
      'Improved app load times by 40%',
      'Implemented robust CI/CD pipelines',
      'Mentored 3 junior developers',
    ],
    order: 1,
  },
  {
    role: 'Full Stack Developer',
    company: 'Creative Agency',
    period: '2020 - 2023',
    desc: 'Developed and maintained 20+ client websites and web applications.',
    achievements: [
      'Delivered 30+ projects on time',
      'Migrated legacy monoliths to JAMstack',
      'Achieved 100% accessibility scores',
    ],
    order: 2,
  },
];

const DEFAULT_PROJECTS = [
  {
    title: 'Quantum Dashboard',
    category: 'Dashboard',
    tags: ['React', 'WebGL'],
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'E-Commerce OS',
    category: 'SaaS',
    tags: ['Next.js', 'Stripe'],
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Nebula Chat',
    category: 'Web App',
    tags: ['Firebase', 'WebRTC'],
    image:
      'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Fintech Wallet',
    category: 'Mobile',
    tags: ['React Native', 'Redux'],
    image:
      'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=800',
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    author: 'Alex Rivera',
    position: 'Product Manager at TechNova',
    quote:
      "One of the most dedicated developers I've worked with. Delivered our complex dashboard ahead of schedule and with pristine code quality.",
    avatarUrl: '',
  },
  {
    author: 'Samantha Lee',
    position: 'Founder, Creative Agency',
    quote:
      'A true professional who understands both the technical and design aspects of modern web development. Highly recommended!',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
];

const DEFAULT_CERTIFICATIONS = [
  {
    title: 'CCNA',
    fullName: 'Cisco Certified Network Associate',
    issuer: 'Cisco',
    description:
      'The CCNA certification validates your skills and knowledge in network fundamentals.\n\n### Key Areas Covered:\n- Routing and Switching\n- Network Security Basics',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg',
    verifyUrl: 'https://www.credly.com',
    issuedDate: '2024-06',
    expiryDate: '2027-06',
    tags: ['Networking', 'Security', 'Cisco'],
  },
  {
    title: 'AWS Cloud Practitioner',
    fullName: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    description:
      'This certification validates overall understanding of the AWS Cloud platform.\n\n### Key Areas Covered:\n- Core AWS services (EC2, S3, RDS)',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    verifyUrl: 'https://www.credly.com',
    issuedDate: '2024-08',
    expiryDate: '2027-08',
    tags: ['Cloud', 'AWS'],
  },
];

const DEFAULT_BLOG_POSTS = [
  {
    title: 'Building a Modern Developer Portfolio',
    slug: 'modern-developer-portfolio',
    coverImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    tags: ['React', 'Firebase', 'Design'],
    content:
      'Building a portfolio is a great way to showcase your skills. Here is how I built this site using **React** and **Firebase**.\n\n### The Architecture\nWe used Vite, Tailwind, and Firebase Firestore for a fully dynamic setup.',
    isPublished: true,
  },
  {
    title: 'Understanding React Server Components',
    slug: 'react-server-components',
    coverImage:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    tags: ['React', 'Next.js'],
    content:
      'Server components represent a fundamental shift in how we build React applications. They allow us to render components exclusively on the server, reducing the JavaScript bundle size.',
    isPublished: true,
  },
];

const DEFAULT_JOURNAL_ENTRIES = [
  {
    title: 'Reflections on Clean Code',
    category: 'Code',
    content:
      "Writing clean code is not about making it look pretty; it's about making it understandable for the next developer who has to maintain it. Today I refactored a massive legacy component into smaller, testable units.",
    isPublished: true,
  },
  {
    title: 'The Japanese Concept of Kaizen',
    category: 'Philosophy',
    content:
      "Kaizen translates to 'continuous improvement'. Applying this to both my coding journey and language studies has profoundly shifted my mindset from seeking perfection to seeking progress.",
    isPublished: true,
  },
];

/**
 * Seeds the Firestore database with default configuration and dummy data.
 * Used primarily for setting up the initial application state or for demonstration.
 * Creates records in the `projects`, `career`, `testimonials`, `certifications`,
 * `blogPosts`, and `journalEntries` collections, marking them with `isSeed: true`.
 * 
 * @async
 * @returns {Promise<void>}
 */
export async function seedDatabase() {
  try {
    // 1. Seed Config (Main Site Config)
    // We don't mark the main config as `isSeed` since we don't want to delete the site config.
    await setDoc(doc(db, 'config', 'main'), {
      skills: DEFAULT_SKILLS,
    });

    let pastDays = 5;

    // Helper to seed a collection
    const seedCollection = async (collectionName, dataArray) => {
      for (const item of dataArray) {
        pastDays++;
        // Create an artificial past date for ordering
        const mockDate = new Date();
        mockDate.setDate(mockDate.getDate() - pastDays);

        await addDoc(collection(db, collectionName), {
          ...item,
          isSeed: true, // Flag to identify seeded data
          createdAt: mockDate.toISOString(),
          publishedAt: mockDate.toISOString(),
          date: mockDate.toISOString(), // For journal entries
        });
      }
    };

    await seedCollection(COLLECTIONS.PROJECTS, DEFAULT_PROJECTS);
    await seedCollection(COLLECTIONS.CAREER, DEFAULT_EXPERIENCE);
    await seedCollection(COLLECTIONS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
    await seedCollection(COLLECTIONS.CERTIFICATIONS, DEFAULT_CERTIFICATIONS);
    await seedCollection(COLLECTIONS.BLOG, DEFAULT_BLOG_POSTS);
    await seedCollection(COLLECTIONS.JOURNAL, DEFAULT_JOURNAL_ENTRIES);

    alert('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    alert('Error seeding database. Check console.');
  }
}

/**
 * Scans the primary Firestore collections and deletes all documents that were
 * marked as seeded (`isSeed: true`). Helpful for cleaning up the workspace
 * before entering real production data.
 * 
 * @async
 * @returns {Promise<void>}
 */
export async function deleteSeededData() {
  const collectionsToClean = [
    COLLECTIONS.PROJECTS,
    COLLECTIONS.CAREER,
    COLLECTIONS.TESTIMONIALS,
    COLLECTIONS.CERTIFICATIONS,
    COLLECTIONS.BLOG,
    COLLECTIONS.JOURNAL,
  ];

  try {
    let deletedCount = 0;
    for (const colName of collectionsToClean) {
      const colRef = collection(db, colName);
      const q = query(colRef, where('isSeed', '==', true));
      const snapshot = await getDocs(q);

      for (const document of snapshot.docs) {
        await deleteDoc(doc(db, colName, document.id));
        deletedCount++;
      }
    }

    alert(`Successfully deleted ${deletedCount} seeded items.`);
  } catch (error) {
    console.error('Error deleting seeded data:', error);
    alert('Error deleting seeded data. Check console.');
  }
}
