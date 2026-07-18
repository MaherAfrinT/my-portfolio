import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/layout/PageTransition';
import { Reveal } from '../../components/ui/Reveal';
import { WalkingCatFooter } from '../../components/ui/WalkingCatFooter';
import { format } from 'date-fns';

export function BlogPage() {
  const {
    data: posts,
    loading,
    error,
  } = useFirestoreCollection('blogPosts', 'publishedAt', 'desc');
  const [filter, setFilter] = useState('All');

  // Extract unique tags
  const tags = ['All', ...new Set(posts?.flatMap((p) => p.tags || []) || [])];

  const filteredPosts =
    filter === 'All' ? posts : posts?.filter((p) => p.tags?.includes(filter));

  return (
    <PageTransition>
      <div className="space-y-12 pb-24">
        <Reveal>
          <header className="pt-12">
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="max-w-2xl text-xl text-slate-600 dark:text-slate-400">
              Thoughts, tutorials, and deep dives into technology and design.
            </p>
          </header>
        </Reveal>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">
            Error loading posts. Please try again later.
          </div>
        ) : (
          <Reveal>
            {/* Filter Bar */}
            <div className="mb-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <motion.button
                  layout
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    filter === tag
                      ? 'bg-cyan-600 text-white dark:bg-cyan-500'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>

            {/* Posts Grid - Masonry */}
            <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3">
              {filteredPosts?.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.1}>
                  <Link
                    to={`/blog/${post.slug || post.id}`}
                    className="block break-inside-avoid"
                  >
                    <div className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-auto sm:h-72">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-100 to-purple-100 dark:from-cyan-900/40 dark:to-purple-900/40">
                            <span className="text-4xl">📝</span>
                          </div>
                        )}
                        {/* Overlay gradient for readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                      </div>

                      {/* Standard Content (Hidden on hover using opacity or replaced by slide up overlay) */}
                      {/* Actually, let's keep the standard content below the image and slide the glassmorphism overlay OVER the image */}
                      <div className="p-6">
                        <div className="mb-2 font-mono text-sm text-slate-500 dark:text-slate-400">
                          {post.publishedAt?.toDate
                            ? format(post.publishedAt.toDate(), 'MMMM d, yyyy')
                            : post.publishedAt
                              ? format(
                                  new Date(post.publishedAt),
                                  'MMMM d, yyyy'
                                )
                              : 'Draft'}
                        </div>
                        <h3 className="mb-3 line-clamp-2 text-xl font-bold">
                          {post.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {post.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="font-mono rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Glassmorphism Hover Overlay */}
                      <div className="absolute inset-0 flex translate-y-full flex-col justify-end bg-black/40 p-6 backdrop-blur-md transition-transform duration-500 ease-out group-hover:translate-y-0">
                        <div className="mb-2 font-mono text-sm font-medium text-cyan-300">
                          {post.publishedAt?.toDate
                            ? format(post.publishedAt.toDate(), 'MMMM d, yyyy')
                            : 'Draft'}
                        </div>
                        <h3 className="mb-4 text-2xl font-bold text-white">
                          {post.title}
                        </h3>
                        <p className="mb-6 line-clamp-3 text-slate-300">
                          {post.content
                            ? post.content
                                .replace(/[#*`_]/g, '')
                                .substring(0, 100) + '...'
                            : 'No excerpt'}
                        </p>
                        <div className="mt-auto flex flex-wrap gap-2">
                          {post.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}

              {filteredPosts?.length === 0 && (
                <div className="col-span-full w-full py-20 text-center text-slate-500">
                  No posts found in this category.
                </div>
              )}
            </div>
          </Reveal>
        )}
        <WalkingCatFooter />
      </div>
    </PageTransition>
  );
}
