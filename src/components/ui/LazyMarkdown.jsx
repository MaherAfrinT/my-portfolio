import React, { lazy, Suspense } from 'react';

// Dynamically import marked and dompurify
const MarkdownWrapper = lazy(async () => {
  const [markedModule, dompurifyModule] = await Promise.all([
    import('marked'),
    import('dompurify')
  ]);
  
  const marked = markedModule.marked;
  const DOMPurify = dompurifyModule.default;

  return {
    default: function MarkdownComponent({ children, ...props }) {
      if (typeof children !== 'string') {
        return null;
      }
      const rawHtml = marked.parse(children);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
          {...props} 
        />
      );
    },
  };
});

export function LazyMarkdown({ children, fallback, ...props }) {
  return (
    <Suspense fallback={fallback || <div className="animate-pulse h-32 bg-slate-200 dark:bg-slate-800 rounded-md"></div>}>
      <MarkdownWrapper className="markdown-body" {...props}>{children}</MarkdownWrapper>
    </Suspense>
  );
}
