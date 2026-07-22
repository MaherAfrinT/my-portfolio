import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DEFAULT_SITE_CONFIG } from '../../lib/constants';
import { Reveal } from '../ui/Reveal';

export function ManifestoSection({ config }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "100px" });

  if (config.sectionVisibility?.manifesto === false) return null;

  return (
    <section id="manifesto" className="scroll-mt-24 pb-24" ref={ref}>
      <Reveal>
        <div className="relative w-full rounded-3xl bg-black py-24 px-8 overflow-hidden shadow-2xl flex items-center justify-center min-h-[500px]">
          {/* Subtle dark mesh/grain background */}
          <div 
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
          ></div>
          
          <div className="relative z-10 w-full max-w-6xl mx-auto text-center">
            <motion.div
              animate={isInView ? { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] } : { backgroundPosition: '0% 50%' }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="inline-block pb-4"
              style={{
                backgroundImage: 'linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff, #00ffcc, #ff00ff)',
                backgroundSize: '400% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-tight drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                {Array.isArray(config.manifesto) && config.manifesto.length > 0
                  ? config.manifesto.map(item => typeof item === 'string' ? item : (item.title || item.desc || '')).join(' ')
                  : typeof config.manifesto === 'string' && config.manifesto 
                    ? config.manifesto 
                    : DEFAULT_SITE_CONFIG.manifesto}
              </h2>
            </motion.div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
