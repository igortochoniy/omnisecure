// An array of links for navigation bar
const navBarLinks = [
  { name: 'Home', url: '/' },
  { name: 'Features', url: '/#features' },
  { name: 'Pricing', url: '/#pricing' },
  { name: 'FAQ', url: '/#faq' },
];
// An array of links for footer
const footerLinks = [
  {
    section: 'Product',
    links: [
      { name: 'Features', url: '/#features' },
      { name: 'Pricing', url: '/#pricing' },
      { name: 'FAQ', url: '/#faq' },
    ],
  },
  {
    section: 'Company',
    links: [
      { name: 'About us', url: '#' },
      { name: 'Contact', url: '#' },
      { name: 'Careers', url: '#' },
    ],
  },
];
// An object of links for social icons
const socialLinks = {
  facebook: 'https://www.facebook.com/',
  x: 'https://twitter.com/',
  github: 'https://github.com/',
  google: 'https://www.google.com/',
  slack: 'https://slack.com/',
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};
