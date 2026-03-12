import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/debug/', '/import/'],
      },
    ],
    sitemap: 'https://servicii-romani.de/sitemap.xml',
  };
}
