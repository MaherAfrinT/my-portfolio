import React from 'react';
import { cn } from '../../lib/utils';

export function Tag({ children, className }) {
  return (
    <span
      className={cn(
        'font-mono inline-flex items-center rounded-full border border-cyan-200 bg-cyan-100 px-2.5 py-0.5 text-xs font-medium text-cyan-800 dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
        className
      )}
    >
      {children}
    </span>
  );
}
