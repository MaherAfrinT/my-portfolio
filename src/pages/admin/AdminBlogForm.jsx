import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminBlogForm } from '../../hooks/useAdminBlogForm';
import { Button } from '../../components/ui/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Youtube, Image as ImageIcon } from 'lucide-react';

export function AdminBlogForm() {
  const { id } = useParams();
  const {
    isEditing,
    loading,
    saving,
    error,
    formData,
    handleTitleChange,
    handleChange,
    handleSubmit,
    navigate
  } = useAdminBlogForm(id);

  const [activeTab, setActiveTab] = useState('edit');

  const insertTextAtCursor = (text) => {
    const textarea = document.getElementById('blog-content-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = formData.content || '';
    
    const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
    handleChange({ target: { name: 'content', value: newContent } });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const handleInsertYoutube = () => {
    const url = prompt('Enter YouTube video URL:');
    if (!url) return;
    
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      alert('Invalid YouTube URL');
      return;
    }
    
    const embedCode = `\n<div class="my-6 aspect-video w-full overflow-hidden rounded-xl">\n  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n</div>\n`;
    insertTextAtCursor(embedCode);
  };

  const handleInsertImage = () => {
    const url = prompt('Enter Image URL (e.g. from Imgur):');
    if (!url) return;
    
    const alt = prompt('Enter Image Description (optional):') || 'Image';
    insertTextAtCursor(`\n![${alt}](${url})\n`);
  };


  if (loading) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl pb-20">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Post' : 'New Post'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/admin/blog')}>
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
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-600"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-600"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium">
              Content (Markdown)
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInsertYoutube}
                  className="rounded bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 hover:text-red-500 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-400"
                  title="Insert YouTube Video"
                >
                  <Youtube className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleInsertImage}
                  className="rounded bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 hover:text-cyan-500 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-cyan-400"
                  title="Insert Image (Imgur)"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${activeTab === 'edit' ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-slate-500 hover:text-[#385361]'}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${activeTab === 'preview' ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-slate-500 hover:text-[#385361]'}`}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'edit' ? (
            <textarea
              id="blog-content-textarea"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="15"
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-600"
            />
          ) : (
            <div className="prose dark:prose-invert min-h-[350px] w-full max-w-none overflow-y-auto rounded-lg border border-slate-300 bg-white p-6 dark:border-slate-600 dark:bg-slate-900">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
              >
                {formData.content || '*No content to preview*'}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="React, Firebase, Tutorial"
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-600"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Cover Image URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-600"
            />
          </div>
        </div>

        <div className="flex items-center pt-2">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 bg-slate-100 text-cyan-600 focus:ring-2 focus:ring-cyan-500 dark:border-slate-600 dark:bg-slate-700 dark:ring-offset-slate-800 dark:focus:ring-cyan-600"
          />
          <label
            htmlFor="isPublished"
            className="ml-2 text-sm font-medium text-[#0e2a36] dark:text-slate-300"
          >
            Publish this post (make it visible to public)
          </label>
        </div>

        <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}
