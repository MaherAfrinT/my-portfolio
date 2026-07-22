import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DEFAULT_SITE_CONFIG } from '../../lib/constants';
import { Button } from '../ui/Button';
import { TypewriterHeadline } from '../ui/TypewriterHeadline';
import { KineticText } from '../ui/KineticText';
import { LucideIcons } from '../../lib/icon-map';

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

export function HeroSection({ config }) {
  if (config.sectionVisibility?.hero === false) return null;

  return (
    <section className="flex flex-col items-center justify-between gap-12 md:flex-row">
      <motion.div
        className="flex-1 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={cardVariants}
          className="font-mono text-lg text-cyan-600 dark:text-cyan-400"
        >
          {config.greetingText || DEFAULT_SITE_CONFIG.greetingText}{' '}
          {config.name}.
        </motion.p>
        <motion.h1 variants={cardVariants} className="flex flex-col gap-1 min-h-[160px] md:min-h-[180px]">
          <span className="text-4xl font-extrabold tracking-tight text-[#0e2a36] md:text-6xl dark:text-white">
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
          className="max-w-xl pt-4 text-base leading-relaxed text-[#385361] md:text-lg dark:text-slate-300"
        >
          <KineticText
            text={config.tagline || DEFAULT_SITE_CONFIG.tagline}
          />
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="flex flex-wrap gap-4 pt-8"
        >
          {config.sectionVisibility?.resumeButton !== false && (
            <Button
              as="a"
              href={config.resumeUrl || '#'}
              target={config.resumeUrl ? '_blank' : '_self'}
              rel="noopener noreferrer"
              download
              size="lg"
              className="flex items-center gap-2 border-none bg-cyan-600 dark:bg-cyan-500 text-white dark:text-[#0e2a36] shadow-cyan-600/20 dark:shadow-[0_0_15px_rgba(0,255,204,0.3)] transition-transform hover:scale-105 hover:bg-[#0089a8] dark:hover:bg-cyan-600"
            >
              <LucideIcons.Download className="h-4 w-4" /> Resume
            </Button>
          )}
          <Button
            as={Link}
            to="/projects"
            size="lg"
            variant="outline"
            className="flex items-center gap-2 shadow-cyan-600/10 dark:shadow-[0_0_15px_rgba(0,255,204,0.1)] transition-transform hover:scale-105"
          >
            View Projects <LucideIcons.ArrowUpRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>

      {config.heroImageUrl && (
        <motion.div
          className="relative z-0 flex w-full max-w-md flex-1 justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative h-64 w-64 md:h-96 md:w-96">
            <div className="animate-pulse-glow absolute inset-0 rounded-full bg-cyan-600/20 blur-3xl filter dark:bg-cyan-400/10"></div>
            <img
              src={config.heroImageUrl}
              alt={config.name || 'Hero'}
              loading="lazy"
              width="384"
              height="384"
              className="relative z-10 h-full w-full rounded-full border-4 border-cyan-600/30 dark:border-cyan-500/30 object-cover shadow-cyan-600/20 dark:shadow-[0_0_30px_rgba(0,255,204,0.3)]"
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
