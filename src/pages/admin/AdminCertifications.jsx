import React from 'react';
import { Link } from 'react-router-dom';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useAdminDelete } from '../../hooks/useAdminDelete';
import { COLLECTIONS } from '../../lib/constants';
import { Button } from '../../components/ui/Button';

export function AdminCertifications() {
  const {
    data: certifications,
    loading,
    error,
  } = useFirestoreCollection(COLLECTIONS.CERTIFICATIONS, 'createdAt', 'desc');
  
  const { handleDelete, isDeleting } = useAdminDelete(COLLECTIONS.CERTIFICATIONS);

  if (loading) return <div className="p-8">Loading certifications...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error loading certifications</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Certifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your Kali Linux tools-style certifications list
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/certifications/new">
            <Button>
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Certification
            </Button>
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {certifications?.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No certifications added yet. Click the button above to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                    Badge
                  </th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                    Title
                  </th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                    Issuer
                  </th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                    Date
                  </th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {certifications?.map((cert) => (
                  <tr
                    key={cert.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20"
                  >
                    <td className="p-4">
                      {cert.badgeUrl ? (
                        <img
                          src={cert.badgeUrl}
                          alt={cert.title}
                          className="h-12 w-12 rounded bg-slate-100 object-contain p-1 dark:bg-slate-800"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-100 text-xl dark:bg-slate-800">
                          🏆
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {cert.title}
                      </div>
                      <div className="max-w-[200px] truncate text-xs text-slate-500">
                        {cert.fullName}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {cert.issuer}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {cert.issuedDate}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link to={`/admin/certifications/${cert.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3"
                          >
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          onClick={() => handleDelete(cert.id, 'certification')}
                          disabled={isDeleting}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

