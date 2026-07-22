import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'group overflow-hidden rounded-xl bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 shadow-md transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl dark:hover:border-[#00E5FF]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardImage({ src, alt, className }) {
  return (
    <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-dark-surface">
      {src ? (
        <img
          src={src}
          alt={alt}
          width={400}
          height={192}
          loading="lazy"
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
