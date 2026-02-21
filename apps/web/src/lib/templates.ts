import type { TemplateDefinition, ThemeSettings, PortfolioDocument, PageDocument } from '@/types';
import { defaultTheme } from './publish-api';

function uid(): string {
  return crypto.randomUUID();
}

// ── Portfolio Templates ─────────────────────────────────────────────
const minimalTheme: ThemeSettings = {
  ...defaultTheme,
  fontFamily: 'system-ui, sans-serif',
  bgColor: '#fafafa',
  textColor: '#1a1a1a',
  accentColor: '#404040',
  buttonRadius: 4,
  buttonStyle: 'outline',
  sectionPadding: 'spacious',
};

const boldTheme: ThemeSettings = {
  ...defaultTheme,
  fontFamily: 'Georgia, serif',
  bgColor: '#0a0a0a',
  textColor: '#e5e5e5',
  accentColor: '#f97316',
  buttonRadius: 0,
  buttonStyle: 'solid',
  sectionPadding: 'spacious',
};

const galleryTheme: ThemeSettings = {
  ...defaultTheme,
  fontFamily: 'system-ui, sans-serif',
  bgColor: '#ffffff',
  textColor: '#374151',
  accentColor: '#6366f1',
  buttonRadius: 999,
  buttonStyle: 'solid',
  sectionPadding: 'normal',
};

function makePortfolioData(name: string, pages: PortfolioDocument['pages']): PortfolioDocument {
  return {
    id: uid(),
    name,
    pages,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    published: false,
  };
}

const minimalPortfolio: TemplateDefinition = {
  id: 'tpl-portfolio-minimal',
  name: 'Minimal',
  description: 'Clean, whitespace-heavy layout for a refined look.',
  type: 'portfolio',
  variant: 'minimal',
  thumbnail: '/placeholder.svg?height=200&width=320',
  theme: minimalTheme,
  data: makePortfolioData('Minimal Portfolio', [
    {
      id: uid(),
      title: 'Home',
      sections: [
        { id: uid(), type: 'hero', content: { heading: 'Hello, I\'m a Designer', subheading: 'Crafting digital experiences with care and precision.' } },
        { id: uid(), type: 'text', content: { body: 'I focus on creating minimal, functional designs that prioritize user experience. With over 5 years of experience, I help brands communicate their story through clean visual language.' } },
        { id: uid(), type: 'cta', content: { heading: 'Want to collaborate?', buttonText: 'Get in Touch', buttonUrl: '#contact' } },
      ],
    },
    {
      id: uid(),
      title: 'Work',
      sections: [
        { id: uid(), type: 'hero', content: { heading: 'Selected Work', subheading: 'A curated selection of recent projects.' } },
        { id: uid(), type: 'gallery', content: { images: [], columns: 2 } },
      ],
    },
    {
      id: uid(),
      title: 'About',
      sections: [
        { id: uid(), type: 'text', content: { body: 'I\'m a designer based in San Francisco. I believe in the power of simplicity and strive to create experiences that are both beautiful and functional.' } },
        { id: uid(), type: 'columns', content: { items: [{ title: 'Education', body: 'BA Design, RISD' }, { title: 'Experience', body: '5+ years in product design' }, { title: 'Interests', body: 'Typography, photography' }] } },
      ],
    },
  ]),
};

const boldPortfolio: TemplateDefinition = {
  id: 'tpl-portfolio-bold',
  name: 'Bold',
  description: 'High-contrast dark theme with strong typography.',
  type: 'portfolio',
  variant: 'bold',
  thumbnail: '/placeholder.svg?height=200&width=320',
  theme: boldTheme,
  data: makePortfolioData('Bold Portfolio', [
    {
      id: uid(),
      title: 'Home',
      sections: [
        { id: uid(), type: 'hero', content: { heading: 'MAKE IT BOLD', subheading: 'Creative direction & brand strategy for fearless companies.' } },
        { id: uid(), type: 'columns', content: { items: [{ title: 'Brand Strategy', body: 'Define your voice and visual identity.' }, { title: 'Creative Direction', body: 'Lead projects from concept to completion.' }, { title: 'Design Systems', body: 'Build scalable, consistent design systems.' }] } },
        { id: uid(), type: 'cta', content: { heading: 'Let\'s build something great.', buttonText: 'Start a Project', buttonUrl: '#' } },
      ],
    },
    {
      id: uid(),
      title: 'Projects',
      sections: [
        { id: uid(), type: 'hero', content: { heading: 'PROJECTS', subheading: '' } },
        { id: uid(), type: 'gallery', content: { images: [], columns: 3 } },
      ],
    },
  ]),
};

const galleryPortfolio: TemplateDefinition = {
  id: 'tpl-portfolio-gallery',
  name: 'Gallery',
  description: 'Image-forward layout perfect for visual portfolios.',
  type: 'portfolio',
  variant: 'gallery',
  thumbnail: '/placeholder.svg?height=200&width=320',
  theme: galleryTheme,
  data: makePortfolioData('Gallery Portfolio', [
    {
      id: uid(),
      title: 'Gallery',
      sections: [
        { id: uid(), type: 'hero', content: { heading: 'Visual Portfolio', subheading: 'Photography, illustration, and digital art.' } },
        { id: uid(), type: 'gallery', content: { images: [], columns: 3 } },
        { id: uid(), type: 'text', content: { body: 'Each piece tells a story. Browse through my collection and reach out if you\'d like to commission work.' } },
      ],
    },
    {
      id: uid(),
      title: 'Contact',
      sections: [
        { id: uid(), type: 'cta', content: { heading: 'Interested in working together?', buttonText: 'Send a Message', buttonUrl: '#' } },
      ],
    },
  ]),
};

// ── Page Templates ──────────────────────────────────────────────────
const landingTheme: ThemeSettings = {
  ...defaultTheme,
  fontFamily: 'system-ui, sans-serif',
  bgColor: '#ffffff',
  textColor: '#111827',
  accentColor: '#2563eb',
  buttonRadius: 8,
  buttonStyle: 'solid',
  sectionPadding: 'spacious',
};

const aboutTheme: ThemeSettings = {
  ...defaultTheme,
  fontFamily: 'Georgia, serif',
  bgColor: '#f9fafb',
  textColor: '#1f2937',
  accentColor: '#059669',
  buttonRadius: 6,
  buttonStyle: 'outline',
  sectionPadding: 'normal',
};

const linkInBioTheme: ThemeSettings = {
  ...defaultTheme,
  fontFamily: 'system-ui, sans-serif',
  bgColor: '#18181b',
  textColor: '#f4f4f5',
  accentColor: '#a78bfa',
  buttonRadius: 999,
  buttonStyle: 'outline',
  sectionPadding: 'compact',
};

function makePageData(name: string, slug: string, tree: PageDocument['tree']): PageDocument {
  return {
    id: uid(),
    name,
    slug,
    tree,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    published: false,
  };
}

const landingPage: TemplateDefinition = {
  id: 'tpl-page-landing',
  name: 'Landing Page',
  description: 'Product-focused landing page with hero, features, and CTA.',
  type: 'page',
  variant: 'landing',
  thumbnail: '/placeholder.svg?height=200&width=320',
  theme: landingTheme,
  data: makePageData('Landing Page', 'landing', [
    {
      id: uid(), type: 'row', style: { padding: '80px 24px', textAlign: 'center' },
      columns: [{
        id: uid(), type: 'column', width: '100%', style: {},
        children: [
          { id: uid(), type: 'text', props: { content: 'Build faster, ship smarter.' }, style: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' } },
          { id: uid(), type: 'text', props: { content: 'The all-in-one platform for modern teams. Get started in minutes.' }, style: { fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto 24px' } },
          { id: uid(), type: 'button', props: { label: 'Get Started Free', url: '#', variant: 'primary' }, style: {} },
        ],
      }],
    },
    {
      id: uid(), type: 'row', style: { padding: '60px 24px' },
      columns: [
        { id: uid(), type: 'column', width: '33%', style: { padding: '0 12px' }, children: [
          { id: uid(), type: 'text', props: { content: 'Lightning Fast' }, style: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' } },
          { id: uid(), type: 'text', props: { content: 'Optimized for speed from the ground up. Your users will notice.' }, style: { fontSize: '0.875rem', color: '#6b7280' } },
        ]},
        { id: uid(), type: 'column', width: '33%', style: { padding: '0 12px' }, children: [
          { id: uid(), type: 'text', props: { content: 'Secure by Default' }, style: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' } },
          { id: uid(), type: 'text', props: { content: 'Enterprise-grade security baked into every layer.' }, style: { fontSize: '0.875rem', color: '#6b7280' } },
        ]},
        { id: uid(), type: 'column', width: '33%', style: { padding: '0 12px' }, children: [
          { id: uid(), type: 'text', props: { content: 'Scale Easily' }, style: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' } },
          { id: uid(), type: 'text', props: { content: 'From prototype to production with zero config changes.' }, style: { fontSize: '0.875rem', color: '#6b7280' } },
        ]},
      ],
    },
    {
      id: uid(), type: 'row', style: { padding: '60px 24px', textAlign: 'center' },
      columns: [{
        id: uid(), type: 'column', width: '100%', style: {},
        children: [
          { id: uid(), type: 'text', props: { content: 'Ready to get started?' }, style: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' } },
          { id: uid(), type: 'button', props: { label: 'Start Building', url: '#', variant: 'primary' }, style: {} },
        ],
      }],
    },
  ]),
};

const aboutPage: TemplateDefinition = {
  id: 'tpl-page-about',
  name: 'About Page',
  description: 'Personal about page with bio, skills, and contact.',
  type: 'page',
  variant: 'about',
  thumbnail: '/placeholder.svg?height=200&width=320',
  theme: aboutTheme,
  data: makePageData('About Me', 'about-me', [
    {
      id: uid(), type: 'row', style: { padding: '60px 24px' },
      columns: [
        { id: uid(), type: 'column', width: '40%', style: { padding: '0 16px' }, children: [
          { id: uid(), type: 'image', props: { src: '/placeholder.svg?height=400&width=400', alt: 'Profile photo' }, style: { borderRadius: '12px' } },
        ]},
        { id: uid(), type: 'column', width: '60%', style: { padding: '0 16px' }, children: [
          { id: uid(), type: 'text', props: { content: 'About Me' }, style: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' } },
          { id: uid(), type: 'text', props: { content: 'Hi, I\'m Alex. I\'m a designer and developer passionate about creating beautiful, functional digital experiences. I\'ve been building for the web for over 8 years.' }, style: { fontSize: '1rem', lineHeight: '1.7', marginBottom: '16px' } },
          { id: uid(), type: 'text', props: { content: 'When I\'m not coding, you\'ll find me hiking, reading, or experimenting with new recipes.' }, style: { fontSize: '1rem', lineHeight: '1.7', color: '#6b7280' } },
        ]},
      ],
    },
    {
      id: uid(), type: 'row', style: { padding: '40px 24px', textAlign: 'center' },
      columns: [{
        id: uid(), type: 'column', width: '100%', style: {},
        children: [
          { id: uid(), type: 'divider', props: { thickness: '1px', color: '#e5e7eb' }, style: { marginBottom: '40px' } },
          { id: uid(), type: 'text', props: { content: 'Let\'s connect' }, style: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' } },
          { id: uid(), type: 'link', props: { text: 'alex@example.com', url: 'mailto:alex@example.com' }, style: {} },
        ],
      }],
    },
  ]),
};

const linkInBioPage: TemplateDefinition = {
  id: 'tpl-page-linkinbio',
  name: 'Link in Bio',
  description: 'Social link hub with centered layout and link buttons.',
  type: 'page',
  variant: 'link-in-bio',
  thumbnail: '/placeholder.svg?height=200&width=320',
  theme: linkInBioTheme,
  data: makePageData('My Links', 'my-links', [
    {
      id: uid(), type: 'row', style: { padding: '60px 24px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' },
      columns: [{
        id: uid(), type: 'column', width: '100%', style: {},
        children: [
          { id: uid(), type: 'image', props: { src: '/placeholder.svg?height=100&width=100', alt: 'Avatar' }, style: { borderRadius: '50%', width: '100px', height: '100px', margin: '0 auto 16px' } },
          { id: uid(), type: 'text', props: { content: '@yourname' }, style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '4px' } },
          { id: uid(), type: 'text', props: { content: 'Creator, designer, dreamer.' }, style: { fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '32px' } },
          { id: uid(), type: 'button', props: { label: 'My Website', url: '#', variant: 'outline' }, style: { width: '100%', marginBottom: '12px' } },
          { id: uid(), type: 'button', props: { label: 'YouTube Channel', url: '#', variant: 'outline' }, style: { width: '100%', marginBottom: '12px' } },
          { id: uid(), type: 'button', props: { label: 'Twitter / X', url: '#', variant: 'outline' }, style: { width: '100%', marginBottom: '12px' } },
          { id: uid(), type: 'button', props: { label: 'Shop My Merch', url: '#', variant: 'outline' }, style: { width: '100%', marginBottom: '12px' } },
          { id: uid(), type: 'spacer', props: { height: '20px' }, style: {} },
        ],
      }],
    },
  ]),
};

// ── Exports ─────────────────────────────────────────────────────────
export const portfolioTemplates: TemplateDefinition[] = [
  minimalPortfolio,
  boldPortfolio,
  galleryPortfolio,
];

export const pageTemplates: TemplateDefinition[] = [
  landingPage,
  aboutPage,
  linkInBioPage,
];

export const allTemplates: TemplateDefinition[] = [
  ...portfolioTemplates,
  ...pageTemplates,
];
