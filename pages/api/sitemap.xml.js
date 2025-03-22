// pages/api/sitemap.xml.js

import { fetchLatestNews } from "@/lib/fetchLatestNews";
import { fetchCategoryNews } from "@/lib/fetchCategoryNews";
import pages from "@/components/Navbar/Categories";

export default async function handler(req, res) {
  const baseUrl = "https://www.reachmalayalam.com";
  
  // Get the current time to use as a fallback if no news articles are found
  const currentTime = new Date().toISOString();

  // Fetch the latest news for the home page
  const latestHomeNews = await fetchLatestNews(1);
  // Determine the last modified time for the home page; use current time if no articles are found
  const homeLastMod = latestHomeNews[0]?.timestamp || currentTime;

  // Fetch the latest news for each category by dynamically generating the category list
  const categories = pages.slice(1).map(page => page.english);

  // Map over the categories to fetch the latest news and determine the last modified time
  const categoryLastMods = await Promise.all(categories.map(async (category) => {
    const latestCategoryNews = await fetchCategoryNews(category, 1);
    return {
      category,
      lastMod: latestCategoryNews[0]?.timestamp || currentTime,
    };
  }));

  // Generate the XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Home page URL -->
    <url>
      <loc>${baseUrl}</loc>
      <lastmod>${new Date(homeLastMod).toISOString()}</lastmod>
      <changefreq>hourly</changefreq>
      <priority>1.0</priority>
    </url>
    <!-- Category pages URLs -->
    ${categoryLastMods.map(({ category, lastMod }) => `
    <url>
      <loc>${baseUrl}/${category}</loc>
      <lastmod>${new Date(lastMod).toISOString()}</lastmod>
      <changefreq>hourly</changefreq>
      <priority>0.8</priority>
    </url>`).join('')}
  </urlset>`;

  // Set the Content-Type to XML and return the generated sitemap
  res.setHeader("Content-Type", "text/xml");
  res.status(200).end(sitemap);
}
