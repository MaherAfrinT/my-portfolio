import React from 'react';
import { motion } from 'framer-motion';

export function KineticText({ text = '', className = '' }) {
  const letters = text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 12, stiffness: 200 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
      filter: 'blur(5px)',
      transition: { type: 'spring', damping: 12, stiffness: 200 },
    },
  };

  return (
    <motion.div
      key={text}
      className={`flex flex-wrap justify-center md:justify-start ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block bg-gradient-to-r from-blue-600 via-cyan-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-sm dark:from-cyan-400 dark:via-fuchsia-400 dark:to-pink-400"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
}
