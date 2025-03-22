// pages/api/sitemap-latest-articles.xml.js

import { fetchLatestNews } from "@/lib/fetchLatestNews";

export default async function handler(req, res) {
  const baseUrl = "https://www.reachmalayalam.com";
  
  // Fetch the latest 20 news articles
  const latestArticles = await fetchLatestNews(50);

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${latestArticles.map((news) => `
    <url>
      <loc>${baseUrl}/${news.category}/${news.id}</loc>
      <lastmod>${new Date(news.timestamp).toISOString()}</lastmod>
      <changefreq>hourly</changefreq>
      <priority>0.9</priority>
    </url>`).join('')}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.status(200).end(sitemap);
}
