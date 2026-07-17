import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminJournalForm } from '../../hooks/useAdminJournalForm';
import { Button } from '../../components/ui/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export function AdminJournalForm() {
  const { id } = useParams();
  const {
    isEditing,
    loading,
    saving,
    error,
    formData,
    handleChange,
    handleSubmit,
    navigate
  } = useAdminJournalForm(id);

  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
  const categories = ['Philosophy', 'Code', 'Life', 'Update', 'Thoughts'];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Journal Entry' : 'New Journal Entry'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/admin/journal')}>
          Cancel
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-500">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-700 dark:bg-slate-800"
      >
        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., Thoughts on Declarative UI..."
              required
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-600"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-center">
            <label className="flex cursor-pointer items-center space-x-3">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="h-5 w-5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm font-medium">Publish immediately</span>
            </label>
            <p className="mt-1 pl-8 text-xs text-slate-500">
              If unchecked, this will be saved as a Draft.
            </p>
          </div>
        </div>

        {/* Markdown Editor with Tabs */}
        <div className="mt-8 flex h-[500px] flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'write'
                  ? 'border-b-2 border-cyan-500 bg-white text-cyan-600 dark:bg-slate-800 dark:text-cyan-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'border-b-2 border-cyan-500 bg-white text-cyan-600 dark:bg-slate-800 dark:text-cyan-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Preview
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800">
            {activeTab === 'write' ? (
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your journal entry here... Markdown is supported."
                required
                className="h-full w-full resize-none border-none bg-transparent p-6 font-mono text-sm leading-relaxed focus:ring-0 focus:outline-none"
              />
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none p-6">
                {formData.content ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {formData.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-slate-500 italic">
                    Nothing to preview yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-6 dark:border-slate-700">
          <Button type="submit" disabled={saving} className="px-8 py-2.5">
            {saving ? 'Saving...' : 'Save Entry'}
          </Button>
        </div>
      </form>
    </div>
  );
}
