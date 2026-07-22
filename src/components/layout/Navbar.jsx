import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const { config } = useSiteConfig();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { scrollY } = useScroll();

  // Transform values based on scroll
  const headerPadding = useTransform(scrollY, [0, 100], ['1rem', '0.75rem']);
  const navWidth = useTransform(scrollY, [0, 100], ['1100px', '750px']);
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(8px)', 'blur(16px)']
  );
  const shadow = useTransform(
    scrollY,
    [0, 100],
    [
      '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    ]
  );

  const navLinks = config.navLinks || [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/career', label: 'Career' },
    { path: '/blog', label: 'Blog' },
    { path: '/journal', label: 'Journal' },
    { path: '/contact', label: 'Contact' },
    { path: '/admin', label: 'Admin' },
  ];

  return (
    <motion.header
      className="sticky top-0 z-50 w-full px-4 transition-all duration-300 sm:px-6 lg:px-8 flex justify-center"
      style={{ paddingTop: headerPadding, paddingBottom: headerPadding }}
    >
      <motion.div
        className="relative flex w-full items-center justify-between rounded-full border border-gray-200/40 px-6 py-2 dark:border-[rgba(0,229,255,0.15)] dark:shadow-[0_0_20px_rgba(0,255,204,0.05)]"
        style={{
          maxWidth: navWidth,
          backdropFilter: backdropBlur,
          boxShadow: shadow,
        }}
      >
        {/* Absolute backgrounds for light/dark mode support with framer-motion */}
        <div
          className="absolute inset-0 rounded-full dark:hidden"
          style={{
            backgroundColor: 'var(--header-bg, rgba(255, 255, 255, 0.8))',
          }}
        />
        <div
          className="absolute inset-0 hidden rounded-full dark:block"
          style={{
            backgroundColor: 'var(--header-bg-dark, rgba(10, 10, 10, 0.7))',
          }}
        />

        <Link
          to="/"
          className="relative z-10 whitespace-nowrap bg-gradient-to-r from-cyan-600 to-emerald-700 bg-clip-text text-xl font-bold text-transparent transition-all duration-500 dark:from-cyan-500 dark:to-purple-500 hover:from-emerald-700 hover:to-indigo-700 dark:hover:from-purple-500 dark:hover:to-cyan-500"
        >
          {config.name || 'Portfolio'}
        </Link>

        <nav className="relative z-10 hidden items-center space-x-1 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
                  isActive
                    ? 'text-cyan-600 dark:text-cyan-300'
                    : 'text-[#566e7a] hover:text-[#0e2a36] dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 -z-10 rounded-full bg-indigo-100 dark:bg-cyan-900/50"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
                {!isActive && (
                  <span className="absolute right-4 bottom-1 left-4 h-[2px] origin-left scale-x-0 rounded-full bg-cyan-600 transition-transform duration-300 ease-out group-hover:scale-x-100 dark:bg-cyan-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 flex items-center gap-4">
          {config.sectionVisibility?.themeToggleButton !== false && <ThemeToggle />}
          <button
            className="p-2 text-[#566e7a] md:hidden dark:text-slate-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full right-4 left-4 mt-2 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-xl md:hidden dark:border-[#333333] dark:bg-dark-surface/95"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    location.pathname === link.path
                      ? 'bg-[#f0f9fb] text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400'
                      : 'text-[#566e7a] hover:bg-slate-50 dark:text-[#EDEDED] dark:hover:bg-[#222222]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
