import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { PageTransition } from '../../components/layout/PageTransition';
import { Card, CardImage, CardContent } from '../../components/ui/Card';
import { Tag } from '../../components/ui/Tag';
import { Button } from '../../components/ui/Button';
import { Reveal } from '../../components/ui/Reveal';
import { WalkingCatFooter } from '../../components/ui/WalkingCatFooter';

export function ProjectsPage() {
  const {
    data: projects,
    loading,
    error,
  } = useFirestoreCollection('projects', 'createdAt', 'desc');
  const [filter, setFilter] = useState('All');

  // Extract unique categories
  const categories = [
    'All',
    ...new Set(projects?.flatMap((p) => p.categories || []) || []),
  ];

  const filteredProjects =
    filter === 'All'
      ? projects
      : projects?.filter((p) => p.categories?.includes(filter));

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
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Selected Works
              </span>
            </h1>
            <p className="max-w-2xl text-xl text-slate-600 dark:text-slate-400">
              A collection of my recent projects, experiments, and open-source
              contributions.
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
            {/* Filter Bar */}
            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  layout
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    filter === cat
                      ? 'bg-cyan-600 text-white dark:bg-cyan-500'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-[#333333] dark:bg-dark-surface dark:text-[#EDEDED] dark:hover:bg-[#222222]'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            {/* Projects Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 gap-8 md:grid-cols-2"
            >
              {filteredProjects?.map((project) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  className="group relative"
                >
                  <Card className="relative flex h-full flex-col overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)]">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <CardImage src={project.coverImage} alt={project.title} />
                    <CardContent className="flex flex-1 flex-col">
                      <h3 className="mb-2 text-2xl font-bold">
                        {project.title}
                      </h3>
                      <p className="mb-4 line-clamp-3 flex-1 text-slate-600 dark:text-slate-400">
                        {project.summary || 'No summary provided.'}
                      </p>

                      <div className="mb-6 flex flex-wrap gap-2">
                        {project.techStack?.map((tech) => (
                          <Tag key={tech}>{tech}</Tag>
                        ))}
                      </div>

                      <div className="mt-auto flex gap-4">
                        {project.githubUrl && (
                          <Button
                            as="a"
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            variant="outline"
                            size="sm"
                          >
                            GitHub
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button
                            as="a"
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            size="sm"
                          >
                            Live Demo
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredProjects?.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-500">
                  No projects found in this category.
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
