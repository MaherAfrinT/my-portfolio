import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import * as LucideIcons from 'lucide-react';
import { db } from '../../firebase';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { PageTransition } from '../../components/layout/PageTransition';
import { Reveal } from '../../components/ui/Reveal';
import { Button } from '../../components/ui/Button';

export function ContactPage() {
  const { config } = useSiteConfig();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false,
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form', error);
      setStatus('error');
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl pb-24 pt-12 md:pt-20">
        <Reveal>
          <header className="mb-12">
            <h1 className="mb-4 text-4xl font-extrabold md:text-6xl">
              <span className="text-slate-900 dark:text-white">
                Let's start a project
                <br />
                together
              </span>
            </h1>
          </header>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Side: Form */}
          <Reveal delay={0.1}>
            <div className="relative">
              {status === 'success' ? (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-slate-900/5 p-12 text-center dark:bg-white/5">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/30">
                    <LucideIcons.Check className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold dark:text-white">
                    Message Sent!
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                  <Button
                    className="mt-8 bg-cyan-500 text-slate-900 hover:bg-cyan-600"
                    onClick={() => setStatus('idle')}
                  >
                    Send Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-500 dark:text-slate-400"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-slate-900 outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-500 dark:text-slate-400"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-slate-900 outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-slate-500 dark:text-slate-400"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="min-h-[160px] w-full resize-none rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-slate-900 outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-red-500">
                      There was an error sending your message. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="flex items-center gap-2 rounded-full bg-[#1A1A1A] px-8 py-3 font-medium text-white transition-all hover:bg-black focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-slate-200"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Submit'}
                    <LucideIcons.ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Right Side: Profile Card */}
          <Reveal delay={0.2}>
            <div className="flex h-full flex-col justify-center">
              <div className="rounded-3xl bg-[#F8F9FA] p-8 dark:bg-[#111111]">
                <div className="mb-6 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Available for work
                  </span>
                </div>

                {config.heroImageUrl ? (
                  <div className="mb-6 h-20 w-20 overflow-hidden rounded-full border-2 border-slate-200 dark:border-slate-800">
                    <img
                      src={config.heroImageUrl}
                      alt={config.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {config.name?.charAt(0) || 'U'}
                  </div>
                )}

                <p className="mb-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  My inbox is always open. Whether you have a project or just
                  want to say Hi. I would love to hear from you. Feel free to
                  contact me and I'll get back to you.
                </p>

              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  );
}
