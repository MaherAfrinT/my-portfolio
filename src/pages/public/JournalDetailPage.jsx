import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { LazyMarkdown } from '../../components/ui/LazyMarkdown';
import { PageTransition } from '../../components/layout/PageTransition';
import { Reveal } from '../../components/ui/Reveal';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { useReaderSettings } from '../../hooks/useReaderSettings';
import { ReaderSettingsMenu } from '../../components/ui/ReaderSettingsMenu';

export function JournalDetailPage() {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getReaderStyles } = useReaderSettings();

  useEffect(() => {
    async function fetchEntry() {
      try {
        const docRef = doc(db, 'journalEntries', String(id || ''));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEntry({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Journal entry not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load journal entry');
      } finally {
        setLoading(false);
      }
    }

    fetchEntry();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-red-500">
          {error?.message || (error ? String(error) : null) || 'Entry not found'}
        </h2>
        <Link to="/journal" className="text-cyan-500 hover:underline">
          ← Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl pt-12 pb-24 relative">
        <Reveal>
          <Link
            to="/journal"
            className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journal
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <header className="mb-10">
            <div className="mb-4 flex flex-wrap gap-2">
              {entry.category && (
                <span className="font-mono rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400">
                  {entry.category}
                </span>
              )}
            </div>
            <h1 className="mb-6 text-4xl leading-tight font-extrabold text-[#0e2a36] md:text-5xl dark:text-white">
              {entry.title || 'Untitled Update'}
            </h1>
            <div className="font-mono text-sm text-slate-500 dark:text-slate-400">
              {entry.date?.toDate
                ? format(entry.date.toDate(), 'MMMM d, yyyy')
                : entry.date
                  ? format(new Date(entry.date), 'MMMM d, yyyy')
                  : 'No Date'}
            </div>
          </header>
        </Reveal>

        <Reveal delay={0.3}>
          <div 
            className="prose prose-slate dark:prose-invert prose-lg prose-headings:font-bold prose-a:text-cyan-500 hover:prose-a:text-cyan-600 prose-img:rounded-xl max-w-none"
            style={getReaderStyles()}
          >
            <LazyMarkdown>
              {entry.content || entry.note || ''}
            </LazyMarkdown>
          </div>
        </Reveal>
      </div>
      <ReaderSettingsMenu />
    </PageTransition>
  );
}
