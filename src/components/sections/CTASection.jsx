import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function CTASection({ config }) {
  if (config.sectionVisibility?.contactCTA === false) return null;

  return (
    <section id="contact" className="scroll-mt-24 pb-24">
      <Reveal>
        <div className="glass-panel rounded-3xl group relative overflow-hidden p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:border-cyan-600/30 hover:shadow-cyan-600/10 dark:hover:border-cyan-500/50 dark:hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)] md:p-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-emerald-700/5 dark:from-cyan-500/5 dark:to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="mb-6 flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="relative flex h-2 w-2">
                {config.isAvailableForWork !== false ? (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </span>
              <span className="text-xs font-medium text-[#566e7a] dark:text-slate-400">
                {config.isAvailableForWork !== false 
                  ? (config.ctaBadge || 'Available for work')
                  : 'Not available for work'}
              </span>
            </div>
            <h2 className="mb-8 max-w-2xl text-4xl font-extrabold text-[#0e2a36] md:text-6xl dark:text-white">
              {config.ctaTitle || "Let's create your next big idea."}
            </h2>
            {config.sectionVisibility?.ctaButton !== false && (
              <Button
                as={Link}
                to="/contact"
                className="rounded-full border border-slate-800 bg-transparent px-8 py-6 text-lg font-medium text-[#0e2a36] transition-all hover:bg-slate-900 hover:text-white dark:border-slate-200 dark:text-white dark:hover:bg-white dark:hover:text-[#0e2a36]"
              >
                {config.ctaButtonText || 'Contact Me'}
              </Button>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
