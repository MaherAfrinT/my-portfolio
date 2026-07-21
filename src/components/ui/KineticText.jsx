import React from 'react';
import { motion } from 'framer-motion';

export function KineticText({ text = '', className = '' }) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 14, stiffness: 150 },
    },
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: { type: 'spring', damping: 14, stiffness: 150 },
    },
  };

  return (
    <motion.div
      key={text}
      className={`flex flex-wrap justify-center gap-x-1.5 md:justify-start ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block bg-gradient-to-r from-blue-600 via-cyan-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-sm dark:from-cyan-400 dark:via-fuchsia-400 dark:to-pink-400"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
