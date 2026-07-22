import React from 'react';
import { motion } from 'framer-motion';
import { DEFAULT_SITE_CONFIG } from '../../lib/constants';
import { Reveal } from '../ui/Reveal';

export function AboutSection({ config }) {
  if (config.sectionVisibility?.about === false) return null;

  return (
    <section id="about" className="scroll-mt-24">
      <Reveal>
        <h2 className="mb-8 flex items-center font-mono text-3xl font-bold">
          <span className="mr-4 text-cyan-600 dark:text-cyan-400">
            01.
          </span>{' '}
          About Me
        </h2>
        <div className="flex flex-col items-start gap-8 md:flex-row">
          <div className="glass-panel rounded-xl group relative w-full flex-1 overflow-hidden p-8 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-600/30 hover:shadow-cyan-600/10 dark:hover:border-cyan-500/50 dark:hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-emerald-700/5 dark:from-cyan-500/5 dark:to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <p className="relative z-10 text-lg leading-relaxed whitespace-pre-wrap text-[#385361] dark:text-slate-300">
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
                width={400}
                height={400}
                loading="lazy"
                className="h-auto w-full rounded-2xl border-2 border-cyan-600/20 dark:border-cyan-500/20 object-cover shadow-xl shadow-cyan-600/20 dark:shadow-[0_0_20px_rgba(0,255,204,0.15)]"
              />
            </motion.div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
