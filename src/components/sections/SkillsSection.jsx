import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcons } from '../../lib/icon-map';
import { Reveal } from '../ui/Reveal';

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

export function SkillsSection({ config }) {
  if (config.sectionVisibility?.skills === false) return null;

  return (
    <section id="skills" className="scroll-mt-24">
      <Reveal>
        <h2 className="mb-8 flex items-center font-mono text-3xl font-bold">
          <span className="mr-4 text-cyan-600 dark:text-cyan-400">
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
                <div className="glass-panel rounded-xl group relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-600/30 hover:shadow-cyan-600/10 dark:hover:border-cyan-500/50 dark:hover:shadow-[0_8px_30px_rgba(0,255,204,0.15)]">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-emerald-700/5 dark:from-cyan-500/5 dark:to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <h3 className="relative z-10 mb-6 flex items-center gap-3 border-b border-slate-200 pb-4 text-xl font-bold text-[#0e2a36] dark:border-slate-800 dark:text-white">
                    <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-cyan-600/10 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                      {skillGroup.categoryImageUrl ? (
                        <img src={skillGroup.categoryImageUrl} alt={skillGroup.category} loading="lazy" width={36} height={36} className="h-full w-full object-cover" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </span>
                    {skillGroup.category}
                  </h3>
                  <ul className="space-y-1">
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
                          className="group/item flex items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:translate-x-1 hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                          {imageUrl ? (
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 p-1.5 dark:bg-slate-800">
                              <img
                                src={imageUrl}
                                alt={name}
                                width={32}
                                height={32}
                                loading="lazy"
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display =
                                    'block';
                                }}
                              />
                              <span className="hidden h-1.5 w-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400"></span>
                            </div>
                          ) : icon ? (
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 p-1.5 dark:bg-slate-800">
                              <img
                                src={`https://cdn.simpleicons.org/${icon}/00ffcc`}
                                alt={name}
                                width={32}
                                height={32}
                                loading="lazy"
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display =
                                    'block';
                                }}
                              />
                              <span className="hidden h-1.5 w-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400"></span>
                            </div>
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 transition-colors group-hover/item:bg-blue-600 dark:group-hover/item:bg-blue-400"></span>
                            </div>
                          )}
                          <span className="text-sm font-medium font-mono text-[#163847] dark:text-slate-200">
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
  );
}
