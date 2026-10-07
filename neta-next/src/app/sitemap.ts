import type { MetadataRoute } from 'next';

export const runtime = 'edge';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://neta.ink';

  return [
    { url: `${baseUrl}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/state-ranking`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/governance-dashboard`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/public-metrics`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/system-transparency`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/open-data.json`, changeFrequency: 'weekly', priority: 0.6 },
  ];
}
