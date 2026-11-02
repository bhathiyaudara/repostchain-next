import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Empty sitemap while site is set to noindex to prevent search engines from discovering/indexing pages
  return [];
}
