import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SiteConfigProvider } from './contexts/SiteConfigContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ScrollToTop } from './components/layout/ScrollToTop';

// Public Pages
const HomePage = React.lazy(() => import('./pages/public/HomePage').then(m => ({ default: m.HomePage })));
const ProjectsPage = React.lazy(() => import('./pages/public/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const CareerPage = React.lazy(() => import('./pages/public/CareerPage').then(m => ({ default: m.CareerPage })));
const BlogPage = React.lazy(() => import('./pages/public/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = React.lazy(() => import('./pages/public/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const JournalPage = React.lazy(() => import('./pages/public/JournalPage').then(m => ({ default: m.JournalPage })));
const LoginPage = React.lazy(() => import('./pages/public/LoginPage').then(m => ({ default: m.LoginPage })));
const CertificationsPage = React.lazy(() => import('./pages/public/CertificationsPage').then(m => ({ default: m.CertificationsPage })));
const CertificationDetailPage = React.lazy(() => import('./pages/public/CertificationDetailPage').then(m => ({ default: m.CertificationDetailPage })));
const ProjectDetailPage = React.lazy(() => import('./pages/public/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const ContactPage = React.lazy(() => import('./pages/public/ContactPage').then(m => ({ default: m.ContactPage })));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProjects = React.lazy(() => import('./pages/admin/AdminProjects').then(m => ({ default: m.AdminProjects })));
const AdminProjectForm = React.lazy(() => import('./pages/admin/AdminProjectForm').then(m => ({ default: m.AdminProjectForm })));
const AdminCareer = React.lazy(() => import('./pages/admin/AdminCareer').then(m => ({ default: m.AdminCareer })));
const AdminCareerForm = React.lazy(() => import('./pages/admin/AdminCareerForm').then(m => ({ default: m.AdminCareerForm })));
const AdminMessages = React.lazy(() => import('./pages/admin/AdminMessages').then(m => ({ default: m.AdminMessages })));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminManifesto = React.lazy(() => import('./pages/admin/AdminManifesto').then(m => ({ default: m.AdminManifesto })));
const AdminTestimonials = React.lazy(() => import('./pages/admin/AdminTestimonials').then(m => ({ default: m.AdminTestimonials })));
const AdminTestimonialForm = React.lazy(() => import('./pages/admin/AdminTestimonialForm').then(m => ({ default: m.AdminTestimonialForm })));
const AdminSkills = React.lazy(() => import('./pages/admin/AdminSkills').then(m => ({ default: m.AdminSkills })));
const AdminBlog = React.lazy(() => import('./pages/admin/AdminBlog').then(m => ({ default: m.AdminBlog })));
const AdminBlogForm = React.lazy(() => import('./pages/admin/AdminBlogForm').then(m => ({ default: m.AdminBlogForm })));
const AdminJournal = React.lazy(() => import('./pages/admin/AdminJournal').then(m => ({ default: m.AdminJournal })));
const AdminJournalForm = React.lazy(() => import('./pages/admin/AdminJournalForm').then(m => ({ default: m.AdminJournalForm })));
const AdminCertifications = React.lazy(() => import('./pages/admin/AdminCertifications').then(m => ({ default: m.AdminCertifications })));
const AdminCertificationForm = React.lazy(() => import('./pages/admin/AdminCertificationForm').then(m => ({ default: m.AdminCertificationForm })));

// Custom Loading Fallback
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#00E5FF]"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteConfigProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:id" element={<ProjectDetailPage />} />
                  <Route path="/career" element={<CareerPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/journal" element={<JournalPage />} />
                  <Route
                    path="/certifications"
                    element={<CertificationsPage />}
                  />
                  <Route
                    path="/certifications/:id"
                    element={<CertificationDetailPage />}
                  />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="projects" element={<AdminProjects />} />
                    <Route path="projects/new" element={<AdminProjectForm />} />
                    <Route path="projects/:id" element={<AdminProjectForm />} />

                    <Route path="career" element={<AdminCareer />} />
                    <Route path="career/new" element={<AdminCareerForm />} />
                    <Route path="career/:id" element={<AdminCareerForm />} />

                    <Route path="testimonials" element={<AdminTestimonials />} />
                    <Route
                      path="testimonials/new"
                      element={<AdminTestimonialForm />}
                    />
                    <Route
                      path="testimonials/:id"
                      element={<AdminTestimonialForm />}
                    />

                    <Route path="skills" element={<AdminSkills />} />

                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="blog/new" element={<AdminBlogForm />} />
                    <Route path="blog/edit/:id" element={<AdminBlogForm />} />

                    <Route path="journal" element={<AdminJournal />} />
                    <Route path="journal/new" element={<AdminJournalForm />} />
                    <Route
                      path="journal/edit/:id"
                      element={<AdminJournalForm />}
                    />

                    <Route
                      path="certifications"
                      element={<AdminCertifications />}
                    />
                    <Route
                      path="certifications/new"
                      element={<AdminCertificationForm />}
                    />
                    <Route
                      path="certifications/:id"
                      element={<AdminCertificationForm />}
                    />

                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="manifesto" element={<AdminManifesto />} />
                    <Route path="settings" element={<AdminSettings />} />

                    {/* Catchall admin */}
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SiteConfigProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
