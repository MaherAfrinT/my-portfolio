import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useAdminDelete } from '../../hooks/useAdminDelete';
import { COLLECTIONS } from '../../lib/constants';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Trash2 } from 'lucide-react';

export function AdminJournal() {
  const {
    data: entries,
    loading,
    error: fetchError,
  } = useFirestoreCollection(COLLECTIONS.JOURNAL, 'date', 'desc');

  const { handleDelete, isDeleting } = useAdminDelete(COLLECTIONS.JOURNAL);

  const [formData, setFormData] = useState({
    journalPageTitle: '',
    journalPageSubtitle: ''
  });
  const [configLoading, setConfigLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchConfig() {
      try {
        const docRef = doc(db, COLLECTIONS.CONFIG, 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            journalPageTitle: data.journalPageTitle || '',
            journalPageSubtitle: data.journalPageSubtitle || '',
          });
        }
      } catch (err) {
        console.error('Failed to load config', err);
      } finally {
        setConfigLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, COLLECTIONS.CONFIG, 'main'), formData, { merge: true });
      setMessage('Settings saved!');
    } catch (err) {
      console.error('Failed to save config', err);
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading || configLoading) return <div>Loading entries...</div>;
  if (fetchError) return <div className="text-red-500">Error: {fetchError.message}</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Journal Entries</h1>
        <Button as={Link} to="/admin/journal/new">
          New Entry
        </Button>
      </div>

      <Card className="mb-8">
        <div className="border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Journal Page Settings</h2>
          {message && <span className="text-sm font-bold text-green-500">{message}</span>}
        </div>
        <CardContent className="pt-6">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Journal Page Title</label>
              <Input
                name="journalPageTitle"
                value={formData.journalPageTitle}
                onChange={handleChange}
                placeholder="Journal"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Journal Page Subtitle</label>
              <Textarea
                name="journalPageSubtitle"
                value={formData.journalPageSubtitle}
                onChange={handleChange}
                placeholder="Philosophical thoughts, code musings, and micro-updates."
              />
            </div>
            <Button
              type="submit"
              isLoading={saving}
              className="bg-cyan-500 text-[#0e2a36] hover:bg-cyan-600"
            >
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="hidden md:block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Title
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Category
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {entries?.map((entry) => (
              <tr
                key={entry.id}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <td className="px-6 py-4 font-medium whitespace-nowrap text-[#0e2a36] dark:text-white">
                  {entry.date?.toDate
                    ? entry.date.toDate().toLocaleDateString()
                    : new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium whitespace-nowrap text-[#163847] dark:text-slate-200">
                  {entry.title || 'Untitled'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-medium text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300">
                    {entry.category || 'General'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.isPublished ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  <Link
                    to={`/admin/journal/edit/${entry.id}`}
                    className="mr-4 text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(entry.id, 'journal entry')}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {entries?.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No journal entries found. Create one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="block space-y-4 md:hidden">
        {entries?.map((entry) => (
          <div
            key={entry.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-lg font-bold text-[#0e2a36] dark:text-white">
                {entry.title || 'Untitled'}
              </h3>
              <button
                onClick={() => handleDelete(entry.id, 'journal entry')}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 dark:text-red-400"
                aria-label="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-3 text-sm text-slate-500 dark:text-slate-400">
              {entry.date?.toDate
                ? entry.date.toDate().toLocaleDateString()
                : new Date(entry.date).toLocaleDateString()}
            </div>

            <div className="mb-3">
              <span className="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-medium text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300">
                {entry.category || 'General'}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span
                className={
                  entry.isPublished
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-amber-600 dark:text-amber-400'
                }
              >
                {entry.isPublished ? 'Published' : 'Draft'}
              </span>
              <Link
                to={`/admin/journal/edit/${entry.id}`}
                className="text-cyan-600 hover:underline dark:text-cyan-400"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
        {entries?.length === 0 && (
          <div className="py-8 text-center text-slate-500">
            No journal entries found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}

