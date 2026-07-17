SKILL.md — Dynamic Portfolio CMS: Master Implementation Blueprint
Agent Directive: This document is the single source of truth for building the dynamic portfolio CMS. Follow every section precisely. Do NOT deviate from the schema, file structure, or execution order unless explicitly told to by the user.

0. Project Metadata
Key	Value
Project Name	my-portfolio
Firebase Project ID	my-portfolio-34630
Firebase Hosting Site	shahariar-sr
Admin Email	shahariar.sabbir.101@gmail.com
Owner	MD Shahariar Sabbir Riton
Stack	React 19 + Vite 8 + Tailwind CSS 4 + Firebase 12
Project Root	/mnt/PROJECTS/my-portfolio
1. Current State Analysis
The existing project is a 1,367-line monolithic single-file React app (src/App.jsx) with:

All components, data, styles, and admin logic in a single file.
Hardcoded mock data (DEFAULT_PERSONAL_INFO, DEFAULT_PROJECTS, etc.) with a basic Firestore onSnapshot listener on a single deeply-nested document path: artifacts/{appId}/public/data/portfolioState/main.
A rudimentary modal-based admin panel using a generic recursive DynamicForm component.
No routing — single-page scroll navigation only, using element.scrollIntoView().
Theme toggle via local isDark state — not persisted (resets on page refresh). Initializes from prefers-color-scheme media query.
Firebase Auth already wired: signInWithEmailAndPassword for admin, signInAnonymously for visitors. Admin check is !user.isAnonymous (insecure — any email user is admin).
An animated ThemeAdaptiveCaterpillar component (CSS + requestAnimationFrame physics) and TypewriterHeadline.
Tailwind CSS v4 with @tailwindcss/vite plugin and class-based dark mode: @custom-variant dark (&:where(.dark, .dark *)).
Inline <style dangerouslySetInnerHTML> block containing all custom @keyframes animations.
A dataconnect/ folder with an unrelated schema (Recipe/Trigger/Generation) — ignore this entirely.
Existing dependencies: react@19, react-dom@19, firebase@12, tailwindcss@4, @tailwindcss/vite@4, lucide-react@0.470, gh-pages@6.
Critical Migration Notes
The entire app will be restructured from a single-file scroll-page into a multi-route SPA with 45+ files.
The existing App.jsx will be fully decomposed — nothing should remain in it except the router and provider wrappers.
The ThemeAdaptiveCaterpillar will be completely redesigned using framer-motion (see Section 7).
All other existing animations (typewriter, kinetic text, reveals, leaf) will be preserved and migrated to their own component files.
The Firestore data path will change from nested artifacts/{appId}/... to root-level collections.
Remove signInAnonymously() — public reads don't require authentication with proper security rules.
2. Database Schema (Firebase Firestore)
All collections live at the root level of Firestore. There are 7 collections total.

2.1 projects Collection

projects/{projectId}  (auto-generated ID)
├── title: string                  // "Quantum Dashboard"
├── slug: string                   // "quantum-dashboard" (URL-safe, unique, auto-generated from title)
├── description: string            // Short card description (1-2 sentences)
├── content: string                // Full Markdown body for project detail page
├── categories: string[]           // ["Web App", "SaaS"] — dynamic array, used for filtering
├── tags: string[]                 // ["React", "WebGL", "Firebase"] — tech stack tags
├── imageUrl: string               // Hero/thumbnail image URL (Firebase Storage or external)
├── galleryUrls: string[]          // Additional screenshot URLs
├── liveUrl: string                // Live demo link (external)
├── repoUrl: string                // GitHub repository link
├── featured: boolean              // true = show on homepage hero section
├── status: string                 // "published" | "draft" | "archived"
├── order: number                  // Manual sort order (lower = first)
├── createdAt: Timestamp           // serverTimestamp() on creation
└── updatedAt: Timestamp           // serverTimestamp() on every update
2.2 blogs Collection

blogs/{blogId}  (auto-generated ID)
├── title: string                  // "Mastering React Server Components"
├── slug: string                   // "mastering-react-server-components"
├── excerpt: string                // 160-char summary for cards & SEO meta description
├── content: string                // Full Markdown body (rendered via react-markdown)
├── categories: string[]           // ["Engineering", "Frontend"] — dynamic array
├── tags: string[]                 // ["React", "RSC", "Performance"]
├── coverImageUrl: string          // Hero image for the blog post
├── featured: boolean              // true = highlight in blog grid (spans 2 columns)
├── status: string                 // "published" | "draft"
├── readTimeMinutes: number        // Estimated read time (auto-calculated: word count / 200)
├── author: string                 // Author display name (default: site owner)
├── createdAt: Timestamp
└── updatedAt: Timestamp
2.3 journals Collection (Daily / Backdated Calendar Logging)

journals/{journalId}  (auto-generated ID)
├── title: string                  // "Day 45: Deep Dive into WebGL"
├── content: string                // Markdown body (personal reflection/log)
├── mood: string                   // "productive" | "learning" | "struggling" | "celebrating"
├── tags: string[]                 // ["webgl", "graphics", "milestone"]
├── entryDate: string              // "2026-07-16" — ISO date string (YYYY-MM-DD)
│                                  // ↑ This is the LOGICAL date. Supports backdating!
│                                  //   The admin can select any past date in the date picker.
├── status: string                 // "published" | "private"
├── createdAt: Timestamp           // Actual creation timestamp (when the doc was written)
└── updatedAt: Timestamp
Calendar Logic: The entryDate field is a plain ISO date string (NOT a Firestore Timestamp), enabling the admin to backdate journal entries to any past date. The calendar heatmap UI queries by entryDate range using string comparison (>= and <=). The createdAt Timestamp tracks when the entry was actually written.

2.4 career Collection

career/{careerId}  (auto-generated ID)
├── type: string                   // "experience" | "education" | "certification"
├── role: string                   // "Senior Software Engineer" or "BSc in CSE"
├── organization: string           // "TechNova Inc." or "RUET"
├── location: string               // "Rajshahi, Bangladesh"
├── startDate: string              // "2023-01" (YYYY-MM format)
├── endDate: string                // "present" or "2025-06" (YYYY-MM or literal "present")
├── description: string            // Summary paragraph
├── achievements: string[]         // ["Improved load times by 40%", ...]
├── skills: string[]               // ["React", "Node.js", "CI/CD"]
├── order: number                  // Manual sort order
├── createdAt: Timestamp
└── updatedAt: Timestamp
2.5 reviews Collection

reviews/{reviewId}  (auto-generated ID)
├── name: string                   // "Sarah Jenkins"
├── role: string                   // "CTO at TechNova"
├── avatarUrl: string              // Reviewer's photo URL
├── text: string                   // The testimonial body text
├── rating: number                 // 1–5 integer (star rating)
├── projectRef: string             // Optional: linked project slug (can be empty string)
├── featured: boolean              // true = show on homepage testimonials section
├── status: string                 // "published" | "pending" | "hidden"
├── createdAt: Timestamp
└── updatedAt: Timestamp
2.6 contactMessages Collection

contactMessages/{messageId}  (auto-generated ID)
├── name: string                   // Sender's name
├── email: string                  // Sender's email address
├── message: string                // Message body text
├── isRead: boolean                // false on creation; admin marks as read
├── isArchived: boolean            // false on creation; admin can archive
├── createdAt: Timestamp           // serverTimestamp() on creation
Public Write Access: This is the ONLY collection that allows unauthenticated writes. The security rules must validate that name, email, and message fields are present, non-empty strings, and that isRead and isArchived default to false.

2.7 siteConfig Collection (Singleton Document)

siteConfig/main  (fixed document ID: "main")
├── personalInfo: map
│   ├── name: string               // "MD Shahariar Sabbir Riton"
│   ├── role: string               // "CSE Student & Web Developer"
│   ├── tagline: string            // Bio paragraph
│   ├── email: string              // "hello@your-email.com"
│   ├── resumeUrl: string          // "/Shahariar_Sabbir_Resume.docx" or Firebase Storage URL
│   └── socials: map
│       ├── github: string
│       ├── linkedin: string
│       ├── twitter: string
│       └── email: string
├── manifesto: array<map>
│   └── [{ id: string, title: string, desc: string }, ...]
├── skills: array<map>
│   └── [{ category: string, iconName: string, items: string[] }, ...]
├── seo: map
│   ├── siteTitle: string          // "Shahariar Sabbir — Portfolio"
│   ├── siteDescription: string    // Meta description
│   └── ogImageUrl: string         // Open Graph image URL
└── updatedAt: Timestamp
2.8 Firestore Security Rules
Deploy this as firestore.rules in the project root:

javascript

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper: Check if the requester is the admin
    function isAdmin() {
      return request.auth != null
          && request.auth.token.email == 'shahariar.sabbir.101@gmail.com';
    }
    // Public content collections: anyone can read, only admin can write
    match /projects/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /blogs/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /journals/{docId} {
      // Only published journals are publicly readable
      allow read: if resource.data.status == 'published' || isAdmin();
      allow write: if isAdmin();
    }
    match /career/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /reviews/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /siteConfig/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    // Contact messages: anyone can CREATE (submit form), only admin can read/update/delete
    match /contactMessages/{docId} {
      allow create: if request.resource.data.keys().hasAll(['name', 'email', 'message'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.email is string
                    && request.resource.data.email.size() > 0
                    && request.resource.data.message is string
                    && request.resource.data.message.size() > 0
                    && request.resource.data.isRead == false
                    && request.resource.data.isArchived == false;
      allow read, update, delete: if isAdmin();
    }
  }
}
2.9 Firebase Storage Security Rules
Deploy as storage.rules:

javascript

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read for all uploaded images
    match /portfolio/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == 'shahariar.sabbir.101@gmail.com'
                   && request.resource.size < 5 * 1024 * 1024  // 5MB max
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
3. Routing Architecture
3.1 Route Map (react-router-dom v7, createBrowserRouter)
Route	Component	Access	Description
/	HomePage	Public	Landing page composing all portfolio sections
/projects	ProjectsPage	Public	All projects grid with category filters
/projects/:slug	ProjectDetailPage	Public	Individual project detail (Markdown rendered)
/blog	BlogPage	Public	Blog listing grid with category filters
/blog/:slug	BlogPostPage	Public	Individual blog post (Markdown rendered)
/journal	JournalPage	Public	Public journal with calendar heatmap
/journal/:entryDate	JournalEntryPage	Public	Single journal entry view (by date)
/career	CareerPage	Public	Timeline of experience + education + certs
/admin	AdminLayout → AdminDashboard	Protected	Dashboard overview (stats, recent activity)
/admin/projects	AdminProjects	Protected	Project list table with CRUD actions
/admin/projects/new	AdminProjectForm	Protected	Create new project
/admin/projects/:id/edit	AdminProjectForm	Protected	Edit existing project
/admin/blogs	AdminBlogs	Protected	Blog list table with CRUD actions
/admin/blogs/new	AdminBlogForm	Protected	Create new blog with Markdown editor
/admin/blogs/:id/edit	AdminBlogForm	Protected	Edit existing blog
/admin/journals	AdminJournals	Protected	Journal calendar heatmap + entry list
/admin/journals/new	AdminJournalForm	Protected	Create/backdate journal entry
/admin/journals/:id/edit	AdminJournalForm	Protected	Edit journal entry
/admin/career	AdminCareer	Protected	Career item list with CRUD
/admin/career/new	AdminCareerForm	Protected	Create career item
/admin/career/:id/edit	AdminCareerForm	Protected	Edit career item
/admin/reviews	AdminReviews	Protected	Reviews list with CRUD
/admin/reviews/new	AdminReviewForm	Protected	Create review
/admin/reviews/:id/edit	AdminReviewForm	Protected	Edit review
/admin/messages	AdminMessages	Protected	View/manage contact form submissions
/admin/settings	AdminSettings	Protected	Edit siteConfig (personal info, manifesto, skills, SEO)
/admin/login	AdminLoginPage	Public	Standalone login page (not inside AdminLayout)
*	NotFoundPage	Public	Styled 404 page
3.2 Authentication Flow

User navigates to /admin/*
        │
        ▼
┌─────────────────────────┐
│   ProtectedRoute.jsx    │
│   (wrapper component)   │
└────────────┬────────────┘
             │
    ┌────────▼────────┐
    │ useAuth() hook  │
    │ checks state    │
    └────────┬────────┘
             │
     ┌───────┴───────┐
     │               │
  loading?       not loading
     │               │
     ▼               ▼
  Show          ┌────┴────┐
  Spinner       │         │
                │    user == null?
                │         │
             ┌──┴──┐   ┌──┴──┐
             │ YES │   │ NO  │
             └──┬──┘   └──┬──┘
                │         │
                ▼         ▼
         Navigate    user.email ===
         to          "shahariar.sabbir.101@gmail.com"?
         /admin/          │
         login       ┌────┴────┐
                     │ YES     │ NO
                     ▼         ▼
                  Render    Navigate to /
                  <Outlet>  with error toast
Key Implementation Details:

ProtectedRoute is a component that wraps <Outlet />. It uses the useAuth() hook.
AuthContext listens to onAuthStateChanged(auth, callback) and stores { user, isAdmin, loading }.
isAdmin is computed as: user !== null && user.email === 'shahariar.sabbir.101@gmail.com'.
The /admin/login page is a standalone page (not nested inside AdminLayout). After successful login, it redirects to /admin.
Remove the existing signInAnonymously() call entirely. Public visitors do not need Firebase Auth — the Firestore rules allow public reads without authentication.
The login form uses signInWithEmailAndPassword(auth, email, password).
Logout calls signOut(auth) and redirects to /.
4. State & Theme Management
4.1 Theme Architecture (ThemeContext)

ThemeProvider (wraps entire app at top level)
│
├── State: theme = 'dark' | 'light'
│
├── Initialization Priority (on mount):
│   1. Read localStorage.getItem('portfolio-theme')
│   2. If null → check window.matchMedia('(prefers-color-scheme: dark)').matches
│   3. If dark → 'dark', else 'light'
│   4. Fallback default: 'dark'
│
├── On theme change:
│   1. document.documentElement.classList.toggle('dark', theme === 'dark')
│   2. localStorage.setItem('portfolio-theme', theme)
│
├── Exposed via useTheme() hook:
│   { theme, isDark, toggleTheme }
│
└── Scope: Wraps EVERYTHING including admin routes.
    The admin dashboard uses the same dark/light theme as the public site.
Tailwind Integration: The existing @custom-variant dark (&:where(.dark, .dark *)) in index.css already supports class-based dark mode. The ThemeProvider toggles the dark class on <html>.

4.2 Auth Architecture (AuthContext)

AuthProvider (wraps entire app, inside ThemeProvider)
│
├── State: { user, isAdmin, loading }
│
├── On mount: onAuthStateChanged(auth, (user) => {
│     setUser(user);
│     setIsAdmin(user?.email === 'shahariar.sabbir.101@gmail.com');
│     setLoading(false);
│   })
│
├── Exposed via useAuth() hook:
│   { user, isAdmin, loading, login(email, pw), logout() }
│
├── login(email, password):
│   → signInWithEmailAndPassword(auth, email, password)
│
└── logout():
    → signOut(auth)
    → navigate('/')
4.3 Site Config Architecture (SiteConfigContext)

SiteConfigProvider (wraps app, inside AuthProvider)
│
├── State: { config, loading }
│
├── On mount: onSnapshot(doc(db, 'siteConfig', 'main'), (snap) => {
│     if (snap.exists()) setConfig(snap.data());
│     setLoading(false);
│   })
│
└── Exposed via useSiteConfig() hook:
    { config, loading }
    → Used by Navbar (name), Footer (socials), HomePage (tagline, manifesto, skills)
4.4 Provider Nesting Order (in App.jsx)
jsx

<ThemeProvider>
  <AuthProvider>
    <SiteConfigProvider>
      <RouterProvider router={router} />
    </SiteConfigProvider>
  </AuthProvider>
</ThemeProvider>
4.5 No Global Store Needed
Concern	Solution
Authentication	AuthContext + useAuth()
Theme	ThemeContext + useTheme()
Site Config	SiteConfigContext + useSiteConfig()
Collection Data	Local useState + custom useFirestoreCollection() hook per page
Form State	Local component state within each admin form
Notifications	Local useState in a <Toast /> component rendered in App
Do NOT install Redux, Zustand, Jotai, or any external state management library.

5. Admin UI Components
5.1 Admin Dashboard Component Tree

AdminLayout.jsx
├── AdminSidebar.jsx
│   ├── Logo ("SR." gradient text) + theme toggle button
│   ├── Navigation Links:
│   │   ├── NavLink → /admin (Dashboard icon + "Dashboard")
│   │   ├── NavLink → /admin/projects (Folder icon + "Projects")
│   │   ├── NavLink → /admin/blogs (FileText icon + "Blogs")
│   │   ├── NavLink → /admin/journals (Calendar icon + "Journals")
│   │   ├── NavLink → /admin/career (Briefcase icon + "Career")
│   │   ├── NavLink → /admin/reviews (Star icon + "Reviews")
│   │   ├── NavLink → /admin/messages (Mail icon + "Messages" + unread badge)
│   │   └── NavLink → /admin/settings (Settings icon + "Settings")
│   ├── Divider
│   └── LogoutButton (LogOut icon + "Logout")
│
├── AdminHeader.jsx
│   ├── Mobile menu toggle (hamburger for sidebar on mobile)
│   ├── Breadcrumbs (auto-generated from route path)
│   └── User info (email display + avatar placeholder)
│
└── <Outlet /> ← nested admin page renders here
The AdminLayout is a flex container: sidebar (fixed 256px on desktop, drawer on mobile) + main content area with header.

5.2 Reusable Admin Components
Component	File	Description
AdminTable	components/admin/AdminTable.jsx	Reusable data table. Props: columns[], data[], onEdit(id), onDelete(id). Renders: status badges, action buttons, empty state.
AdminFormShell	components/admin/AdminFormShell.jsx	Consistent form wrapper. Props: title, onSave(), onCancel(), isLoading, children. Renders: page title, save/cancel/delete buttons in a sticky footer bar.
MarkdownEditor	components/admin/MarkdownEditor.jsx	Split-pane Markdown editor (see Section 5.3 below).
ImageUploader	components/admin/ImageUploader.jsx	Drag-and-drop image upload to Firebase Storage path portfolio/{collection}/{filename}. Returns the download URL. Shows upload progress bar. Preview thumbnail after upload.
CategoryTagInput	components/admin/CategoryTagInput.jsx	Tokenized chip input. User types a tag, presses Enter → chip appears. Click X on chip to remove. Props: value: string[], onChange(newArray), placeholder.
StatusBadge	components/ui/StatusBadge.jsx	Colored pill badge. Green = "published", Yellow = "draft", Red = "archived"/"hidden", Blue = "pending".
ConfirmDialog	components/ui/ConfirmDialog.jsx	Modal confirmation dialog for destructive actions (delete). Uses <dialog> element with backdrop blur.
Toast	components/ui/Toast.jsx	Notification toast (success/error/info). Auto-dismiss after 4 seconds. Fixed bottom-right position. Animated entrance/exit via framer-motion.
CalendarHeatmap	components/admin/CalendarHeatmap.jsx	GitHub-style contribution heatmap for journal entries. Custom SVG. Shows 52 weeks (1 year). Cell color intensity based on entry mood. Click a cell → navigate to that date's journal entry or create new.
5.3 Markdown Editor Integration (Blog & Journal Forms)

MarkdownEditor.jsx
│
├── Props: { value: string, onChange(newValue): void }
│
├── State: viewMode = 'edit' | 'split' | 'preview' (default: 'split')
│
├── Toolbar Row:
│   ├── Format buttons: Bold(**), Italic(*), Heading(#), Link([]()), Image(![]())
│   ├── Block buttons: Code Block(```), Blockquote(>), UL(-), OL(1.)
│   ├── View toggle: [Edit] [Split] [Preview] segmented control
│   └── Stats: Word count • Estimated read time (words / 200)
│
├── Editor Pane (left in split mode):
│   └── <textarea>
│       - className: monospace font (font-mono), full height
│       - Keyboard shortcuts: Ctrl+B (bold), Ctrl+I (italic), Ctrl+K (link)
│       - Tab key inserts 2 spaces (preventDefault + insert)
│       - Auto-grow height based on content
│
└── Preview Pane (right in split mode):
    └── <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          className="prose dark:prose-invert max-w-none"
        >
          {value}
        </ReactMarkdown>
        - Renders GitHub Flavored Markdown (tables, strikethrough, task lists)
        - Syntax-highlighted code blocks via highlight.js
        - Theme-aware: uses `prose-invert` in dark mode
        - Custom styles in styles/markdown.css for code block backgrounds,
          table borders, blockquote accents matching the theme
Dependencies: react-markdown, remark-gfm, rehype-highlight

5.4 Admin Form: Journal (with Calendar + Backdating)

AdminJournalForm.jsx
│
├── CalendarHeatmap (read-only overview of existing entries)
│   └── Clicking an empty cell pre-fills the date picker with that date
│
├── Form Fields:
│   ├── DatePicker: <input type="date"> styled with Tailwind
│   │   └── value = entryDate (ISO string "YYYY-MM-DD")
│   │   └── Allows selecting ANY past date (backdating)
│   │
│   ├── TitleInput: <input type="text">
│   │
│   ├── MoodSelector: Radio group with emoji labels
│   │   ├── 🚀 Productive (value: "productive")
│   │   ├── 📚 Learning (value: "learning")
│   │   ├── 😤 Struggling (value: "struggling")
│   │   └── 🎉 Celebrating (value: "celebrating")
│   │
│   ├── CategoryTagInput (tags array)
│   │
│   ├── MarkdownEditor (content)
│   │
│   └── StatusToggle: "Published" / "Private" switch
│
└── Save → addDoc/updateDoc to journals/{id}
    └── Sets createdAt on new docs, updatedAt on all saves
5.5 Admin Dashboard Overview (AdminDashboard.jsx)
The /admin index route shows:

Stats cards: Total Projects, Total Blogs, Total Journal Entries, Unread Messages (with count badge)
Recent Activity: Last 5 updated items across all collections (sorted by updatedAt)
Quick Actions: "New Project", "New Blog Post", "New Journal Entry" buttons
6. Design & Theme Specifications
6.1 Dark Mode — "Parrot OS / Hacker" Aesthetic
Token	Value	Usage
--bg-primary	#030712 (gray-950)	Page background
--bg-secondary	#0a0a0a	Alternating section backgrounds
--bg-card	rgba(255, 255, 255, 0.05)	Glassmorphism card backgrounds
--bg-nav	rgba(5, 5, 5, 0.80)	Sticky navbar background
--border	#1e293b (slate-800)	All borders
--text-primary	#f1f5f9 (slate-100)	Body text
--text-muted	#94a3b8 (slate-400)	Secondary/muted text
--accent-cyan	#06b6d4	Primary accent — CTAs, glows, links
--accent-fuchsia	#d946ef	Secondary accent — admin UI, tags
--accent-green	#10b981	Success states, caterpillar segments
--glow-cyan	0 0 15px rgba(6, 182, 212, 0.4)	Card hover glow shadow
--glow-fuchsia	0 0 20px rgba(217, 70, 239, 0.15)	Admin card hover glow
Glassmorphism	backdrop-blur-md + bg-white/5	Navbar, project cards, admin sidebar
6.2 Light Mode — "Colorful Clean Code" Aesthetic
Token	Value	Usage
--bg-primary	#F8F9FA	Page background
--bg-secondary	#FFFFFF	Cards, modals
--bg-nav	rgba(248, 249, 250, 0.70)	Sticky navbar background
--border	#e2e8f0 (slate-200)	All borders
--text-primary	#1e293b (slate-800)	Body text — deep charcoal
--text-muted	#64748b (slate-500)	Secondary text
--syntax-purple	#8b5cf6 (violet-500)	Category tags, active nav states
--syntax-cyan	#06b6d4 (cyan-500)	Links, interactive elements, hover borders
--syntax-orange	#f97316 (orange-500)	Buttons, warm accents, hover borders
--syntax-green	#22c55e (green-500)	Success states, caterpillar body
--syntax-rose	#f43f5e (rose-500)	Delete buttons, error states
Card Hover	Border transitions to vibrant syntax colors	Interactive feedback
6.3 Animation Specifications
Animation	Library	Details
Page Transitions	framer-motion	<AnimatePresence mode="wait"> wrapping route <Outlet>. Each page: initial={{ opacity: 0, y: 20 }} → animate={{ opacity: 1, y: 0 }} → exit={{ opacity: 0, y: -10 }}. Duration: 0.3s, ease: [0.25, 0.1, 0.25, 1].
Cursor Trail	framer-motion	Track onMouseMove on <body>. Render 10 trailing circles via motion.div. Each circle: width: 8px, absolute positioned, background cycles through accent palette, opacity decreases for older circles. transition: { duration: 0.5, ease: 'linear' }. Desktop only — hide on (pointer: coarse) or (max-width: 768px).
Walking Cat	lottie-react	Use public Lottie URL: https://lottie.host/c4f1b7d8-3e5a-4def-85eb-3e3a1c64e68e/KHEnPEHBIE.json (or similar walking cat). Fixed position bottom-4 right-4. Size: w-16 h-16. Loop infinitely. pointer-events: none. Subtle opacity in dark mode (opacity-60), full in light mode.
Scroll Reveals	framer-motion	Replace existing Reveal component's IntersectionObserver with framer-motion's useInView hook + motion.div. Same effect: fade up from opacity: 0, y: 48px to opacity: 1, y: 0. Staggered delays preserved.
Typewriter	React (keep existing)	Migrate the existing TypewriterHeadline component as-is. It works well with pure React state + setTimeout.
Caterpillar	framer-motion	Complete redesign — see Section 7 below.
Kinetic Text	CSS	Migrate existing @keyframes kinetic to animations.css.
7. Caterpillar Redesign Specification
DIRECTIVE: Do NOT migrate the existing ThemeAdaptiveCaterpillar as-is. Completely redesign it with framer-motion for smoother physics, better interactivity, and more fluid animations that fit the "Parrot OS / Colorful Clean Code" themes.

7.1 Visual Design

NEW Caterpillar Design — "Neon Crawler"
│
├── Structure: 6 connected circular segments (tail → head)
│   ├── Segment 1 (tail): 10px diameter
│   ├── Segment 2: 14px diameter
│   ├── Segment 3: 18px diameter
│   ├── Segment 4: 22px diameter
│   ├── Segment 5: 26px diameter
│   └── Segment 6 (head): 34px diameter — has eyes, antennae, mouth
│
├── Dark Mode Colors (Neon Glow):
│   ├── Segments: gradient from #06b6d4 (cyan) → #8b5cf6 (violet) → #d946ef (fuchsia)
│   ├── Each segment has a soft neon glow: box-shadow with matching color at 40% opacity
│   ├── Eyes: white with #030712 pupils
│   ├── Antennae: #a78bfa (violet-400) with glowing tips
│   └── Overall: drop-shadow glow effect, feels like a neon creature crawling on a dark screen
│
├── Light Mode Colors (Candy / Nature):
│   ├── Segments: gradient from #22c55e (green) → #06b6d4 (cyan) → #8b5cf6 (violet)
│   ├── No neon glow — clean, solid colors with subtle shadow
│   ├── Eyes: white with #1e293b pupils
│   ├── Antennae: #92400e (amber-800) — organic insect look
│   └── Overall: flat, playful, like a colorful garden caterpillar
│
└── Size: Approximately 120px total length (all segments connected)
7.2 Physics Engine (framer-motion)
Replace the old requestAnimationFrame loop with framer-motion's useMotionValue, useSpring, and useAnimationFrame.


Physics System:
│
├── Position Tracking:
│   ├── headX = useMotionValue(window.innerWidth / 2)
│   ├── headY = useMotionValue(window.innerHeight / 2)
│   ├── Each body segment follows the previous one with spring physics:
│   │   └── useSpring(previousSegment.x, { stiffness: 150, damping: 20 })
│   │       → Creates a smooth "chain follow" effect where each segment
│   │         trails behind the one in front of it
│   └── Head rotation: calculated from movement direction via Math.atan2()
│       └── Smoothed with useSpring({ stiffness: 100, damping: 15 })
│
├── Movement Modes:
│   ├── WANDERING (default):
│   │   ├── Perlin-noise-like path using sine waves with varying frequencies
│   │   ├── Speed: 0.3–0.5 px/frame (very slow, ambient)
│   │   ├── Path: Lissajous curve across the full viewport
│   │   └── Segment squirm: each segment has a subtle y-offset oscillation
│   │
│   ├── FOLLOWING_CURSOR:
│   │   ├── Activates when cursor is within 200px of the caterpillar head
│   │   ├── Head smoothly moves toward cursor position
│   │   ├── Speed: 2–3 px/frame (curious, approaching)
│   │   ├── When within 40px of cursor: stops and "looks" at cursor
│   │   └── Eyes track cursor position (pupil offset toward cursor)
│   │
│   ├── SCROLLING:
│   │   ├── On page scroll: caterpillar zips to right edge as a "scroll indicator"
│   │   ├── Y position maps to scroll percentage
│   │   ├── Segments compress (scale down to 0.4x)
│   │   ├── Speed: 8 px/frame (fast zip)
│   │   └── After 250ms of no scroll: returns to WANDERING mode
│   │
│   ├── DRAGGING:
│   │   ├── User can grab the caterpillar (pointer down on any segment)
│   │   ├── Head follows pointer directly (no spring delay)
│   │   ├── Body segments trail with exaggerated spring physics (stiffness: 80)
│   │   ├── Cursor changes to `grabbing`
│   │   └── On release: if minimal movement → trigger DANCING; else → WANDERING
│   │
│   └── DANCING:
│       ├── Triggered by clicking/tapping the caterpillar
│       ├── All segments bounce with staggered timing
│       ├── Rotation oscillates ±20° with spring physics
│       ├── Eyes close (happy arches), mouth opens
│       ├── Small particle burst (3-5 emoji: ✨🎉💜) using framer-motion
│       ├── Duration: 2.5 seconds → returns to WANDERING
│       └── Confetti-like particles animate outward and fade
│
├── Spring Config Presets:
│   ├── FOLLOW_SPRING: { stiffness: 150, damping: 20 }      // body following
│   ├── ROTATION_SPRING: { stiffness: 100, damping: 15 }     // smooth rotation
│   ├── DRAG_SPRING: { stiffness: 80, damping: 12 }          // loose drag feel
│   └── CURSOR_SPRING: { stiffness: 200, damping: 25 }       // responsive cursor follow
│
└── Performance:
    ├── Use framer-motion's useAnimationFrame (not requestAnimationFrame directly)
    ├── All transforms via motion values (no React re-renders for position updates)
    ├── will-change: transform on the wrapper
    └── pointer-events: none on non-interactive elements, pointer-events: auto on hitbox
7.3 Interactivity Enhancements
Interaction	Old Behavior	New Behavior
Idle	Lissajous wandering, CSS animate-squirm-horiz	Perlin-like wandering, framer-motion spring-based segment following, subtle breathing scale oscillation on each segment
Near Cursor	No reaction	Head turns toward cursor within 200px, eyes track cursor, curious approach
Click/Tap	Dance for 2.5s (CSS bounce)	Dance with framer-motion spring bounce, particle burst (✨), happy eyes, staggered segment animation
Drag	Direct position set, basic rotation	Spring-physics drag with trailing body segments, exaggerated chain physics, playful bouncing on release
Scroll	Zip to right edge, minimize	Same concept but with framer-motion spring transition (smooth zip, not teleport), scale spring animation
Bottom of Page	"Eating" mode with tongue	Eating mode preserved — caterpillar moves toward the canvas leaf in the footer, happy eyes
Theme Change	Instant color swap	Colors transition smoothly (Tailwind transition-colors duration-500 on each segment)
7.4 Component File: src/components/ui/NeonCrawler.jsx
The new component is named NeonCrawler (replacing ThemeAdaptiveCaterpillar). It receives these props:

typescript

interface NeonCrawlerProps {
  scrollPercent: number;      // 0–100, from scroll listener
  isAtBottom: boolean;        // true when user scrolled to bottom
}
// Theme is read from useTheme() hook internally.
7.5 Segment Rendering (framer-motion)
Each segment is a motion.div with:

jsx

<motion.div
  style={{
    x: segmentX,       // useSpring following previous segment
    y: segmentY,       // useSpring following previous segment
    rotate: segmentRotation,
    scale: segmentScale,
    width: segmentSize,
    height: segmentSize,
  }}
  className={`rounded-full absolute ${segmentColorClass} ${isDark ? 'shadow-[0_0_12px_...]' : 'shadow-md'} transition-colors duration-500`}
/>
The head segment additionally contains:

Eyes: Two small motion.div circles with pupils that track cursor via useMotionValue offsets.
Antennae: Two motion.div lines with tip balls, animated with spring rotation.
Mouth: Conditional render — closed (arc) in normal mode, open (circle) when dancing/eating.
8. File / Folder Architecture

src/
├── main.jsx                          # Entry point. Imports: index.css, animations.css, App.jsx
├── App.jsx                           # Provider nesting + RouterProvider setup. Nothing else.
├── firebase.js                       # Firebase init: app, auth, db, storage exports
│
├── contexts/
│   ├── AuthContext.jsx               # AuthProvider + useAuth() hook
│   ├── ThemeContext.jsx              # ThemeProvider + useTheme() hook (localStorage persistence)
│   └── SiteConfigContext.jsx         # SiteConfigProvider + useSiteConfig() hook
│
├── hooks/
│   ├── useFirestoreCollection.js     # Generic hook: real-time collection query listener
│   │                                 # Params: (collectionName, { where?, orderBy?, limit? })
│   │                                 # Returns: { data: [], loading: boolean, error: Error? }
│   ├── useFirestoreDocument.js       # Generic hook: single document real-time listener
│   │                                 # Params: (collectionName, docId)
│   │                                 # Returns: { data: object, loading: boolean, error: Error? }
│   └── useMediaQuery.js              # Responsive breakpoint hook
│                                     # Params: (query: string) → boolean
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx                # Public sticky navbar with glassmorphism
│   │   │                             # Uses useSiteConfig() for name, useTheme() for toggle
│   │   │                             # Links: Home, Projects, Blog, Journal, Career
│   │   │                             # Mobile hamburger menu
│   │   ├── Footer.jsx                # Public footer: links, socials, canvas leaf, copyright
│   │   ├── PublicLayout.jsx          # Wraps Navbar + <Outlet /> + Footer + NeonCrawler + CursorTrail + LottieCat
│   │   ├── AdminLayout.jsx           # Admin shell: AdminSidebar + AdminHeader + <Outlet />
│   │   └── ProtectedRoute.jsx        # Auth guard: checks useAuth(), redirects if not admin
│   │
│   ├── ui/
│   │   ├── Reveal.jsx                # Scroll-reveal wrapper (framer-motion useInView)
│   │   ├── TypewriterHeadline.jsx    # Typewriter effect (migrated from App.jsx)
│   │   ├── KineticText.jsx           # Kinetic text animation (migrated)
│   │   ├── NeonCrawler.jsx           # ★ NEW caterpillar with framer-motion physics (Section 7)
│   │   ├── CanvasLeaf.jsx            # Canvas-drawn leaf in footer (migrated)
│   │   ├── CursorTrail.jsx           # Colorful trailing cursor (framer-motion, desktop only)
│   │   ├── LottieCat.jsx             # Ambient walking cat (lottie-react, fixed bottom-right)
│   │   ├── PageTransition.jsx        # AnimatePresence wrapper for route transitions
│   │   ├── StatusBadge.jsx           # Colored status pill (published/draft/archived)
│   │   ├── Toast.jsx                 # Notification toast (framer-motion animated)
│   │   └── ConfirmDialog.jsx         # <dialog> based confirmation modal
│   │
│   ├── sections/                     # Homepage section components (one per section)
│   │   ├── HeroSection.jsx           # Hero with TypewriterHeadline, CTAs, ambient glows
│   │   ├── ManifestoSection.jsx      # Bento grid manifesto cards
│   │   ├── SkillsSection.jsx         # Tech stack capsule cards
│   │   ├── ExperienceSection.jsx     # Timeline (reads from career collection, type=experience)
│   │   ├── ProjectsSection.jsx       # Featured projects grid (featured=true only)
│   │   ├── TestimonialsSection.jsx   # Carousel of reviews (featured=true only)
│   │   ├── BlogSection.jsx           # Latest 3 blog posts preview
│   │   └── ContactSection.jsx        # Contact form → writes to contactMessages collection
│   │
│   └── admin/
│       ├── AdminSidebar.jsx          # Sidebar navigation for admin
│       ├── AdminHeader.jsx           # Top bar with breadcrumbs, mobile toggle
│       ├── AdminTable.jsx            # Reusable CRUD table
│       ├── AdminFormShell.jsx        # Form wrapper with save/cancel footer
│       ├── MarkdownEditor.jsx        # Split-pane MD editor (Section 5.3)
│       ├── ImageUploader.jsx         # Firebase Storage drag-and-drop upload
│       ├── CategoryTagInput.jsx      # Tokenized tag/category chip input
│       └── CalendarHeatmap.jsx       # GitHub-style heatmap (SVG, for journals)
│
├── pages/
│   ├── public/
│   │   ├── HomePage.jsx              # Composes all section components
│   │   ├── ProjectsPage.jsx          # Full projects grid + category filter tabs
│   │   ├── ProjectDetailPage.jsx     # Single project: Markdown content + gallery + links
│   │   ├── BlogPage.jsx              # Blog listing grid + category filter tabs
│   │   ├── BlogPostPage.jsx          # Single blog post: Markdown content + metadata
│   │   ├── JournalPage.jsx           # Calendar heatmap + published entries list
│   │   ├── JournalEntryPage.jsx      # Single journal entry by entryDate
│   │   ├── CareerPage.jsx            # Full career timeline (experience + education + certs)
│   │   └── NotFoundPage.jsx          # Styled 404 page
│   │
│   └── admin/
│       ├── AdminLoginPage.jsx        # Standalone login page (not inside AdminLayout)
│       ├── AdminDashboard.jsx        # Overview: stats cards, recent activity, quick actions
│       ├── AdminProjects.jsx         # Projects list table
│       ├── AdminProjectForm.jsx      # Create/edit project form
│       ├── AdminBlogs.jsx            # Blogs list table
│       ├── AdminBlogForm.jsx         # Create/edit blog with MarkdownEditor
│       ├── AdminJournals.jsx         # Journal calendar + entry list
│       ├── AdminJournalForm.jsx      # Create/backdate journal with MarkdownEditor
│       ├── AdminCareer.jsx           # Career items list
│       ├── AdminCareerForm.jsx       # Create/edit career item
│       ├── AdminReviews.jsx          # Reviews list table
│       ├── AdminReviewForm.jsx       # Create/edit review form
│       ├── AdminMessages.jsx         # View contact form submissions (mark read/archive)
│       └── AdminSettings.jsx         # Edit siteConfig: personal info, manifesto, skills, SEO
│
├── styles/
│   ├── index.css                     # Tailwind @import + @custom-variant dark + body styles
│   ├── animations.css                # All @keyframes migrated from inline <style> block
│   └── markdown.css                  # Prose/typography styles for rendered Markdown content
│                                     # (.prose code block bg, table borders, blockquote accents)
│
├── lib/
│   ├── constants.js                  # Default seed data, mood options, icon map, Lottie URL
│   └── utils.js                      # slugify(title), formatDate(ts), calcReadTime(text),
│                                     # truncateText(str, len)
│
└── assets/
    ├── hero.png                      # Existing hero image
    ├── react.svg                     # Existing
    └── vite.svg                      # Existing
Total: ~48 files (excluding assets and config files).

9. Phase 1 Execution Steps
CRITICAL: Execute these steps IN ORDER. Each step depends on the previous one. Do not skip or reorder.

Step 1: Install New Dependencies
bash

cd /mnt/PROJECTS/my-portfolio
# Routing
npm install react-router-dom
# Animations
npm install framer-motion lottie-react
# Markdown rendering
npm install react-markdown remark-gfm rehype-highlight
# Date utilities
npm install date-fns
Do NOT install: Redux, Zustand, styled-components, Chakra UI, Material UI, or any CSS-in-JS library.
Do NOT uninstall any existing dependencies yet.

Step 2: Create src/firebase.js
Extract Firebase initialization from App.jsx lines 9–27 into a dedicated module. Export auth, db, storage, and app. Remove the __firebase_config/__app_id IDX-specific logic — use the hardcoded config directly.

Step 3: Create src/lib/constants.js and src/lib/utils.js
constants.js: Move DEFAULT_PERSONAL_INFO, DEFAULT_MANIFESTO, DEFAULT_SKILLS, DEFAULT_EXPERIENCE, DEFAULT_PROJECTS, DEFAULT_TESTIMONIALS, DEFAULT_BLOGS from App.jsx lines 34–103. Add MOOD_OPTIONS, STATUS_OPTIONS, IconMap, and LOTTIE_CAT_URL = 'https://lottie.host/c4f1b7d8-3e5a-4def-85eb-3e3a1c64e68e/KHEnPEHBIE.json'.
utils.js: Implement slugify(title), formatDate(timestamp), formatRelativeDate(timestamp), calcReadTime(markdownText), truncateText(string, maxLength).
Step 4: Create Context Providers
src/contexts/ThemeContext.jsx — ThemeProvider with localStorage persistence + useTheme() hook. On mount: read from localStorage, fallback to prefers-color-scheme, default 'dark'. Toggle adds/removes 'dark' class on document.documentElement.
src/contexts/AuthContext.jsx — AuthProvider wrapping onAuthStateChanged. Exposes { user, isAdmin, loading, login(email, pw), logout() }. Admin check: user.email === 'shahariar.sabbir.101@gmail.com'.
src/contexts/SiteConfigContext.jsx — SiteConfigProvider with onSnapshot on siteConfig/main. Exposes { config, loading }.
Step 5: Create Custom Hooks
src/hooks/useFirestoreCollection.js — Generic real-time collection listener with optional where, orderBy, limit params. Returns { data, loading, error }.
src/hooks/useFirestoreDocument.js — Single document listener. Returns { data, loading, error }.
src/hooks/useMediaQuery.js — window.matchMedia wrapper returning boolean.
Step 6: Create Styles
Move all @keyframes from App.jsx inline <style> block (lines 1296–1364) into src/styles/animations.css.
Create src/styles/markdown.css with .prose overrides for code blocks, tables, blockquotes matching both themes.
Update src/styles/index.css (rename from src/index.css) — add imports for animations.css and markdown.css.
Step 7: Decompose UI Components from App.jsx
Extract each component into its own file:

Source (App.jsx)	Target File
TypewriterHeadline (L106–L140)	src/components/ui/TypewriterHeadline.jsx
KineticText (L141–L153)	src/components/ui/KineticText.jsx
Reveal (L155–L177)	src/components/ui/Reveal.jsx — rewrite with framer-motion useInView
CanvasElegantLeaf (L180–L243)	src/components/ui/CanvasLeaf.jsx
ThemeAdaptiveCaterpillar (L249–L531)	DELETE — replaced by src/components/ui/NeonCrawler.jsx (built from scratch per Section 7)
DynamicForm (L537–L621)	DELETE — replaced by purpose-built admin form components
Navigation JSX (L782–L837)	src/components/layout/Navbar.jsx
Footer JSX (L1162–L1210)	src/components/layout/Footer.jsx
Hero Section (L843–L882)	src/components/sections/HeroSection.jsx
About/Manifesto (L884–L920)	src/components/sections/ManifestoSection.jsx
Skills Section (L924–L952)	src/components/sections/SkillsSection.jsx
Experience Section (L956–L997)	src/components/sections/ExperienceSection.jsx
Projects Section (L999–L1051)	src/components/sections/ProjectsSection.jsx
Testimonials (L1053–L1088)	src/components/sections/TestimonialsSection.jsx
Blog Section (L1090–L1116)	src/components/sections/BlogSection.jsx
Contact Form (L1118–L1158)	src/components/sections/ContactSection.jsx — rewrite to save to contactMessages Firestore collection
Login Modal (L1213–L1233)	src/pages/admin/AdminLoginPage.jsx — convert from modal to standalone page
Admin Panel (L1236–L1291)	DELETE — replaced by full admin dashboard (Section 5)
Step 8: Build New UI Components
Create from scratch:

src/components/ui/NeonCrawler.jsx — Complete caterpillar redesign (Section 7)
src/components/ui/CursorTrail.jsx — Colorful trailing cursor with framer-motion
src/components/ui/LottieCat.jsx — Lottie walking cat wrapper
src/components/ui/PageTransition.jsx — AnimatePresence route transition wrapper
src/components/ui/StatusBadge.jsx
src/components/ui/Toast.jsx
src/components/ui/ConfirmDialog.jsx
Step 9: Build Layout Components
src/components/layout/PublicLayout.jsx — Navbar + Footer + NeonCrawler + CursorTrail + LottieCat + <Outlet />
src/components/layout/AdminLayout.jsx — AdminSidebar + AdminHeader + <Outlet />
src/components/layout/ProtectedRoute.jsx — Auth guard
Step 10: Build Admin Components
src/components/admin/AdminSidebar.jsx
src/components/admin/AdminHeader.jsx
src/components/admin/AdminTable.jsx
src/components/admin/AdminFormShell.jsx
src/components/admin/MarkdownEditor.jsx (Section 5.3)
src/components/admin/ImageUploader.jsx (Firebase Storage)
src/components/admin/CategoryTagInput.jsx
src/components/admin/CalendarHeatmap.jsx
Step 11: Build Public Pages
src/pages/public/HomePage.jsx — Compose all section components
src/pages/public/ProjectsPage.jsx — Grid with category filters from Firestore
src/pages/public/ProjectDetailPage.jsx — Fetch by slug, render Markdown
src/pages/public/BlogPage.jsx — Grid with category filters
src/pages/public/BlogPostPage.jsx — Fetch by slug, render Markdown
src/pages/public/JournalPage.jsx — CalendarHeatmap + published entries
src/pages/public/JournalEntryPage.jsx — Single entry by entryDate param
src/pages/public/CareerPage.jsx — Timeline, grouped by type
src/pages/public/NotFoundPage.jsx — Styled 404
Step 12: Build Admin Pages
AdminLoginPage.jsx — Standalone login form
AdminDashboard.jsx — Stats + recent activity + quick actions
AdminProjects.jsx + AdminProjectForm.jsx
AdminBlogs.jsx + AdminBlogForm.jsx
AdminJournals.jsx + AdminJournalForm.jsx
AdminCareer.jsx + AdminCareerForm.jsx
AdminReviews.jsx + AdminReviewForm.jsx
AdminMessages.jsx — Contact form submissions viewer
AdminSettings.jsx — Edit siteConfig/main
Step 13: Wire Up Router in App.jsx
Rewrite src/App.jsx to contain ONLY:

Provider nesting (Theme → Auth → SiteConfig)
createBrowserRouter with the full route table from Section 3.1
RouterProvider render
Update src/main.jsx to import the new styles.

Step 14: Deploy Firestore + Storage Security Rules and Seed Data
Create firestore.rules in project root with rules from Section 2.8.
Create storage.rules in project root with rules from Section 2.9.
Update firebase.json to include:
json

{
  "firestore": { "rules": "firestore.rules" },
  "storage": { "rules": "storage.rules" },
  "hosting": {
    "site": "shahariar-sr",
    "public": "dist",
    "cleanUrls": true,
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
Create a seed script (src/lib/seedData.js) that writes the existing DEFAULT_* constants into the new Firestore collections. Run it once from the admin panel or via a temporary button.
Deploy rules: firebase deploy --only firestore:rules,storage.
Step 15: Build, Test, Deploy
bash

npm run build          # Verify zero errors, zero warnings
npm run preview        # Local smoke test
firebase deploy        # Deploy to Firebase Hosting
10. Dependency Summary
New Dependencies to Install
Package	Version	Purpose
react-router-dom	^7.x	Client-side routing, nested layouts
framer-motion	^12.x	Page transitions, cursor trail, NeonCrawler, scroll reveals, toasts
lottie-react	^2.x	Walking cat ambient animation
react-markdown	^9.x	Render Markdown blog/journal content
remark-gfm	^4.x	GitHub Flavored Markdown (tables, strikethrough, task lists)
rehype-highlight	^7.x	Syntax highlighting in Markdown code blocks
date-fns	^4.x	Date formatting, calendar heatmap calculations
Already Installed (Keep As-Is)
Package	Version	Purpose
firebase	^12.16.0	Auth, Firestore, Storage
tailwindcss	^4.3.2	Utility-first CSS
@tailwindcss/vite	^4.3.2	Vite integration for Tailwind
lucide-react	^0.470.0	Icon library
react	^19.2.7	UI framework
react-dom	^19.2.7	DOM rendering
@vitejs/plugin-react	^6.0.3	Vite React plugin
Remove After Migration is Complete
Package	Reason
gh-pages	No longer deploying to GitHub Pages — using Firebase Hosting exclusively
11. Verification Checklist
After execution, verify ALL of the following:

Build & Deploy
 npm run build completes with zero errors and zero warnings
 npm run preview serves the app locally without console errors
 firebase deploy succeeds for hosting + firestore rules + storage rules
Theme
 Dark mode is the default on first visit
 Theme toggle works and persists across page refresh (localStorage)
 Theme persists when navigating between public routes
 Theme persists when navigating between public and admin routes
 Both themes look polished (dark = neon/glass, light = clean/colorful)
Routing
 All 28 routes in the route table render correctly
 Direct URL access works (e.g., typing /blog/some-slug in address bar)
 404 page renders for unknown routes
 Browser back/forward navigation works
Authentication
 /admin/* routes redirect to /admin/login when not authenticated
 Login with shahariar.sabbir.101@gmail.com grants admin access
 Login with any other email redirects to / with error
 Logout clears auth state and redirects to /
 Public pages work without any authentication
Public Pages
 Home page renders all sections with Firestore data
 Projects page shows category filter tabs, projects grid
 Project detail page renders Markdown content
 Blog page shows listing with category filters
 Blog post page renders Markdown with syntax highlighting
 Journal page shows calendar heatmap + published entries
 Career page shows timeline grouped by type
 Contact form submits to contactMessages collection with success toast
Admin Dashboard
 Dashboard shows correct stats (counts from each collection)
 All CRUD operations work for all 6 content collections
 Markdown editor renders live preview with GFM and syntax highlighting
 Image uploader uploads to Firebase Storage and returns URL
 Category/tag input adds and removes chips correctly
 Journal form allows backdating via date picker
 Calendar heatmap reflects existing journal entries
 Messages page shows contact submissions, mark as read works
 Settings page saves siteConfig/main document
Animations
 Page transitions animate smoothly (fade + slide)
 Cursor trail follows mouse on desktop, hidden on mobile/touch
 Walking cat Lottie plays in bottom-right corner
 Scroll reveals trigger as sections enter viewport
 Typewriter headline cycles through words
 NeonCrawler:
 Wanders across screen with smooth spring physics
 Body segments follow head with chain-spring effect
 Reacts to nearby cursor (follows, eyes track)
 Can be dragged with springy body physics
 Dances when clicked (bounce + particles)
 Minimizes on scroll (zips to right edge)
 Colors match current theme
 Neon glow in dark mode, flat colors in light mode
Security
 Public users cannot write to any collection except contactMessages
 contactMessages creation validates required fields
 Non-admin authenticated users cannot write to content collections
 Firebase Storage rejects non-image uploads and files > 5MB
12. Notes for Execution Agent
Preserve all existing visual design language. The current dark mode uses #030712, #050505, #0a0a0a backgrounds with cyan-500 and fuchsia-500 accents. Keep this palette.
Do not change the Tailwind configuration. The current setup with @tailwindcss/vite v4 and @custom-variant dark works correctly. Do not add a tailwind.config.js — Tailwind v4 uses CSS-based configuration.
The homepage should feel identical to the current site (same sections, same visual style, same animations) but now powered by Firestore data instead of hardcoded constants.
All existing animations (kinetic text, scroll reveals, typewriter, canvas leaf) must work in the new structure. Only the caterpillar is being redesigned.
Contact form must actually write to Firestore contactMessages collection (replacing the current setTimeout mock).
Image URLs in the existing data use Unsplash URLs. These should continue to work. The ImageUploader component is for NEW images uploaded through the admin panel.
The dataconnect/ directory should be left completely untouched.
The existing App.css contains styles for the old IDX template. It can be deleted after migration — none of those styles are used by the portfolio.
