import React from 'react';
import { cn } from '../../lib/utils';

export function Tag({ children, className }) {
  return (
    <span
      className={cn(
        'font-mono inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        className
      )}
    >
      {children}
    </span>
  );
}
