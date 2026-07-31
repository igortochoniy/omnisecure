import ogImageSrc from '@images/social.png';

export const SITE = {
  title: 'OmniSecure Locksmith LLC',
  tagline: 'Same-Day Boston Locksmith',
  description:
    'OmniSecure Locksmith LLC. Insured emergency, residential, commercial and automotive locksmith serving Boston and the surrounding 30-mile area. Same-day service, upfront pricing.',
  description_short:
    'Insured locksmith serving Boston and the surrounding 30-mile area. Emergency lockouts, residential, automotive and commercial.',
  url: 'https://omnisecurelocksmith.com',
  author: 'OmniSecure Locksmith LLC',
};

// Verbatim contact info from the design handoff (§5). TODO: swap the placeholder
// phone/email for the client's real details before launch.
export const CONTACT = {
  phoneDisplay: '(617) 555-0134',
  phoneHref: 'tel:+16175550134',
  email: 'support@omnisecurelocksmith.com',
  emailHref: 'mailto:support@omnisecurelocksmith.com',
  areaShort: 'Boston + 30-mile area',
  areaLong: 'Boston and the surrounding 30-mile area',
  hours: 'Mon–Sat 8 AM – 10 PM · Sun closed',
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
  title: 'OmniSecure Locksmith LLC · Same-Day Boston Locksmith',
  description:
    'Your Boston locksmith is on the way, fast. Insured emergency, residential, automotive and commercial locksmith services across Boston and the surrounding 30-mile area. Same-day service, upfront pricing.',
  image: ogImageSrc,
};
