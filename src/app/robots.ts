import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://growmusicians.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/plan',
          '/features',
          '/faq',
          '/terms-and-conditions',
          '/privacy-policy',
          '/refund-policy',
          '/contact-us',
          '/help',
        ],
        disallow: ['/api/', '/admin/', '/user/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
