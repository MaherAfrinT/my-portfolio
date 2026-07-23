import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { PageTransition } from '../../components/layout/PageTransition';
import { Reveal } from '../../components/ui/Reveal';
import { CalendarHeatmap } from '../../components/ui/CalendarHeatmap';
import { format } from 'date-fns';
import { LazyMarkdown } from '../../components/ui/LazyMarkdown';
import { WalkingCatFooter } from '../../components/ui/WalkingCatFooter';
import { useReaderSettings } from '../../hooks/useReaderSettings';
import { ReaderSettingsMenu } from '../../components/ui/ReaderSettingsMenu';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { DEFAULT_SITE_CONFIG } from '../../lib/constants';

export function JournalPage() {
  const {
    data: entries,
    loading,
    error,
  } = useFirestoreCollection('journalEntries', 'date', 'desc');

  const { config } = useSiteConfig();
  const { getReaderStyles } = useReaderSettings();

  // Filter out drafts
  const publishedEntries =
    entries?.filter((entry) => entry.isPublished !== false) || [];

  return (
    <PageTransition>
      <div className="space-y-12 pb-24">
        <Reveal>
          <header className="pt-12">
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              <span className="bg-gradient-to-r from-[#009bbf] to-emerald-700 dark:from-cyan-400 dark:to-purple-500 bg-clip-text text-transparent">
                {config.journalPageTitle || DEFAULT_SITE_CONFIG.journalPageTitle}
              </span>
            </h1>
            <p className="mb-12 max-w-2xl text-xl text-[#566e7a] dark:text-slate-400">
              {config.journalPageSubtitle || DEFAULT_SITE_CONFIG.journalPageSubtitle}
            </p>
          </header>
        </Reveal>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#009bbf] dark:border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">
            Error loading journal. Please try again later.
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-[#333333] dark:bg-dark-surface">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#009bbf]/5 to-emerald-700/5 dark:from-cyan-500/5 dark:to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <h3 className="mb-6 text-lg font-semibold text-[#0e2a36] dark:text-white">Activity Graph</h3>
                <CalendarHeatmap entries={publishedEntries} />
              </div>
            </motion.div>

            <div className="mt-20">
              <Reveal>
                <h3 className="mb-10 text-2xl font-bold text-[#0e2a36] dark:text-white">Timeline</h3>
              </Reveal>

              <div className="relative ml-4 space-y-12 border-l-2 border-slate-200 pb-8 md:ml-[20%] dark:border-slate-800">
                {publishedEntries.map((entry) => (
                  <Reveal key={entry.id}>
                    <div className="relative pl-8 md:pl-12">
                      {/* Timeline Node */}
                      <div className="absolute -left-[7px] top-8 h-3 w-3 rounded-full bg-[#009bbf] shadow-[0_0_10px_rgba(67,56,202,0.5)] dark:bg-cyan-500 dark:shadow-[0_0_10px_#00E5FF] outline outline-4 outline-slate-50 dark:outline-slate-950" />

                      {/* Desktop Date */}
                      <div className="font-mono absolute right-[calc(100%+2rem)] top-7 hidden w-48 text-right text-sm font-medium text-slate-500 md:block dark:text-slate-400">
                        {entry.date?.toDate
                          ? format(entry.date.toDate(), 'MMM d, yyyy')
                          : entry.date
                            ? format(new Date(entry.date), 'MMM d, yyyy')
                            : ''}
                      </div>

                      {/* Timeline Item Card */}
                      <Link to={`/journal/${String(entry.id || '')}`} className="group relative block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#009bbf]/50 dark:hover:border-cyan-500/50 hover:shadow-lg md:p-8 dark:border-[#333333] dark:bg-dark-surface">
                        {/* Mobile Date Header */}
                        <div className="font-mono mb-4 text-xs font-semibold tracking-wider text-[#009bbf] uppercase md:hidden dark:text-cyan-400">
                          {entry.date?.toDate
                            ? format(entry.date.toDate(), 'MMM d, yyyy')
                            : entry.date
                              ? format(new Date(entry.date), 'MMM d, yyyy')
                              : ''}
                        </div>

                        <div className="mb-4 flex items-center gap-3">
                          <h4 className="text-xl font-bold text-[#0e2a36] dark:text-white">
                            {entry.title || 'Untitled Update'}
                          </h4>
                          {entry.category && (
                            <span className="font-mono rounded-full border border-indigo-100 bg-[#f0f9fb] px-2.5 py-1 text-xs font-medium text-[#009bbf] dark:border-cyan-800/50 dark:bg-cyan-900/30 dark:text-cyan-300">
                              {entry.category}
                            </span>
                          )}
                        </div>

                        <div
                          className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed md:text-base line-clamp-3"
                          style={getReaderStyles()}
                        >
                          <LazyMarkdown>
                            {entry.content || entry.note || ''}
                          </LazyMarkdown>
                        </div>
                      </Link>
                    </div>
                  </Reveal>
                ))}

                {publishedEntries.length === 0 && (
                  <div className="py-12 text-center text-slate-500">
                    No journal entries yet.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        <WalkingCatFooter />
      </div>
      <ReaderSettingsMenu />
    </PageTransition>
  );
}
