import React from 'react';
import { Link } from 'react-router-dom';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useAdminDelete } from '../../hooks/useAdminDelete';
import { COLLECTIONS } from '../../lib/constants';
import { Button } from '../../components/ui/Button';

export function AdminBlog() {
  const {
    data: posts,
    loading,
    error: fetchError,
  } = useFirestoreCollection(COLLECTIONS.BLOG, 'publishedAt', 'desc');

  const { handleDelete, isDeleting } = useAdminDelete(COLLECTIONS.BLOG);

  if (loading) return <div>Loading posts...</div>;
  if (fetchError) return <div className="text-red-500">Error: {fetchError.message}</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button as={Link} to="/admin/blog/new">
          New Post
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Title
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Tags
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Published
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {posts?.map((post) => (
              <tr
                key={post.id}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-900 dark:text-white">
                  {post.title}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {post.isPublished ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Published (
                      {post.publishedAt
                        ? new Date(
                            post.publishedAt.toDate
                              ? post.publishedAt.toDate()
                              : post.publishedAt
                          ).toLocaleDateString()
                        : 'Unknown'}
                      )
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  <Link
                    to={`/admin/blog/edit/${post.id}`}
                    className="mr-4 text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, 'post')}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {posts?.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No blog posts found. Create one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
