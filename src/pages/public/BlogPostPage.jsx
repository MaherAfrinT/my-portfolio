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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { PageTransition } from '../../components/layout/PageTransition';
import { Reveal } from '../../components/ui/Reveal';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { useReaderSettings } from '../../hooks/useReaderSettings';
import { ReaderSettingsMenu } from '../../components/ui/ReaderSettingsMenu';

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getReaderStyles } = useReaderSettings();

  useEffect(() => {
    async function fetchPost() {
      try {
        const q = query(collection(db, 'blogPosts'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setPost({
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
          });
        } else {
          // Fallback: try fetching by ID just in case it's an old post without a slug
          const docRef = doc(db, 'blogPosts', slug);
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

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-red-500">
          {error || 'Post not found'}
        </h2>
        <Link to="/blog" className="text-cyan-500 hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
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
                  className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mb-6 text-4xl leading-tight font-extrabold text-slate-900 md:text-5xl dark:text-white">
              {post.title}
            </h1>
            <div className="text-sm text-slate-500 dark:text-slate-400">
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </Reveal>
      </div>
      <ReaderSettingsMenu />
    </PageTransition>
  );
}
