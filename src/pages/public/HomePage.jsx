import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { PageTransition } from '../../components/layout/PageTransition';
import { HeroSection } from '../../components/sections/HeroSection';
import { AboutSection } from '../../components/sections/AboutSection';
import { SkillsSection } from '../../components/sections/SkillsSection';
import { CertificationsSection } from '../../components/sections/CertificationsSection';
import { ManifestoSection } from '../../components/sections/ManifestoSection';
import { CTASection } from '../../components/sections/CTASection';

export function HomePage() {
  const { config } = useSiteConfig();

  return (
    <PageTransition>
      <Helmet>
        <title>{(config?.hero?.title && config?.hero?.subtitle) ? `${config.hero.title} | ${config.hero.subtitle}` : 'Shahariar Sabbir | Portfolio'}</title>
        <meta name="description" content={config?.hero?.description || 'Welcome to my portfolio'} />
      </Helmet>
      <div className="min-h-[calc(100vh-theme(spacing.16))] flex flex-col justify-center space-y-32 pb-24">
        <HeroSection config={config} />
        <AboutSection config={config} />
        <SkillsSection config={config} />
        <CertificationsSection config={config} />
        <ManifestoSection config={config} />
        <CTASection config={config} />
      </div>
    </PageTransition>
  );
}
