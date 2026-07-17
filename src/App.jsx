import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SiteConfigProvider } from './contexts/SiteConfigContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { CareerPage } from './pages/public/CareerPage';
import { BlogPage } from './pages/public/BlogPage';
import { BlogPostPage } from './pages/public/BlogPostPage';
import { JournalPage } from './pages/public/JournalPage';
import { LoginPage } from './pages/public/LoginPage';
import { CertificationsPage } from './pages/public/CertificationsPage';
import { CertificationDetailPage } from './pages/public/CertificationDetailPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminProjectForm } from './pages/admin/AdminProjectForm';
import { AdminCareer } from './pages/admin/AdminCareer';
import { AdminCareerForm } from './pages/admin/AdminCareerForm';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminManifesto } from './pages/admin/AdminManifesto';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminTestimonialForm } from './pages/admin/AdminTestimonialForm';
import { AdminSkills } from './pages/admin/AdminSkills';
import { AdminBlog } from './pages/admin/AdminBlog';
import { AdminBlogForm } from './pages/admin/AdminBlogForm';
import { AdminJournal } from './pages/admin/AdminJournal';
import { AdminJournalForm } from './pages/admin/AdminJournalForm';
import { AdminCertifications } from './pages/admin/AdminCertifications';
import { AdminCertificationForm } from './pages/admin/AdminCertificationForm';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteConfigProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
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
          </BrowserRouter>
        </SiteConfigProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
