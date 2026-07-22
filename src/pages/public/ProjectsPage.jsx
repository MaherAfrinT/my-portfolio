import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { DEFAULT_SITE_CONFIG } from '../../lib/constants';
import { PageTransition } from '../../components/layout/PageTransition';
import { Card, CardImage, CardContent } from '../../components/ui/Card';
import { Tag } from '../../components/ui/Tag';
import { Reveal } from '../../components/ui/Reveal';
import { WalkingCatFooter } from '../../components/ui/WalkingCatFooter';

export function ProjectsPage() {
  const { config } = useSiteConfig();
  const {
    data: projects,
    loading,
    error,
  } = useFirestoreCollection('projects', 'createdAt', 'desc');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <PageTransition>
      <div className="space-y-12 pb-24">
        <Reveal>
          <header className="pt-12">
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              <span className="bg-gradient-to-r from-[#00E5FF] to-transparent bg-clip-text text-transparent">
                {config.projectsPageTitle || DEFAULT_SITE_CONFIG.projectsPageTitle}
              </span>
            </h1>
            <p className="max-w-2xl text-xl text-[#566e7a] dark:text-slate-400">
              {config.projectsPageSubtitle || DEFAULT_SITE_CONFIG.projectsPageSubtitle}
            </p>
          </header>
        </Reveal>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">
            Error loading projects. Please try again later.
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 gap-8 md:grid-cols-2"
            >
              {projects?.map((project) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  className="group relative"
                >
                  <Link to={`/projects/${String(project.id || '')}`} className="block h-full">
                    <Card className="relative flex h-full flex-col overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)]">
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <CardImage src={project.coverImage} alt={project.title} />
                      <CardContent className="flex flex-1 flex-col">
                        <h3 className="mb-2 text-2xl font-bold">
                          {project.title}
                        </h3>
                        <p className="mb-4 line-clamp-3 flex-1 text-[#566e7a] dark:text-slate-400">
                          {project.summary || 'No summary provided.'}
                        </p>

                        <div className="mb-6 flex flex-wrap gap-2">
                          {project.techStack?.map((tech) => (
                            <Tag key={tech}>{tech}</Tag>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}

              {projects?.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-500">
                  No projects found.
                </div>
              )}
            </motion.div>
          </>
        )}
        <WalkingCatFooter />
      </div>
    </PageTransition>
  );
}
