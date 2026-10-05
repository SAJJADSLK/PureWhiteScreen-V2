/**
 * SEO Optimization
 * Handles dynamic page generation, metadata, structured data, and landing pages
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  name?: string;
  description?: string;
  url?: string;
  image?: string;
  author?: {
    '@type': string;
    name: string;
  };
  datePublished?: string;
  dateModified?: string;
  [key: string]: unknown;
}

export interface LandingPageConfig {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  content: string;
  features: string[];
  cta: string;
  ctaUrl: string;
  image?: string;
  metadata: SEOMetadata;
}

export interface ToolLandingPage {
  toolName: string;
  toolSlug: string;
  description: string;
  benefits: string[];
  useCases: string[];
  features: string[];
  keywords: string[];
  metadata: SEOMetadata;
}

/**
 * Generate SEO metadata
 */
export function generateSEOMetadata(
  title: string,
  description: string,
  keywords: string[],
  url?: string,
  image?: string
): SEOMetadata {
  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogUrl: url,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    canonicalUrl: url,
    robots: 'index, follow',
    author: 'Pure White Screen',
    publishedDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
  };
}

/**
 * Update page metadata
 */
export function updatePageMetadata(metadata: SEOMetadata): void {
  // Update title
  document.title = metadata.title;

  // Update or create meta tags
  updateMetaTag('description', metadata.description);
  updateMetaTag('keywords', metadata.keywords.join(', '));
  updateMetaTag('author', metadata.author || 'Pure White Screen');
  updateMetaTag('robots', metadata.robots || 'index, follow');

  // Open Graph
  updateMetaTag('og:title', metadata.ogTitle || metadata.title, 'property');
  updateMetaTag('og:description', metadata.ogDescription || metadata.description, 'property');
  if (metadata.ogImage) {
    updateMetaTag('og:image', metadata.ogImage, 'property');
  }
  if (metadata.ogUrl) {
    updateMetaTag('og:url', metadata.ogUrl, 'property');
  }

  // Twitter Card
  updateMetaTag('twitter:card', metadata.twitterCard || 'summary_large_image');
  updateMetaTag('twitter:title', metadata.twitterTitle || metadata.title);
  updateMetaTag('twitter:description', metadata.twitterDescription || metadata.description);
  if (metadata.twitterImage) {
    updateMetaTag('twitter:image', metadata.twitterImage);
  }

  // Canonical URL + og:url always follow the current path
  const url = metadata.canonicalUrl || `${window.location.origin === 'null' ? '' : 'https://www.purewhitescreen.online'}${window.location.pathname.replace(/\/$/, '') || '/'}`;
  updateCanonicalLink(url);
  updateMetaTag('og:url', metadata.ogUrl || url, 'property');
}

/**
 * Update or create meta tag
 */
function updateMetaTag(
  name: string,
  content: string,
  attribute: 'name' | 'property' = 'name'
): void {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  tag.content = content;
}

/**
 * Update canonical link
 */
function updateCanonicalLink(url: string): void {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = url;
}

/**
 * Generate structured data (JSON-LD)
 */
export function generateStructuredData(data: StructuredData): string {
  return JSON.stringify(data);
}

/**
 * Add structured data to page
 */
export function addStructuredData(data: StructuredData): void {
  // replace (not append) so navigating between tools doesn't pile up duplicate JSON-LD
  document.querySelectorAll('script[data-pws-ld]').forEach((n) => n.remove());
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.pwsLd = '1';
  script.textContent = generateStructuredData(data);
  document.head.appendChild(script);
}

/**
 * Generate tool landing page config
 */
export function generateToolLandingPageConfig(
  toolName: string,
  toolSlug: string,
  description: string
): ToolLandingPage {
  const keywords = [
    toolName,
    `${toolName} tool`,
    `online ${toolName}`,
    `free ${toolName}`,
    `${toolName} converter`,
    `${toolName} editor`,
  ];

  return {
    toolName,
    toolSlug,
    description,
    benefits: [
      'Fast and efficient processing',
      'No installation required',
      'Free to use',
      'Privacy-focused',
      'High-quality output',
    ],
    useCases: [
      'Professional use',
      'Personal projects',
      'Batch processing',
      'Quick conversions',
      'Learning and experimentation',
    ],
    features: [
      'Advanced algorithms',
      'Real-time preview',
      'Batch operations',
      'Cloud storage',
      'History tracking',
    ],
    keywords,
    metadata: generateSEOMetadata(
      `Free ${toolName} - Online ${toolName} Tool | Pure White Screen`,
      `${description}. Fast, free, and easy to use. No installation required.`,
      keywords,
      `https://www.purewhitescreen.online/tools/${toolSlug}`,
      `https://www.purewhitescreen.online/images/${toolSlug}.png`
    ),
  };
}

/**
 * Generate landing page config
 */
export function generateLandingPageConfig(
  slug: string,
  title: string,
  description: string,
  keywords: string[]
): LandingPageConfig {
  return {
    slug,
    title,
    description,
    keywords,
    content: `${description}\n\nPure White Screen provides powerful tools for image processing and optimization.`,
    features: [
      'Fast processing',
      'High quality',
      'Easy to use',
      'Free to use',
      'No registration required',
    ],
    cta: 'Get Started Now',
    ctaUrl: `/tools/${slug}`,
    metadata: generateSEOMetadata(title, description, keywords, `https://www.purewhitescreen.online/${slug}`),
  };
}

/**
 * Generate dynamic page title
 */
export function generatePageTitle(
  toolName: string,
  action: string = 'Convert'
): string {
  return `${action} ${toolName} - Free Online Tool | Pure White Screen`;
}

/**
 * Generate dynamic page description
 */
export function generatePageDescription(
  toolName: string,
  action: string = 'Convert'
): string {
  return `${action} ${toolName} online for free. Fast, easy, and secure. No installation required.`;
}

/**
 * Generate keywords for tool
 */
export function generateKeywords(toolName: string, action: string = 'convert'): string[] {
  return [
    toolName,
    `${action} ${toolName}`,
    `${toolName} ${action}er`,
    `online ${toolName} ${action}`,
    `free ${toolName} ${action}`,
    `${toolName} to ${action}`,
    `${action} to ${toolName}`,
    `${toolName} tool`,
    `${toolName} online`,
    `free ${toolName} online`,
  ];
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate organization schema
 */
export function generateOrganizationSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pure White Screen',
    url: 'https://www.purewhitescreen.online',
    description: 'Next-Gen Screen Utility Platform',
    sameAs: [
      'https://twitter.com/purewhitescreen',
      'https://github.com/purewhitescreen',
      'https://discord.gg/purewhitescreen',
    ],
  };
}

/**
 * Generate product schema
 */
export function generateProductSchema(
  name: string,
  description: string,
  rating: number = 4.8,
  reviewCount: number = 150
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}

/**
 * Generate article schema
 */
export function generateArticleSchema(
  title: string,
  description: string,
  author: string = 'Pure White Screen',
  datePublished: string = new Date().toISOString()
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
    dateModified: new Date().toISOString(),
  };
}

/**
 * Get long-tail keywords for tool
 */
export function getLongTailKeywords(toolName: string): string[] {
  const prefixes = ['how to', 'best', 'free', 'online', 'fast', 'easy'];
  const suffixes = ['tool', 'converter', 'editor', 'online', 'free', 'fast'];

  const keywords: string[] = [];

  for (const prefix of prefixes) {
    for (const suffix of suffixes) {
      keywords.push(`${prefix} ${toolName} ${suffix}`);
    }
  }

  return keywords;
}

/**
 * Generate sitemap entry
 */
export function generateSitemapEntry(
  url: string,
  priority: number = 0.8,
  changeFreq: string = 'weekly'
): string {
  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: https://www.purewhitescreen.online/sitemap.xml`;
}

/**
 * Get meta tags for sharing
 */
export function getShareMetaTags(metadata: SEOMetadata): Record<string, string> {
  return {
    'og:title': metadata.ogTitle || metadata.title,
    'og:description': metadata.ogDescription || metadata.description,
    'og:image': metadata.ogImage || '',
    'og:url': metadata.ogUrl || '',
    'twitter:title': metadata.twitterTitle || metadata.title,
    'twitter:description': metadata.twitterDescription || metadata.description,
    'twitter:image': metadata.twitterImage || '',
  };
}

/**
 * Format URL for SEO
 */
export function formatSEOUrl(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return formatSEOUrl(title);
}

/**
 * Check SEO score
 */
export function checkSEOScore(metadata: SEOMetadata): number {
  let score = 0;

  // Title (max 20 points)
  if (metadata.title && metadata.title.length > 30 && metadata.title.length < 60) {
    score += 20;
  } else if (metadata.title) {
    score += 10;
  }

  // Description (max 20 points)
  if (
    metadata.description &&
    metadata.description.length > 120 &&
    metadata.description.length < 160
  ) {
    score += 20;
  } else if (metadata.description) {
    score += 10;
  }

  // Keywords (max 20 points)
  if (metadata.keywords && metadata.keywords.length >= 5) {
    score += 20;
  } else if (metadata.keywords && metadata.keywords.length > 0) {
    score += 10;
  }

  // Open Graph (max 20 points)
  if (metadata.ogTitle && metadata.ogDescription && metadata.ogImage) {
    score += 20;
  } else if (metadata.ogTitle || metadata.ogDescription) {
    score += 10;
  }

  // Canonical URL (max 10 points)
  if (metadata.canonicalUrl) {
    score += 10;
  }

  // Twitter Card (max 10 points)
  if (metadata.twitterCard && metadata.twitterTitle && metadata.twitterDescription) {
    score += 10;
  }

  return Math.min(100, score);
}
