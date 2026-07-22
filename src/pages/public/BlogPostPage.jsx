import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { LazyMarkdown } from '../../components/ui/LazyMarkdown';
import { Helmet } from 'react-helmet-async';
import { PageTransition } from '../../components/layout/PageTransition';
import { Reveal } from '../../components/ui/Reveal';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { useReaderSettings } from '../../hooks/useReaderSettings';
import { ReaderSettingsMenu } from '../../components/ui/ReaderSettingsMenu';

const SkeletonLoader = () => (
  <div className="mx-auto max-w-3xl pt-12 pb-24 space-y-8 animate-pulse">
    <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800"></div>
    <div className="h-16 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
    <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800"></div>
    <div className="aspect-video w-full rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
    <div className="space-y-4 pt-8">
      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
      <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800"></div>
    </div>
  </div>
);

const NotFoundUI = () => (
  <PageTransition>
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 pt-12">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="text-4xl text-slate-400">?</div>
      </div>
      <h2 className="text-3xl font-bold text-[#0e2a36] dark:text-white">Content Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400">The blog post you are looking for does not exist or has been removed.</p>
      <Link
        to="/blog"
        className="rounded-full bg-cyan-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      >
        Back to Blog
      </Link>
    </div>
  </PageTransition>
);

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getReaderStyles } = useReaderSettings();

  useEffect(() => {
    async function fetchPost() {
      try {
        const q = query(collection(db, 'blogPosts'), where('slug', '==', String(slug || '')));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setPost({
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
          });
        } else {
          // Fallback: try fetching by ID just in case it's an old post without a slug
          const docRef = doc(db, 'blogPosts', String(slug || ''));
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPost({ id: docSnap.id, ...docSnap.data() });
          } else {
            setError('Post not found');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);



  if (loading) return <SkeletonLoader />;
  if (error || !post) return <NotFoundUI />;

  return (
    <PageTransition>
      <Helmet>
        <title>{post?.title ? `${post.title} | Blog` : 'Blog | Shahariar Sabbir'}</title>
        <meta name="description" content={post.excerpt || `Read ${post.title}`} />
      </Helmet>
      <div className="mx-auto max-w-3xl pt-12 pb-24 relative">
        <Reveal>
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <header className="mb-10">
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="font-mono rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mb-6 text-4xl leading-tight font-extrabold text-[#0e2a36] md:text-5xl dark:text-white">
              {post.title}
            </h1>
            <div className="font-mono text-sm text-slate-500 dark:text-slate-400">
              Published on{' '}
              {post.publishedAt?.toDate
                ? format(post.publishedAt.toDate(), 'MMMM d, yyyy')
                : post.publishedAt
                  ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
                  : 'Draft'}
            </div>
          </header>
        </Reveal>

        {post.coverImage && (
          <Reveal delay={0.2}>
            <div className="mb-12 aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 shadow-xl dark:border-slate-800">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        )}

        <Reveal delay={0.3}>
          <div 
            className="prose prose-slate dark:prose-invert prose-lg prose-headings:font-bold prose-a:text-cyan-500 hover:prose-a:text-cyan-600 prose-img:rounded-xl max-w-none"
            style={getReaderStyles()}
          >
            <LazyMarkdown>
              {post.content}
            </LazyMarkdown>
          </div>
        </Reveal>
      </div>
      <ReaderSettingsMenu />
    </PageTransition>
  );
}
