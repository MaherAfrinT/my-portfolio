import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export function Card({ children, className, ...props }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:border-[#333333] dark:bg-dark-surface dark:shadow-none dark:hover:border-[#00E5FF] dark:hover:shadow-[0_8px_20px_rgba(0,229,255,0.15)]',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardImage({ src, alt, className }) {
  return (
    <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-dark-surface">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
            className
          )}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-400">
          No Image
        </div>
      )}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}
