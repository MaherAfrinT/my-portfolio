import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { LucideIcons } from '../../lib/icon-map';

export function UniversalFooter() {
  const { config } = useSiteConfig();

  return (
    <footer className="relative z-10 mt-auto w-full border-t border-slate-200 bg-white/80 py-12 backdrop-blur-md dark:border-[#333333] dark:bg-[#0A0A0A]/80">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          
          {/* Branding & Copyright */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h2 className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-xl font-black text-transparent">
              {config.name || 'Portfolio'}
            </h2>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Building the future, one commit at a time. Designing digital experiences that live at the intersection of technology and art.
            </p>
            <p className="mt-6 font-mono text-xs text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} {config.name}. All rights reserved.
            </p>
          </div>

          {/* Sitemap */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 font-mono text-sm font-semibold tracking-wider text-slate-900 dark:text-white uppercase">
              Sitemap
            </h3>
            <ul className="flex flex-col items-center space-y-3 text-sm text-slate-600 md:items-start dark:text-slate-400">
              <li>
                <Link to="/" className="transition-colors hover:text-cyan-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="transition-colors hover:text-cyan-500">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/blog" className="transition-colors hover:text-cyan-500">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/journal" className="transition-colors hover:text-cyan-500">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="transition-colors hover:text-purple-500">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 font-mono text-sm font-semibold tracking-wider text-slate-900 dark:text-white uppercase">
              Connect
            </h3>
            <div className="flex space-x-4">
              {(config.socialLinks || []).map((social, idx) => {
                const Icon =
                  LucideIcons[social.iconName || 'Link'] || LucideIcons.Link;
                return (
                  <a
                    key={social.id || idx}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-full bg-slate-100 p-3 text-slate-600 transition-all hover:bg-cyan-50 hover:text-cyan-600 dark:bg-dark-surface dark:text-[#EDEDED] dark:hover:bg-[#222222] dark:hover:text-[#00E5FF]"
                    aria-label={social.platform || 'Social Link'}
                  >
                    <Icon size={20} className="transition-transform group-hover:scale-110" />
                  </a>
                );
              })}
              {config.email && (
                <a
                  href={`mailto:${config.email}`}
                  className="group rounded-full bg-slate-100 p-3 text-slate-600 transition-all hover:bg-cyan-50 hover:text-cyan-600 dark:bg-dark-surface dark:text-[#EDEDED] dark:hover:bg-[#222222] dark:hover:text-[#00E5FF]"
                  aria-label="Email"
                >
                  <LucideIcons.Mail size={20} className="transition-transform group-hover:scale-110" />
                </a>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
