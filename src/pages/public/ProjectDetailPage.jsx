import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/layout/PageTransition';
import { Tag } from '../../components/ui/Tag';
import { Button } from '../../components/ui/Button';
import * as LucideIcons from 'lucide-react';

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500"></div>
        </div>
      </PageTransition>
    );
  }

  if (error || !project) {
    return (
      <PageTransition>
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
          <div className="text-xl text-red-500">{error}</div>
          <Button onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </div>
      </PageTransition>
    );
  }

  const processTags = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      return data.split(',').map((t) => t.trim()).filter(Boolean);
    }
    return [];
  };

  const techStack = processTags(project.techStack);
  const categories = processTags(project.categories);

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl space-y-8 pb-24 pt-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
          <Link
            to="/"
            className="flex items-center transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            <LucideIcons.Home className="mr-1 h-4 w-4" />
          </Link>
          <LucideIcons.ChevronRight className="mx-2 h-4 w-4 shrink-0" />
          <Link
            to="/projects"
            className="transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            Projects
          </Link>
          <LucideIcons.ChevronRight className="mx-2 h-4 w-4 shrink-0" />
          <span className="truncate text-slate-900 dark:text-white">
            {project.title}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {/* Cover Image */}
          {project.coverImage && (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full object-cover max-h-[60vh]"
              />
            </div>
          )}

          {/* Header Section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl dark:text-white">
                {project.title}
              </h1>
              {project.liveUrl && (
                <Button
                  as="a"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  className="w-fit shrink-0 rounded-full px-6 py-5 text-sm transition-transform hover:scale-105 rounded-full"
                  style={{ borderRadius: '9999px' }}
                >
                  Check it out
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex-1">
                {project.summary && (
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    {project.summary}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4 shrink-0 md:w-64">
                {categories.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-200 uppercase">
                      Categories
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {categories.join(', ')}
                    </p>
                  </div>
                )}
                {project.githubUrl && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-200 uppercase">
                      Source Code
                    </h3>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-cyan-600 hover:underline dark:text-cyan-400"
                    >
                      <LucideIcons.Github className="mr-2 h-4 w-4" />
                      View on GitHub
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Tech Stack Tags */}
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {techStack.map((tech) => (
                  <Tag
                    key={tech}
                    className="rounded-full border border-slate-200 bg-slate-100 text-slate-800 px-3 py-1 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {tech}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          {/* Markdown Content */}
          <div className="border-t border-slate-200 pt-12 dark:border-slate-800">
            <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-img:rounded-xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {project.description || '*No detailed description provided.*'}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
