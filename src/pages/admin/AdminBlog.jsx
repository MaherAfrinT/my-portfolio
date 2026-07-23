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

export function AdminBlog() {
  const {
    data: posts,
    loading,
    error: fetchError,
  } = useFirestoreCollection(COLLECTIONS.BLOG, 'publishedAt', 'desc');

  const { handleDelete, isDeleting } = useAdminDelete(COLLECTIONS.BLOG);

  const [formData, setFormData] = useState({
    blogPageTitle: '',
    blogPageSubtitle: ''
  });
  const [configLoading, setConfigLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    async function fetchConfig() {
      try {
        const docRef = doc(db, COLLECTIONS.CONFIG, 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            blogPageTitle: data.blogPageTitle || '',
            blogPageSubtitle: data.blogPageSubtitle || '',
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

  if (loading || configLoading) return <div>Loading posts...</div>;
  if (fetchError) return <div className="text-red-500">Error: {fetchError.message}</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button as={Link} to="/admin/blog/new">
          New Post
        </Button>
      </div>

      <Card className="mb-8">
        <div className="border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Blog Page Settings</h2>
          {message && <span className="text-sm font-bold text-green-500">{message}</span>}
        </div>
        <CardContent className="pt-6">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Blog Page Title</label>
              <Input
                name="blogPageTitle"
                value={formData.blogPageTitle}
                onChange={handleChange}
                placeholder="Blog"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Blog Page Subtitle</label>
              <Textarea
                name="blogPageSubtitle"
                value={formData.blogPageSubtitle}
                onChange={handleChange}
                placeholder="Thoughts, tutorials, and deep dives into technology and design."
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
                <td className="px-6 py-4 font-medium whitespace-nowrap text-[#0e2a36] dark:text-white">
                  {post.title}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-[#163847] dark:bg-slate-700 dark:text-slate-300"
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

      <div className="block space-y-4 md:hidden">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-lg font-bold text-[#0e2a36] dark:text-white">
                {post.title}
              </h3>
              <button
                onClick={() => handleDelete(post.id, 'post')}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 dark:text-red-400"
                aria-label="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-3 flex flex-wrap gap-1">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-[#163847] dark:bg-slate-700 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span
                className={
                  post.isPublished
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-amber-600 dark:text-amber-400'
                }
              >
                {post.isPublished ? 'Published' : 'Draft'}
              </span>
              <Link
                to={`/admin/blog/edit/${post.id}`}
                className="text-cyan-600 hover:underline dark:text-cyan-400"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
        {posts?.length === 0 && (
          <div className="py-8 text-center text-slate-500">
            No blog posts found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
