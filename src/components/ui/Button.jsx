import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading,
  as: Component,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary:
      'bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 shadow-sm',
    secondary:
      'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    outline:
      'border border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:border-cyan-500 dark:text-cyan-400 dark:hover:bg-cyan-950/30',
    ghost:
      'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
    danger:
      'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-8 text-lg',
    icon: 'h-10 w-10',
  };

  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  const loadingSpinner = isLoading ? (
    <img
      src="/src/assets/parrotsec-logo.svg"
      alt="Loading"
      className="mr-2 -ml-1 h-5 w-5 animate-spin drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"
    />
  ) : null;

  if (Component) {
    return (
      <Component className={classes} {...props}>
        {loadingSpinner}
        {children}
      </Component>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={classes}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {loadingSpinner}
      {children}
    </motion.button>
  );
}
