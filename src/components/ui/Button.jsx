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
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/20 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary:
      'bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 shadow-sm',
    secondary:
      'bg-slate-100 text-[#0e2a36] hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    outline:
      'relative overflow-hidden z-0 border border-cyan-800 text-cyan-900 before:absolute before:inset-0 before:z-[-1] before:bg-gradient-to-r before:from-blue-600 before:via-cyan-400 before:to-fuchsia-500 before:transition-transform before:duration-300 before:ease-out before:scale-y-0 before:origin-bottom hover:before:scale-y-100 hover:text-white hover:border-transparent dark:border-cyan-400 dark:text-cyan-300 dark:before:from-cyan-400 dark:before:via-fuchsia-400 dark:before:to-pink-400 dark:hover:text-[#0e2a36]',
    ghost:
      'hover:bg-slate-100 dark:hover:bg-slate-800 text-[#385361] dark:text-slate-300',
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
      className="h-5 w-5 animate-spin drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"
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
