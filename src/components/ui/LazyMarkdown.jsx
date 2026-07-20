import React, { lazy, Suspense } from 'react';

// Dynamically import react-markdown and its plugins
const MarkdownWrapper = lazy(async () => {
  const [ReactMarkdown, remarkGfm, rehypeHighlight, rehypeRaw] = await Promise.all([
    import('react-markdown').then((m) => m.default),
    import('remark-gfm').then((m) => m.default),
    import('rehype-highlight').then((m) => m.default),
    import('rehype-raw').then((m) => m.default),
  ]);

  return {
    default: function MarkdownComponent({ children, ...props }) {
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          {...props}
        >
          {children}
        </ReactMarkdown>
      );
    },
  };
});

export function LazyMarkdown({ children, fallback, ...props }) {
  return (
    <Suspense fallback={fallback || <div className="animate-pulse h-32 bg-slate-200 dark:bg-slate-800 rounded-md"></div>}>
      <MarkdownWrapper {...props}>{children}</MarkdownWrapper>
    </Suspense>
  );
}
