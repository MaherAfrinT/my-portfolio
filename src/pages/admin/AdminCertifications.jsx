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
          <h1 className="text-2xl font-bold text-[#0e2a36] dark:text-white">
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

      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {certifications?.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No certifications added yet. Click the button above to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                  <th className="p-4 font-semibold text-[#566e7a] dark:text-slate-300">
                    Badge
                  </th>
                  <th className="p-4 font-semibold text-[#566e7a] dark:text-slate-300">
                    Title
                  </th>
                  <th className="p-4 font-semibold text-[#566e7a] dark:text-slate-300">
                    Issuer
                  </th>
                  <th className="p-4 font-semibold text-[#566e7a] dark:text-slate-300">
                    Date
                  </th>
                  <th className="p-4 font-semibold text-[#566e7a] dark:text-slate-300">
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
                      <div className="font-medium text-[#0e2a36] dark:text-white">
                        {cert.title}
                      </div>
                      <div className="max-w-[200px] truncate text-xs text-slate-500">
                        {cert.fullName}
                      </div>
                    </td>
                    <td className="p-4 text-[#566e7a] dark:text-slate-400">
                      {cert.issuer}
                    </td>
                    <td className="p-4 text-[#566e7a] dark:text-slate-400">
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

      <div className="block space-y-4 md:hidden">
        {certifications?.map((cert) => (
          <div
            key={cert.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-4 flex items-start gap-4">
              {cert.badgeUrl ? (
                <img
                  src={cert.badgeUrl}
                  alt={cert.title}
                  className="h-12 w-12 flex-shrink-0 rounded bg-slate-100 object-contain p-1 dark:bg-slate-800"
                />
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-slate-100 text-xl dark:bg-slate-800">
                  🏆
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-[#0e2a36] dark:text-white truncate">
                  {cert.title}
                </h3>
                <div className="text-sm text-slate-500 truncate">
                  {cert.fullName}
                </div>
              </div>
            </div>
            
            <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-[#566e7a] dark:text-slate-400">
              <div>
                <span className="block text-xs font-semibold text-slate-400">Issuer</span>
                <span className="truncate block">{cert.issuer}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400">Date</span>
                <span className="truncate block">{cert.issuedDate}</span>
              </div>
            </div>

            <div className="flex space-x-2 w-full">
              <Button
                as={Link}
                to={`/admin/certifications/${cert.id}`}
                variant="outline"
                size="sm"
                className="flex-1 justify-center"
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(cert.id, 'certification')}
                disabled={isDeleting}
                className="flex-1 justify-center"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        {certifications?.length === 0 && (
          <div className="py-8 text-center text-slate-500">
            No certifications added yet. Click the button above to add one.
          </div>
        )}
      </div>
    </div>
  );
}

