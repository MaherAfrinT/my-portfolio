import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/layout/PageTransition';
import { Tag } from '../../components/ui/Tag';
import { Button } from '../../components/ui/Button';

export function CertificationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCert() {
      try {
        const docRef = doc(db, 'certifications', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCert({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Certification not found');
        }
      } catch (err) {
        console.error('Error fetching certification:', err);
        setError('Failed to load certification details');
      } finally {
        setLoading(false);
      }
    }

    fetchCert();
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500"></div>
        </div>
      </PageTransition>
    );
  }

  if (error || !cert) {
    return (
      <PageTransition>
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
          <div className="text-xl text-red-500">{error}</div>
          <Button onClick={() => navigate('/certifications')}>
            Back to Certifications
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl space-y-8 pb-24">
        {/* Back Link */}
        <Link
          to="/certifications"
          className="mt-8 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-cyan-500"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Certifications
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass-panel rounded-xl relative overflow-hidden border-t-4 border-t-cyan-500 p-8 md:p-12">
            <div className="pointer-events-none absolute top-0 right-0 rounded-bl-full bg-cyan-500/5 p-32" />

            <div className="relative z-10 flex flex-col gap-8 md:flex-row">
              {/* Badge Column */}
              <div className="flex shrink-0 flex-col items-center md:w-1/3">
                <div className="mb-6 flex h-48 w-48 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-4 shadow-xl dark:border-[#333333] dark:bg-dark-surface">
                  {cert.badgeUrl ? (
                    <img
                      src={cert.badgeUrl}
                      alt={cert.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-6xl">🏆</span>
                  )}
                </div>

                {cert.verifyUrl && (
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="group w-full border-cyan-500/50 text-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 hover:border-cyan-500 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-500/10"
                    >
                      Verify Credential
                      <svg
                        className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </Button>
                  </a>
                )}
              </div>

              {/* Info Column */}
              <div className="flex flex-col md:w-2/3">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-cyan-200 bg-cyan-100 px-3 py-1 font-mono text-xs font-bold tracking-wider text-cyan-700 uppercase dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400">
                    version: active arch: certified
                  </span>
                </div>

                <h1 className="mb-2 text-4xl font-black text-slate-900 md:text-5xl dark:text-white">
                  {cert.title}
                </h1>

                <h2 className="mb-6 text-xl font-medium text-slate-600 md:text-2xl dark:text-slate-400">
                  {cert.fullName}
                </h2>

                <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-[#030712]/50">
                  <div>
                    <div className="mb-1 text-xs tracking-wider text-slate-500 uppercase">
                      Issuer
                    </div>
                    <div className="flex items-center font-medium text-slate-900 dark:text-white">
                      <svg
                        className="mr-2 h-4 w-4 text-cyan-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {cert.issuer}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs tracking-wider text-slate-500 uppercase">
                      Date
                    </div>
                    <div className="flex items-center font-medium text-slate-900 dark:text-white">
                      <svg
                        className="mr-2 h-4 w-4 text-cyan-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {cert.issuedDate}{' '}
                      {cert.expiryDate && `- ${cert.expiryDate}`}
                    </div>
                  </div>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {cert.description || '*No description provided.*'}
                  </ReactMarkdown>
                </div>

                {cert.tags && cert.tags.length > 0 && (
                  <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-800">
                    <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-500 uppercase">
                      Related Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cert.tags.map((tag) => (
                        <Tag
                          key={tag}
                          className="bg-slate-100 text-slate-700 dark:bg-dark-surface dark:text-slate-300"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
