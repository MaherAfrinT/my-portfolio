import React from 'react';
import { motion } from 'framer-motion';

export function TechMarquee({ items = [], speed = 40 }) {
  // If no items, provide some defaults
  const defaultItems = [
    { name: 'React', icon: 'react' },
    { name: 'Next.js', icon: 'nextdotjs' },
    { name: 'Tailwind CSS', icon: 'tailwindcss' },
    { name: 'Node.js', icon: 'nodedotjs' },
    { name: 'Firebase', icon: 'firebase' },
    { name: 'Framer', icon: 'framer' },
    { name: 'JavaScript', icon: 'javascript' },
    { name: 'TypeScript', icon: 'typescript' },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  // Duplicate items to ensure smooth infinite scrolling
  const duplicatedItems = [...displayItems, ...displayItems, ...displayItems];

  return (
    <div className="group relative flex w-full overflow-hidden py-8">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-900" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-900" />

      <motion.div
        className="flex shrink-0 items-center space-x-12 px-6"
        animate={{
          x: ['0%', '-33.33%'], // Since we tripled the array, moving 1/3 is one full cycle
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
        whileHover={{ animationPlayState: 'paused' }}
        style={{ width: 'max-content' }}
      >
        {duplicatedItems.map((item, index) => {
          // Fallback if item is just a string, or an object { name, icon }
          const name = typeof item === 'string' ? item : item.name;
          const iconSlug =
            typeof item === 'string'
              ? item.toLowerCase().replace(/\s+/g, '')
              : item.icon || name.toLowerCase().replace(/\s+/g, '');

          return (
            <div
              key={`${name}-${index}`}
              className="flex flex-col items-center gap-3 opacity-60 grayscale transition-all duration-300 hover:-translate-y-1 hover:opacity-100 hover:grayscale-0"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={name}
                  className="h-12 w-12 object-contain md:h-16 md:w-16"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <img
                  src={`https://cdn.simpleicons.org/${iconSlug}`}
                  alt={name}
                  className="h-12 w-12 object-contain md:h-16 md:w-16"
                  onError={(e) => {
                    // Fallback if icon isn't found
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              )}
              <div className="hidden h-12 w-12 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-500 md:h-16 md:w-16 dark:bg-slate-800">
                {name.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-[#566e7a] dark:text-slate-400">
                {name}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
