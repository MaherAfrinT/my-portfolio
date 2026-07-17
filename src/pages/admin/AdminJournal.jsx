import React from 'react';
import { Link } from 'react-router-dom';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useAdminDelete } from '../../hooks/useAdminDelete';
import { COLLECTIONS } from '../../lib/constants';
import { Button } from '../../components/ui/Button';

export function AdminJournal() {
  const {
    data: entries,
    loading,
    error: fetchError,
  } = useFirestoreCollection(COLLECTIONS.JOURNAL, 'date', 'desc');

  const { handleDelete, isDeleting } = useAdminDelete(COLLECTIONS.JOURNAL);

  if (loading) return <div>Loading entries...</div>;
  if (fetchError) return <div className="text-red-500">Error: {fetchError.message}</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Journal Entries</h1>
        <Button as={Link} to="/admin/journal/new">
          New Entry
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
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
                <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-900 dark:text-white">
                  {entry.date?.toDate
                    ? entry.date.toDate().toLocaleDateString()
                    : new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-800 dark:text-slate-200">
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
    </div>
  );
}

