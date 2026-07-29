import ogImageSrc from '@images/social.png';

export const SITE = {
  title: 'OmniSecure Locksmith LLC',
  tagline: '24/7 Boston Locksmith',
  description:
    'OmniSecure Locksmith LLC — licensed 24/7 emergency, residential, commercial and automotive locksmith serving Boston and everywhere within a 30-mile radius. Same-day service, upfront pricing.',
  description_short:
    'Licensed 24/7 locksmith serving Boston & all of Massachusetts. Emergency lockouts, residential, automotive and commercial.',
  url: 'https://omnisecurelocksmith.com',
  author: 'OmniSecure Locksmith LLC',
};

// Verbatim contact info from the design handoff (§5). TODO: swap the placeholder
// phone/email for the client's real details before launch.
export const CONTACT = {
  phoneDisplay: '(617) 555-0134',
  phoneHref: 'tel:+16175550134',
  email: 'info@locksmith.com',
  emailHref: 'mailto:info@locksmith.com',
  areaShort: 'Greater Boston & all of MA',
  areaLong: 'Greater Boston & all of Massachusetts (30-mile radius)',
  hours: 'Open 24 hours · 7 days a week',
};

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    inLanguage: 'en-US',
    '@id': SITE.url,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: {
      '@type': 'WebSite',
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
    },
  },
};

export const OG = {
  locale: 'en_US',
  type: 'website',
  url: SITE.url,
  title: 'OmniSecure Locksmith LLC — 24/7 Boston Locksmith',
  description:
    'Day or night, your Boston locksmith is on the way. Licensed 24/7 emergency, residential, automotive and commercial locksmith services across Greater Boston & all of Massachusetts. Same-day service, upfront pricing.',
  image: ogImageSrc,
};
