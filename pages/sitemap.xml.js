// pages/sitemap.xml.js

import pages from "@/components/Navbar/Categories";

const BASE_URL = 'https://www.reachmalayalam.com';

function generateSiteMap() {
  const staticPages = [
    { url: BASE_URL, changefreq: 'daily', priority: 1.0 },
    ...pages.slice(1).map(page => ({
      url: `${BASE_URL}/${page.english}`,
      changefreq: 'daily',
      priority: 0.8
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map(({ url, changefreq, priority }) => {
        return `
          <url>
            <loc>${url}</loc>
            <changefreq>${changefreq}</changefreq>
            <priority>${priority}</priority>
          </url>
        `;
      })
      .join('')}
  </urlset>`;
}

export function getServerSideProps({ res }) {
  const sitemap = generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  // The component isn't used, but Next.js needs it.
  return null;
}
