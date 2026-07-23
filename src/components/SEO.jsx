import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteConfig } from '../contexts/SiteConfigContext';

export function SEO({ 
  title, 
  description, 
  image = '/og-image.jpg', 
  url = 'https://shahariarsabbir.com',
  type = 'website'
}) {
  const { config } = useSiteConfig();
  
  const defaultTitle = (config?.hero?.title && config?.hero?.subtitle) 
    ? `${config.hero.title} | ${config.hero.subtitle}` 
    : 'Shahariar Sabbir | Portfolio';
    
  const defaultDescription = config?.hero?.description || 'Welcome to my portfolio';

  const finalTitle = title ? `${title} | Shahariar Sabbir` : defaultTitle;
  const finalDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
