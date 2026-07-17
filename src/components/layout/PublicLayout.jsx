import React from 'react';
import { Outlet } from 'react-router-dom';
import { NeonCrawler } from '../ui/NeonCrawler';
import { CursorTrail } from '../ui/CursorTrail';
import { AnimatedGridBackground } from '../ui/AnimatedGridBackground';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { Navbar } from './Navbar';

export function PublicLayout() {
  const { config } = useSiteConfig();

  return (
    <div className="flex min-h-screen flex-col font-sans selection:bg-cyan-500 selection:text-white">
      <AnimatedGridBackground />
      <CursorTrail />
      <NeonCrawler />

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="relative z-10 mt-auto w-full border-t border-slate-200 bg-white/50 py-8 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between px-4 text-center text-sm text-slate-500 sm:px-6 md:flex-row lg:px-8 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} {config.name}. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            {config.socials?.github && (
              <a
                href={config.socials.github}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-cyan-500"
              >
                GitHub
              </a>
            )}
            {config.socials?.linkedin && (
              <a
                href={config.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-cyan-500"
              >
                LinkedIn
              </a>
            )}
            {config.socials?.twitter && (
              <a
                href={config.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-cyan-500"
              >
                Twitter
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
