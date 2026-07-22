import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { LucideIcons } from '../../lib/icon-map';
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
  const [loadTime, setLoadTime] = useState(Date.now());
  const [botcheck, setBotcheck] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Honeypot check
    if (botcheck) {
      // Silently reject if honeypot is filled
      setStatus('success');
      return;
    }

    // Time trap check (3 seconds)
    if (Date.now() - loadTime < 3000) {
      // Silently reject if submitted too quickly
      setStatus('success');
      return;
    }

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
              <span className="text-[#0e2a36] dark:text-white whitespace-pre-line">
                {config.contactPageTitle || "Let's start a project\ntogether"}
              </span>
            </h1>
          </header>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Side: Form */}
          <Reveal delay={0.1}>
            <div className="relative">
              {status === 'success' ? (
                <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 shadow-xl p-12 text-center">
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
                    className="mt-8 bg-cyan-500 text-[#0e2a36] hover:bg-cyan-600"
                    onClick={() => setStatus('idle')}
                  >
                    Send Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 shadow-xl p-8">
                  {/* Honeypot field - hidden from users but visible to bots */}
                  <input
                    type="text"
                    name="botcheck"
                    style={{ display: 'none' }}
                    tabIndex="-1"
                    autoComplete="off"
                    value={botcheck}
                    onChange={(e) => setBotcheck(e.target.value)}
                  />

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
                      className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-[#0e2a36] outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:text-white"
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
                      className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-[#0e2a36] outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:text-white"
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
                      className="min-h-[160px] w-full resize-none rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-[#0e2a36] outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:text-white"
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
                    className="flex items-center gap-2 rounded-full bg-[#1A1A1A] px-8 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20 hover:bg-black focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-slate-200"
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
              <div className="rounded-3xl bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 shadow-xl p-8">
                {config.contactPageImage || config.heroImageUrl ? (
                  <div className="mb-6 h-20 w-20 overflow-hidden rounded-full border-2 border-slate-200 dark:border-slate-800">
                    <img
                      src={config.contactPageImage || config.heroImageUrl}
                      alt={config.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {config.name?.charAt(0) || 'U'}
                  </div>
                )}

                <p className="mb-8 text-lg leading-relaxed text-[#385361] dark:text-slate-300 whitespace-pre-line">
                  {config.contactPageText || "My inbox is always open. Whether you have a project or just want to say Hi. I would love to hear from you. Feel free to contact me and I'll get back to you."}
                </p>

              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  );
}
