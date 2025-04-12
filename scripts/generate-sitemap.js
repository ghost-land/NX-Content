import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://nx-content.ghostland.at';
const PUBLIC_DIR = './dist';

// Get current date in YYYY-MM-DD format
const getFormattedDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Generate sitemap content
const generateSitemap = () => {
  const urls = [
    {
      url: '/',
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/404.html',
      changefreq: 'yearly',
      priority: '0.1'
    }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, changefreq, priority }) => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${getFormattedDate()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Ensure the public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Write sitemap to file
const sitemap = generateSitemap();
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);

console.log('✓ Sitemap generated successfully');