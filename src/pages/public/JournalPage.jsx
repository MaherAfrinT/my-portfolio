import React from 'react';
import { motion } from 'framer-motion';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { PageTransition } from '../../components/layout/PageTransition';
import { Reveal } from '../../components/ui/Reveal';
import { CalendarHeatmap } from '../../components/ui/CalendarHeatmap';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { WalkingCatFooter } from '../../components/ui/WalkingCatFooter';
import { useReaderSettings } from '../../hooks/useReaderSettings';
import { ReaderSettingsMenu } from '../../components/ui/ReaderSettingsMenu';

export function JournalPage() {
  const {
    data: entries,
    loading,
    error,
  } = useFirestoreCollection('journalEntries', 'date', 'desc');

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
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Journal
              </span>
            </h1>
            <p className="mb-12 max-w-2xl text-xl text-slate-600 dark:text-slate-400">
              Philosophical thoughts, code musings, and micro-updates.
            </p>
          </header>
        </Reveal>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500"></div>
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
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <h3 className="mb-6 text-lg font-semibold">Activity Graph</h3>
                <CalendarHeatmap entries={publishedEntries} />
              </div>
            </motion.div>

            <div className="mt-20">
              <Reveal>
                <h3 className="mb-10 text-2xl font-bold">Timeline</h3>
              </Reveal>

              <div className="relative ml-4 space-y-12 border-l-2 border-slate-200 pb-8 md:ml-[20%] dark:border-slate-800">
                {publishedEntries.map((entry) => (
                  <Reveal key={entry.id}>
                    <div className="relative pl-8 md:pl-12">
                      {/* Timeline Node */}
                      <div className="absolute -left-[7px] top-8 h-3 w-3 rounded-full bg-cyan-500 shadow-[0_0_10px_#00E5FF] outline outline-4 outline-slate-50 dark:outline-slate-950" />

                      {/* Desktop Date */}
                      <div className="font-mono absolute right-[calc(100%+2rem)] top-7 hidden w-48 text-right text-sm font-medium text-slate-500 md:block dark:text-slate-400">
                        {entry.date?.toDate
                          ? format(entry.date.toDate(), 'MMM d, yyyy')
                          : entry.date
                            ? format(new Date(entry.date), 'MMM d, yyyy')
                            : ''}
                      </div>

                      {/* Timeline Item Card */}
                      <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-lg md:p-8 dark:border-slate-800 dark:bg-slate-900">
                        {/* Mobile Date Header */}
                        <div className="font-mono mb-4 text-xs font-semibold tracking-wider text-cyan-600 uppercase md:hidden dark:text-cyan-400">
                          {entry.date?.toDate
                            ? format(entry.date.toDate(), 'MMM d, yyyy')
                            : entry.date
                              ? format(new Date(entry.date), 'MMM d, yyyy')
                              : ''}
                        </div>

                        <div className="mb-4 flex items-center gap-3">
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                            {entry.title || 'Untitled Update'}
                          </h4>
                          {entry.category && (
                            <span className="font-mono rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 dark:border-cyan-800/50 dark:bg-cyan-900/30 dark:text-cyan-300">
                              {entry.category}
                            </span>
                          )}
                        </div>

                        <div
                          className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed md:text-base"
                          style={getReaderStyles()}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                          >
                            {entry.content || entry.note || ''}
                          </ReactMarkdown>
                        </div>
                      </div>
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
