import React from 'react';
import { Outlet } from 'react-router-dom';
import { NeonCrawler } from '../ui/NeonCrawler';
import { CursorTrail } from '../ui/CursorTrail';
import { AnimatedGridBackground } from '../ui/AnimatedGridBackground';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { Navbar } from './Navbar';
import { UniversalFooter } from './UniversalFooter';

export function PublicLayout() {
  const { config } = useSiteConfig();

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <AnimatedGridBackground />
      <CursorTrail />
      <NeonCrawler />

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <UniversalFooter />
    </div>
  );
}
