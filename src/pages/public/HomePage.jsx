import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { LOTTIE_CAT_URL, DEFAULT_SITE_CONFIG } from '../../lib/constants';
import { Tag } from '../../components/ui/Tag';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { PageTransition } from '../../components/layout/PageTransition';
import { Button } from '../../components/ui/Button';
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
  const [isCertDropdownOpen, setIsCertDropdownOpen] = useState(false);
  const certDropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (certDropdownRef.current && !certDropdownRef.current.contains(e.target)) {
        setIsCertDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <motion.h1 variants={cardVariants} className="flex flex-col gap-1 min-h-[160px] md:min-h-[180px]">
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
                as="a"
                href={config.resumeUrl || '#'}
                target={config.resumeUrl ? '_blank' : '_self'}
                rel="noopener noreferrer"
                size="lg"
                className="flex items-center gap-2 border-none bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(0,255,204,0.3)] transition-transform hover:scale-105 hover:bg-cyan-600"
              >
                <LucideIcons.Download className="h-4 w-4" /> Resume
              </Button>
              <Button
                as={Link}
                to="/projects"
                size="lg"
                variant="outline"
                className="flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,204,0.1)] transition-transform hover:scale-105"
              >
                View Projects <LucideIcons.ArrowUpRight className="h-4 w-4" />
              </Button>
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
                        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-cyan-500/10 text-cyan-500 dark:text-[#00ffcc]">
                          {skillGroup.categoryImageUrl ? (
                            <img src={skillGroup.categoryImageUrl} alt={skillGroup.category} className="h-full w-full object-cover" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
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

              {/* Filter Dropdown */}
              <div className="flex items-center gap-3" ref={certDropdownRef}>
                <div className="relative">
                  <button
                    onClick={() => setIsCertDropdownOpen(!isCertDropdownOpen)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      selectedCertTag
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-[#333] dark:bg-dark-surface dark:text-[#EDEDED] dark:hover:border-[#555]'
                    }`}
                  >
                    <LucideIcons.Filter size={14} />
                    {selectedCertTag || 'Filter by Tag'}
                    <LucideIcons.ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${isCertDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isCertDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl dark:border-[#333] dark:bg-[#1a1a1a]/95"
                      >
                        <button
                          onClick={() => { setSelectedCertTag(null); setIsCertDropdownOpen(false); }}
                          className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                            selectedCertTag === null
                              ? 'bg-cyan-500/15 text-cyan-400'
                              : 'text-slate-600 hover:bg-slate-100 dark:text-[#EDEDED] dark:hover:bg-[#222]'
                          }`}
                        >
                          All
                        </button>
                        {allCertTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => { setSelectedCertTag(tag); setIsCertDropdownOpen(false); }}
                            className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                              selectedCertTag === tag
                                ? 'bg-cyan-500/15 text-cyan-400'
                                : 'text-slate-600 hover:bg-slate-100 dark:text-[#EDEDED] dark:hover:bg-[#222]'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Active filter badge with clear button */}
                {selectedCertTag && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSelectedCertTag(null)}
                    className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
                  >
                    {selectedCertTag}
                    <LucideIcons.X size={12} />
                  </motion.button>
                )}
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

        {/* CTA Section */}
        <section id="contact" className="scroll-mt-24 pb-24">
          <Reveal>
            <div className="glass-panel rounded-3xl group relative overflow-hidden p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)] md:p-20">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="mb-6 flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/50">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Available for work
                  </span>
                </div>
                <h2 className="mb-8 max-w-2xl text-4xl font-extrabold text-slate-900 md:text-6xl dark:text-white">
                  Let's create your next big idea.
                </h2>
                <Button
                  as={Link}
                  to="/contact"
                  className="rounded-full border border-slate-800 bg-transparent px-8 py-6 text-lg font-medium text-slate-900 transition-all hover:bg-slate-900 hover:text-white dark:border-slate-200 dark:text-white dark:hover:bg-white dark:hover:text-slate-900"
                >
                  Contact Me
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </PageTransition>
  );
}
