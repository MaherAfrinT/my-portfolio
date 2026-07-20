import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { LOTTIE_CAT_URL, DEFAULT_SITE_CONFIG } from '../../lib/constants';
import { Tag } from '../../components/ui/Tag';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { PageTransition } from '../../components/layout/PageTransition';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { TypewriterHeadline } from '../../components/ui/TypewriterHeadline';
import { KineticText } from '../../components/ui/KineticText';
import { Reveal } from '../../components/ui/Reveal';

export function HomePage() {
  const { config } = useSiteConfig();
  const { data: certifications } = useFirestoreCollection(
    'certifications',
    'createdAt',
    'desc'
  );
  const [animationData, setAnimationData] = useState(null);
  const [selectedCertTag, setSelectedCertTag] = useState(null);

  const allCertTags = certifications
    ? Array.from(new Set(certifications.flatMap((cert) => cert.tags || [])))
    : [];

  const filteredCerts = selectedCertTag
    ? certifications?.filter((cert) =>
        (cert.tags || []).includes(selectedCertTag)
      )
    : certifications;

  React.useEffect(() => {
    fetch(LOTTIE_CAT_URL)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error('Failed to load Lottie animation:', err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 48 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <PageTransition>
      <div className="space-y-32 pb-24">
        {/* Hero Section */}
        <section className="flex min-h-[85vh] flex-col items-center justify-between gap-12 pt-12 md:flex-row md:pt-20">
          <motion.div
            className="flex-1 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={cardVariants}
              className="font-mono text-lg text-cyan-400 dark:text-[#00ffcc]"
            >
              {config.greetingText || DEFAULT_SITE_CONFIG.greetingText}{' '}
              {config.name}.
            </motion.p>
            <motion.h1 variants={cardVariants} className="flex flex-col gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl dark:text-white">
                {config.heroPrefix || DEFAULT_SITE_CONFIG.heroPrefix}
              </span>
              <TypewriterHeadline
                words={
                  config.typewriterWords || DEFAULT_SITE_CONFIG.typewriterWords
                }
              />
            </motion.h1>
            <motion.div
              variants={cardVariants}
              className="max-w-xl pt-4 text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-300"
            >
              <KineticText
                text={config.tagline || DEFAULT_SITE_CONFIG.tagline}
              />
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="flex flex-wrap gap-4 pt-8"
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById('contact')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                size="lg"
                className="border-none bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(0,255,204,0.3)] transition-transform hover:scale-105 hover:bg-cyan-600"
              >
                Contact Me
              </Button>
              <Button
                as={Link}
                to="/projects"
                size="lg"
                className="flex items-center gap-2 border-none bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(0,255,204,0.3)] transition-transform hover:scale-105 hover:bg-cyan-600"
              >
                View Projects <LucideIcons.ArrowUpRight className="h-4 w-4" />
              </Button>
              {config.resumeUrl && (
                <Button
                  as="a"
                  href={config.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 border-slate-700 text-slate-300 transition-transform hover:scale-105 hover:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-800"
                >
                  <LucideIcons.Download className="h-4 w-4" /> Resume
                </Button>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative z-0 flex w-full max-w-md flex-1 justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative h-64 w-64 md:h-96 md:w-96">
              <div className="animate-pulse-glow absolute inset-0 rounded-full bg-cyan-500/20 blur-3xl filter dark:bg-[#00ffcc]/10"></div>
              {config.heroImageUrl ? (
                <img
                  src={config.heroImageUrl}
                  alt={config.name || 'Hero'}
                  className="relative z-10 h-full w-full rounded-full border-4 border-cyan-500/30 object-cover shadow-[0_0_30px_rgba(0,255,204,0.3)]"
                />
              ) : (
                animationData && (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    className="relative z-10 h-full w-full"
                  />
                )
              )}
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="scroll-mt-24">
          <Reveal>
            <h2 className="mb-8 flex items-center font-mono text-3xl font-bold">
              <span className="mr-4 text-cyan-500 dark:text-[#00ffcc]">
                01.
              </span>{' '}
              About Me
            </h2>
            <div className="flex flex-col items-start gap-8 md:flex-row">
              <div className="glass-panel rounded-xl group relative w-full flex-1 overflow-hidden p-8 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <p className="relative z-10 text-lg leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                  {config.about || DEFAULT_SITE_CONFIG.about}
                </p>
              </div>
              {config.aboutImageUrl && (
                <motion.div
                  className="mx-auto w-full max-w-sm shrink-0 md:w-1/3"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={config.aboutImageUrl}
                    alt="About Me"
                    className="aspect-square w-full rounded-2xl border-2 border-cyan-500/20 object-cover shadow-[0_0_20px_rgba(0,255,204,0.15)] shadow-xl"
                  />
                </motion.div>
              )}
            </div>
          </Reveal>
        </section>

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-24">
          <Reveal>
            <h2 className="mb-8 flex items-center font-mono text-3xl font-bold">
              <span className="mr-4 text-cyan-500 dark:text-[#00ffcc]">
                02.
              </span>{' '}
              Skills
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {(config.skills || []).map((skillGroup, idx) => {
                const Icon =
                  LucideIcons[skillGroup.iconName || 'Code'] ||
                  LucideIcons.Code;

                return (
                  <motion.div key={idx} variants={cardVariants}>
                    <div className="glass-panel rounded-xl group relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)]">
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <h3 className="relative z-10 mb-6 flex items-center gap-3 border-b border-slate-200 pb-4 text-xl font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                        <span className="rounded-lg bg-cyan-500/10 p-2 text-cyan-500 dark:text-[#00ffcc]">
                          <Icon className="h-5 w-5" />
                        </span>
                        {skillGroup.category}
                      </h3>
                      <ul className="space-y-4">
                        {skillGroup.items.map((item, itemIdx) => {
                          const isLegacy = typeof item === 'string';
                          // Handle all possible object shapes: {name,icon}, {title,id,desc}, etc.
                          const name = isLegacy
                            ? item
                            : item.name ||
                              item.title ||
                              item.label ||
                              String(Object.values(item)[0] || '');
                          const icon = isLegacy ? '' : item.icon || '';
                          const imageUrl = isLegacy ? '' : item.imageUrl || '';

                          return (
                            <motion.li
                              key={itemIdx}
                              className="group flex items-center gap-3"
                              whileHover={{ x: 5 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              {imageUrl ? (
                                <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 p-1.5 transition-colors group-hover:bg-cyan-500/20 dark:bg-slate-800">
                                  <img
                                    src={imageUrl}
                                    alt={name}
                                    className="h-full w-full object-contain"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display =
                                        'block';
                                    }}
                                  />
                                  <span className="hidden h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-[#00ffcc]"></span>
                                </div>
                              ) : icon ? (
                                <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 p-1.5 transition-colors group-hover:bg-cyan-500/20 dark:bg-slate-800">
                                  <img
                                    src={`https://cdn.simpleicons.org/${icon}/00ffcc`}
                                    alt={name}
                                    className="h-full w-full object-contain"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display =
                                        'block';
                                    }}
                                  />
                                  <span className="hidden h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-[#00ffcc]"></span>
                                </div>
                              ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded">
                                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 opacity-50 transition-opacity group-hover:opacity-100 dark:bg-[#00ffcc]"></span>
                                </div>
                              )}
                              <span className="text-sm font-medium text-slate-600 transition-colors group-hover:text-cyan-500 dark:text-slate-300 dark:group-hover:text-[#00ffcc]">
                                {name}
                              </span>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </Reveal>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="scroll-mt-24">
          <Reveal>
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="flex items-center font-mono text-3xl font-bold">
                <span className="mr-4 text-cyan-500 dark:text-[#00ffcc]">
                  03.
                </span>{' '}
                Certifications
              </h2>

              {/* Filter Tags */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCertTag(null)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    selectedCertTag === null
                      ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-dark-surface dark:text-[#EDEDED] dark:hover:bg-[#222222]'
                  }`}
                >
                  All
                </button>
                {allCertTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedCertTag(tag)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                      selectedCertTag === tag
                        ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-dark-surface dark:text-[#EDEDED] dark:hover:bg-[#222222]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredCerts?.map((cert) => (
                  <motion.div
                    key={cert.id}
                    layout
                    variants={cardVariants}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={`/certifications/${cert.id}`}>
                      <div className="glass-panel rounded-xl group relative flex h-full cursor-pointer flex-col overflow-hidden p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)]">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="mb-4 flex items-start gap-4">
                          {cert.badgeUrl ? (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 p-2">
                              <img
                                src={cert.badgeUrl}
                                alt={cert.title}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-2xl">
                              🏆
                            </div>
                          )}
                          <div>
                            <h3 className="line-clamp-1 text-xl font-bold text-slate-900 transition-colors group-hover:text-cyan-500 dark:text-white">
                              {cert.title}
                            </h3>
                            <div className="mt-1 font-mono text-sm text-cyan-600 dark:text-cyan-400">
                              {cert.issuer}
                            </div>
                          </div>
                        </div>

                        <p className="mb-6 line-clamp-2 flex-grow text-sm text-slate-600 dark:text-slate-400">
                          {cert.fullName}
                        </p>

                        <div className="mt-auto flex flex-wrap gap-2">
                          {cert.tags?.slice(0, 3).map((tag, idx) => (
                            <Tag
                              key={idx}
                              className="border-none bg-slate-100 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {tag}
                            </Tag>
                          ))}
                          {cert.tags?.length > 3 && (
                            <Tag className="border-none bg-slate-100 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              +{cert.tags.length - 3}
                            </Tag>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>

              {(!filteredCerts || filteredCerts.length === 0) && (
                <div className="col-span-full rounded-xl border border-slate-800 bg-slate-900/20 py-8 text-center text-slate-500">
                  No certifications found.
                </div>
              )}
            </motion.div>
          </Reveal>
        </section>

        {/* Manifesto Section */}
        <section id="manifesto" className="scroll-mt-24">
          <Reveal>
            <h2 className="mb-8 flex items-center font-mono text-3xl font-bold">
              <span className="mr-4 text-cyan-500 dark:text-[#00ffcc]">
                04.
              </span>{' '}
              My Manifesto
            </h2>
            {Array.isArray(config.manifesto) && config.manifesto.length > 0 ? (
              /* Array format: {id, title, desc} — render as cards */
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
              >
                {config.manifesto.map((item) => (
                  <motion.div
                    key={item.id || item.title}
                    variants={cardVariants}
                  >
                    <div className="glass-panel rounded-xl group relative h-full overflow-hidden p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)]">
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative z-10 flex items-start gap-4">
                        <span className="shrink-0 font-mono text-3xl leading-none font-black text-cyan-500/30 dark:text-[#00ffcc]/30">
                          {item.id || '—'}
                        </span>
                        <div>
                          <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* String format — render as single quote block */
              <div className="glass-panel rounded-xl group relative overflow-hidden p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)] md:p-12">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <LucideIcons.Quote className="mx-auto mb-6 h-12 w-12 text-cyan-500/30 md:h-16 md:w-16 dark:text-[#00ffcc]/30" />
                  <p className="text-xl leading-relaxed font-bold text-slate-800 italic md:text-3xl dark:text-slate-100">
                    "
                    {typeof config.manifesto === 'string' && config.manifesto
                      ? config.manifesto
                      : DEFAULT_SITE_CONFIG.manifesto}
                    "
                  </p>
                </div>
              </div>
            )}
          </Reveal>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-24 pb-24">
          <ContactForm />
        </section>
      </div>
    </PageTransition>
  );
}

function ContactForm() {
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
    <Reveal>
      <h2 className="mb-8 flex items-center font-mono text-3xl font-bold">
        <span className="mr-4 text-cyan-500 dark:text-[#00ffcc]">05.</span> Get
        In Touch
      </h2>
      <div className="glass-panel rounded-xl group relative max-w-2xl overflow-hidden p-8 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10">
          {status === 'success' ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/30">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Message Sent!</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Thanks for reaching out. I'll get back to you soon.
              </p>
              <Button
                className="mt-6 bg-cyan-500 text-slate-900 hover:bg-cyan-600"
                onClick={() => setStatus('idle')}
              >
                Send Another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="font-mono text-sm font-medium text-slate-400"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="font-mono text-sm font-medium text-slate-400"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="font-mono text-sm font-medium text-slate-400"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Hello, I'd like to talk about..."
                  className="min-h-[150px]"
                  required
                />
              </div>
              {status === 'error' && (
                <p className="text-sm text-red-500">
                  There was an error sending your message. Please try again.
                </p>
              )}
              <Button
                type="submit"
                isLoading={status === 'submitting'}
                className="w-full border-none bg-cyan-500 font-bold tracking-wide text-slate-900 shadow-[0_0_10px_rgba(0,255,204,0.2)] hover:bg-cyan-600 md:w-auto"
              >
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </Reveal>
  );
}
