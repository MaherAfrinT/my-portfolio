import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { PageTransition } from '../../components/layout/PageTransition';
import { Reveal } from '../../components/ui/Reveal';
import { Tag } from '../../components/ui/Tag';

export function CertificationsPage() {
  const {
    data: certifications,
    loading,
    error,
  } = useFirestoreCollection('certifications', 'createdAt', 'desc');
  const [selectedTag, setSelectedTag] = useState(null);

  // Extract all unique tags
  const allTags = certifications
    ? Array.from(new Set(certifications.flatMap((cert) => cert.tags || [])))
    : [];

  const filteredCerts = selectedTag
    ? certifications?.filter((cert) => (cert.tags || []).includes(selectedTag))
    : certifications;

  return (
    <PageTransition>
      <div className="space-y-12 pb-24">
        <Reveal>
          <header className="pt-12">
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-500 bg-clip-text text-transparent">
                Certifications
              </span>
            </h1>
            <p className="max-w-2xl text-xl text-slate-600 dark:text-slate-400">
              A comprehensive list of my professional credentials and
              achievements.
            </p>
          </header>
        </Reveal>

        {/* Filter Tags */}
        <Reveal>
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                selectedTag === null
                  ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Certifications Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">Error loading certifications.</div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredCerts?.map((cert) => (
                <motion.div
                  key={cert.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/certifications/${cert.id}`}>
                    <div className="glass-panel rounded-xl group relative flex h-full cursor-pointer flex-col overflow-hidden p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)]">
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="mb-4 flex items-start gap-4">
                        {cert.badgeUrl ? (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 p-2">
                            <img
                              src={cert.badgeUrl}
                              alt={cert.title}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-2xl">
                            🏆
                          </div>
                        )}
                        <div>
                          <h3 className="line-clamp-1 text-xl font-bold text-slate-900 transition-colors group-hover:text-cyan-500 dark:text-white">
                            {cert.title}
                          </h3>
                          <div className="mt-1 font-mono text-sm text-cyan-600 dark:text-cyan-400">
                            {cert.issuer}
                          </div>
                        </div>
                      </div>

                      <p className="mb-6 line-clamp-2 flex-grow text-sm text-slate-600 dark:text-slate-400">
                        {cert.fullName}
                      </p>

                      <div className="mt-auto flex flex-wrap gap-2">
                        {cert.tags?.slice(0, 3).map((tag, idx) => (
                          <Tag
                            key={idx}
                            className="border-none bg-slate-100 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {tag}
                          </Tag>
                        ))}
                        {cert.tags?.length > 3 && (
                          <Tag className="border-none bg-slate-100 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            +{cert.tags.length - 3}
                          </Tag>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredCerts?.length === 0 && (
              <div className="col-span-full py-10 text-center text-slate-500">
                No certifications found for this filter.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
