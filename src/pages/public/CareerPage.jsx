import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { PageTransition } from '../../components/layout/PageTransition';
import { formatDate } from '../../lib/utils';
import { Tag } from '../../components/ui/Tag';
import { Reveal } from '../../components/ui/Reveal';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { WalkingCatFooter } from '../../components/ui/WalkingCatFooter';

export function CareerPage() {
  const { config } = useSiteConfig();
  const {
    data: experiences,
    loading: expLoading,
    error: expError,
  } = useFirestoreCollection('career', 'startDate', 'desc');
  const {
    data: testimonials,
    loading: testLoading,
    error: testError,
  } = useFirestoreCollection('testimonials', 'createdAt', 'desc');

  return (
    <PageTransition>
      <div className="relative flex flex-col gap-8 space-y-24 pb-24 md:flex-row">
        {/* Sticky Page Nav (Side Nav) */}
        <nav className="relative hidden w-48 shrink-0 md:block">
          <div className="sticky top-32 space-y-4 border-l-2 border-slate-200 pl-4 dark:border-slate-800">
            {config.sectionVisibility?.experience !== false && (
              <a
                href="#experience"
                className="block font-medium text-slate-500 transition-colors hover:text-cyan-600 dark:hover:text-cyan-500"
              >
                Experience
              </a>
            )}
            {config.sectionVisibility?.testimonials !== false && (
              <a
                href="#testimonials"
                className="block font-medium text-slate-500 transition-colors hover:text-emerald-700 dark:hover:text-purple-500"
              >
                Testimonials
              </a>
            )}
          </div>
        </nav>

        <div className="flex-1 space-y-24">
          {config.sectionVisibility?.experience !== false && (
          <section id="experience" className="scroll-mt-32">
            <Reveal>
              <header className="mb-12 pt-12">
                <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
                  <span className="bg-gradient-to-r from-cyan-600 to-emerald-700 dark:from-purple-400 dark:to-pink-500 bg-clip-text text-transparent">
                    Career Journey
                  </span>
                </h1>
                <p className="max-w-2xl text-xl text-[#566e7a] dark:text-slate-400">
                  My professional journey and education.
                </p>
              </header>
            </Reveal>

            {expLoading ? (
              <div className="flex justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-600 dark:border-cyan-500"></div>
              </div>
            ) : expError ? (
              <div className="text-red-500">Error loading career data.</div>
            ) : (
              <div className="relative mx-auto max-w-5xl space-y-16 py-10">
                {/* Central line */}
                <div className="absolute top-0 bottom-0 left-8 z-0 w-px transform bg-slate-200 dark:bg-slate-800" />

                {experiences?.map((item, idx) => {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="relative flex w-full flex-col items-center md:flex-row"
                    >
                      {/* Node */}
                      <div className="absolute left-8 z-10 flex h-12 w-12 -translate-x-1/2 transform items-center justify-center rounded-full border border-cyan-600 dark:border-cyan-500 bg-white shadow-cyan-600/10 dark:shadow-[0_0_20px_rgba(0,255,204,0.3)] dark:bg-[#030712]">
                        <span className={`font-mono font-bold tracking-tighter ${item.type === 'education' ? 'text-lg' : 'text-sm text-cyan-600 dark:text-cyan-400'}`}>
                          {item.type === 'education' ? '🎓' : '<>'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="w-full pr-4 pl-24 text-left">
                        <div className="glass-panel rounded-xl group relative overflow-hidden border border-slate-200 bg-white/80 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-600/30 hover:shadow-cyan-600/10 dark:hover:border-cyan-500/50 dark:hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)] dark:border-slate-800 dark:bg-slate-900/40">
                          {/* Glow effect on hover */}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-emerald-700/5 dark:from-cyan-500/5 dark:to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                          <h3 className="mb-2 text-2xl font-bold text-[#0e2a36] dark:text-white">
                            {item.role}
                          </h3>

                          <div className="mb-4 flex items-center justify-start gap-2 font-mono text-sm text-cyan-600 dark:text-cyan-500">
                            {formatDate(item.startDate)}{' '}
                            <span className="text-[#566e7a]">-</span>{' '}
                            {item.current
                              ? 'Present'
                              : formatDate(item.endDate)}
                          </div>

                          <div className="mb-6 text-lg font-medium text-[#385361] dark:text-slate-300">
                            {item.company}
                          </div>

                          {item.description && (
                            <p className="mb-6 text-sm leading-relaxed whitespace-pre-wrap text-[#566e7a] dark:text-slate-400">
                              {item.description}
                            </p>
                          )}

                          {/* Achievements with checkmarks */}
                          {item.achievements &&
                            item.achievements.length > 0 && (
                              <ul className="space-y-3">
                                {item.achievements.map((ach, aIdx) => (
                                  <li
                                    key={aIdx}
                                    className="flex max-w-xl items-start text-sm text-[#566e7a] dark:text-slate-300"
                                  >
                                    <svg
                                      className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-emerald-700 dark:text-cyan-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span className="leading-relaxed opacity-90">
                                      {ach}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}

                          {item.skills && item.skills.length > 0 && (
                            <div className="mt-8 flex flex-wrap justify-start gap-2 border-t border-slate-200 pt-6 dark:border-slate-800">
                              {item.skills.map((skill) => (
                                <Tag
                                  key={skill}
                                >
                                  {skill}
                                </Tag>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {experiences?.length === 0 && (
                  <div className="w-full py-10 text-center text-slate-500">
                    No experience records found.
                  </div>
                )}
              </div>
            )}
          </section>
          )}

          {config.sectionVisibility?.testimonials !== false && (
          <section id="testimonials" className="scroll-mt-32">
            <Reveal>
              <header className="mb-12">
                <h2 className="mb-6 text-3xl font-extrabold md:text-4xl">
                  <span className="bg-gradient-to-r from-cyan-600 to-emerald-700 dark:from-cyan-400 dark:to-purple-500 bg-clip-text text-transparent">
                    Testimonials
                  </span>
                </h2>
                <p className="max-w-2xl text-lg text-[#566e7a] dark:text-slate-400">
                  What people say about working with me.
                </p>
              </header>
            </Reveal>

            {testLoading ? (
              <div className="flex justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-600 dark:border-cyan-500"></div>
              </div>
            ) : testError ? (
              <div className="text-red-500">Error loading testimonials.</div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {testimonials?.map((t, idx) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="glass-panel rounded-xl group relative overflow-hidden p-8 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-600/30 hover:shadow-cyan-600/10 dark:hover:border-cyan-500/50 dark:hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)]">
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-emerald-700/5 dark:from-cyan-500/5 dark:to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute top-6 right-8 font-serif text-6xl leading-none text-cyan-600/10 dark:text-cyan-500/20">
                        "
                      </div>
                      <p className="relative z-10 mb-6 text-lg text-[#385361] italic dark:text-slate-300">
                        {t.quote}
                      </p>
                      <div className="flex items-center gap-4">
                        {t.avatarUrl ? (
                          <img
                            src={t.avatarUrl}
                            alt={t.author}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
                            {t.author.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-[#0e2a36] dark:text-white">
                            {t.author}
                          </div>
                          <div className="text-sm text-slate-500">
                            {t.position}
                          </div>
                        </div>
                      </div>
                      {t.referenceUrl && (
                        <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
                          {t.referenceUrl.startsWith('http') ? (
                            <a
                              href={t.referenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-600 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300"
                            >
                              View Reference Work
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ) : (
                            <Link
                              to={t.referenceUrl}
                              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-600 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300"
                            >
                              View Reference Work
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {testimonials?.length === 0 && (
                  <div className="py-10 text-slate-500">
                    No testimonials yet.
                  </div>
                )}
              </div>
            )}
          </section>
          )}
        </div>
      </div>
      <WalkingCatFooter />
    </PageTransition>
  );
}
