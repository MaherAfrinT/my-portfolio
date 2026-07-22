import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LucideIcons } from '../../lib/icon-map';
import { Tag } from '../ui/Tag';
import { Reveal } from '../ui/Reveal';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';

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

export function CertificationsSection({ config }) {
  const { data: certifications, loading: certsLoading } = useFirestoreCollection(
    'certifications',
    'createdAt',
    'desc'
  );

  const [selectedCertTag, setSelectedCertTag] = useState(null);
  const [isCertDropdownOpen, setIsCertDropdownOpen] = useState(false);
  const certDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (certDropdownRef.current && !certDropdownRef.current.contains(e.target)) {
        setIsCertDropdownOpen(false);
      }
    }
    
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsCertDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const allCertTags = certifications
    ? Array.from(new Set(certifications.flatMap((cert) => cert.tags || [])))
    : [];

  const filteredCerts = selectedCertTag
    ? certifications?.filter((cert) =>
        (cert.tags || []).includes(selectedCertTag)
      )
    : certifications;

  if (config.sectionVisibility?.certifications === false) return null;

  return (
    <section id="certifications" className="scroll-mt-24">
      <Reveal>
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="flex items-center font-mono text-3xl font-bold">
            <span className="mr-4 text-cyan-600 dark:text-cyan-400">
              03.
            </span>{' '}
            Certifications
          </h2>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-3" ref={certDropdownRef}>
            <div className="relative">
              <button
                onClick={() => setIsCertDropdownOpen(!isCertDropdownOpen)}
                aria-expanded={isCertDropdownOpen}
                aria-haspopup="listbox"
                aria-controls="cert-dropdown-list"
                aria-label="Filter certifications by tag"
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedCertTag
                    ? 'border-cyan-600/50 bg-[#f0f9fb] text-cyan-600 shadow-cyan-600/10 dark:border-cyan-500/50 dark:bg-cyan-500/10 dark:text-cyan-400 dark:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'border-slate-200 bg-white text-[#566e7a] hover:border-slate-300 dark:border-[#333] dark:bg-dark-surface dark:text-[#EDEDED] dark:hover:border-[#555]'
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
                    id="cert-dropdown-list"
                    role="listbox"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 z-50 mt-2 min-w-[200px] max-h-[300px] overflow-y-auto overflow-x-hidden rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl dark:border-[#333] dark:bg-[#1a1a1a]/95"
                  >
                    <button
                      role="option"
                      aria-selected={selectedCertTag === null}
                      onClick={() => { setSelectedCertTag(null); setIsCertDropdownOpen(false); }}
                      className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                        selectedCertTag === null
                          ? 'bg-[#f0f9fb] text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400'
                          : 'text-[#566e7a] hover:bg-slate-100 dark:text-[#EDEDED] dark:hover:bg-[#222]'
                      }`}
                    >
                      All
                    </button>
                    {allCertTags.map((tag) => (
                      <button
                        key={tag}
                        role="option"
                        aria-selected={selectedCertTag === tag}
                        onClick={() => { setSelectedCertTag(tag); setIsCertDropdownOpen(false); }}
                        className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                          selectedCertTag === tag
                            ? 'bg-[#f0f9fb] text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400'
                            : 'text-[#566e7a] hover:bg-slate-100 dark:text-[#EDEDED] dark:hover:bg-[#222]'
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
                aria-label="Clear filter"
                className="flex items-center gap-1 rounded-full border border-cyan-600/30 bg-[#f0f9fb] px-3 py-1.5 text-xs font-medium text-cyan-600 transition-colors hover:bg-indigo-100 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-400 dark:hover:bg-cyan-500/20"
              >
                {selectedCertTag}
                <LucideIcons.X size={12} aria-hidden="true" />
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
                  <div className="glass-panel rounded-xl group relative flex h-full cursor-pointer flex-col overflow-hidden p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-600/30 hover:shadow-cyan-600/10 dark:hover:border-cyan-500/50 dark:hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)]">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-emerald-700/5 dark:from-cyan-500/5 dark:to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="mb-4 flex items-start gap-4">
                      {cert.badgeUrl ? (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 p-2">
                          <img
                            src={cert.badgeUrl}
                            alt={cert.title}
                            width={64}
                            height={64}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-2xl">
                          🏆
                        </div>
                      )}
                      <div>
                        <h3 className="line-clamp-1 text-xl font-bold text-[#0e2a36] group-hover:text-cyan-600 dark:group-hover:text-cyan-500 dark:text-white">
                          {cert.title}
                        </h3>
                        <div className="mt-1 font-mono text-sm text-cyan-600 dark:text-cyan-400">
                          {cert.issuer}
                        </div>
                      </div>
                    </div>

                    <p className="mb-6 line-clamp-2 flex-grow text-sm text-[#566e7a] dark:text-slate-400">
                      {cert.fullName}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2">
                      {cert.tags?.slice(0, 3).map((tag, idx) => (
                        <Tag
                          key={idx}
                          className="border-none bg-slate-100 text-xs text-[#566e7a] dark:bg-slate-800 dark:text-slate-300"
                        >
                          {tag}
                        </Tag>
                      ))}
                      {cert.tags?.length > 3 && (
                        <Tag className="border-none bg-slate-100 text-xs text-[#566e7a] dark:bg-slate-800 dark:text-slate-300">
                          +{cert.tags.length - 3}
                        </Tag>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {certsLoading && (!filteredCerts || filteredCerts.length === 0) && (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-64 rounded-xl border border-slate-200 bg-slate-100/50 p-6 animate-pulse dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-4 flex items-start gap-4">
                  <div className="h-16 w-16 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
                    <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
                  <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800"></div>
                </div>
              </div>
            ))
          )}

          {!certsLoading && (!filteredCerts || filteredCerts.length === 0) && (
            <div className="col-span-full rounded-xl border border-slate-800 bg-slate-900/20 py-8 text-center text-slate-500">
              No certifications found.
            </div>
          )}
        </motion.div>
      </Reveal>
    </section>
  );
}
