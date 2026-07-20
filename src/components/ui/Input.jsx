import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm transition-all duration-300 ease-in-out placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-cyan-400',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
