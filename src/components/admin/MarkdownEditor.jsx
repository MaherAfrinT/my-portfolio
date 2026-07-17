import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function MarkdownEditor({ value, onChange, minHeight = '400px' }) {
  const [isPreview, setIsPreview] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const textareaRef = useRef(null);

  // Insert markdown image syntax at cursor position
  const insertImage = () => {
    if (!imageUrl.trim()) return;

    const alt = imageAlt.trim() || 'image';
    const markdownImg = `![${alt}](${imageUrl.trim()})`;

    // Insert at cursor or append
    const current = value || '';
    const updated = current ? `${current}\n\n${markdownImg}` : markdownImg;

    onChange(updated);
    setImageUrl('');
    setImageAlt('');
    setShowImageModal(false);
  };

  const handleImageKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      insertImage();
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      {/* Toolbar */}
      <div className="flex items-center border-b border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => setIsPreview(false)}
          className={`px-4 py-2 text-sm font-medium ${!isPreview ? 'border-t-2 border-cyan-500 bg-white text-cyan-600 dark:bg-slate-900 dark:text-cyan-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setIsPreview(true)}
          className={`px-4 py-2 text-sm font-medium ${isPreview ? 'border-t-2 border-cyan-500 bg-white text-cyan-600 dark:bg-slate-900 dark:text-cyan-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Preview
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Insert Image button */}
        {!isPreview && (
          <button
            type="button"
            onClick={() => setShowImageModal(!showImageModal)}
            className="mr-2 rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Insert image from URL"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Image insert popover */}
      {showImageModal && !isPreview && (
        <div className="space-y-2 border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex gap-2">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={handleImageKeyDown}
              placeholder="Image URL (https://…)"
              className="h-8 flex-1 text-sm"
              autoFocus
            />
            <Input
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              onKeyDown={handleImageKeyDown}
              placeholder="Alt text (optional)"
              className="h-8 w-40 text-sm"
            />
            <Button type="button" size="sm" onClick={insertImage}>
              Insert
            </Button>
          </div>
          <p className="text-[11px] text-slate-400">
            Inserts{' '}
            <code className="rounded bg-slate-200 px-1 dark:bg-slate-700">
              ![alt](url)
            </code>{' '}
            into the editor.
          </p>
        </div>
      )}

      {/* Editor / Preview */}
      <div className="relative flex-1" style={{ minHeight }}>
        {isPreview ? (
          <div className="prose dark:prose-invert absolute inset-0 max-w-none overflow-auto p-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {value || '*Nothing to preview*'}
            </ReactMarkdown>
          </div>
        ) : (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full resize-none rounded-none border-0 font-mono text-sm focus:ring-0"
            placeholder="Write markdown here..."
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between border-t border-slate-200 bg-slate-50 p-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        <span>Markdown is supported.</span>
        <span>{value?.length || 0} characters</span>
      </div>
    </div>
  );
}
