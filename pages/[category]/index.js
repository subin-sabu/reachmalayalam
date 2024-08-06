// pages/[category]/index.js

import Head from "next/head";
import styles from "@/styles/Home.module.css";
import CategoryPage from "@/components/Pages/CategoryPage";
import pages from "@/components/Navbar/Categories";
import { fetchCategoryNews } from "@/lib/fetchCategoryNews";



export default function Category({ InitialNews, category }) {
  const latestNews = InitialNews[0];

  return (
    <>
      <Head>
        <title>{category} - Reach Malayalam</title>
        <meta name="description" content={`Get the latest ${category} news at reachmalayalam.com. Stay informed with breaking news, in-depth analysis, and exclusive reports.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${category} - Reach Malayalam`} />
        <meta property="og:description" content={`Get the latest ${category} news at reachmalayalam.com. Stay informed with breaking news, in-depth analysis, and exclusive reports.`} />
        <meta property="og:url" content={`https://www.reachmalayalam.com/${category}`} />
        <meta property="og:image" content={latestNews?.imageUrl || `https://reachmalayalam.com/logo512.png`} />
        <meta property="og:image:alt" content={latestNews?.title || "Reach Malayalam"} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${category} - Reach Malayalam`} />
        <meta name="twitter:description" content={`Get the latest ${category} news at reachmalayalam.com. Stay informed with breaking news, in-depth analysis, and exclusive reports.`} />
        <meta name="twitter:image" content={latestNews?.imageUrl || `https://reachmalayalam.com/logo512.png`} />
        <meta name="twitter:image:alt" content={latestNews?.title || "Reach Malayalam"} />

        {/* Canonical URL */}
        <link rel="canonical" href={`https://www.reachmalayalam.com/${category}`} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${category} - Reach Malayalam`,
            "url": `https://www.reachmalayalam.com/${category}`,
            "description": `Get the latest updates on ${category} at reachmalayalam.com. Stay informed with breaking news, in-depth analysis, and exclusive reports.`,
            "publisher": {
              "@type": "Organization",
              "name": "Reach Malayalam",
              "logo": {
                "@type": "ImageObject",
                "url": "https://reachmalayalam.com/logo512.png"
              }
            },
            "headline": latestNews?.title || "Latest News",
            "image": latestNews?.imageUrl || "https://reachmalayalam.com/logo512.png",
            "datePublished": latestNews?.timestamp ? new Date(latestNews.timestamp).toISOString() : new Date().toISOString(),
            "dateModified": latestNews?.timestamp ? new Date(latestNews.timestamp).toISOString() : new Date().toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://www.reachmalayalam.com/${category}`
            }
          })}
        </script>

        {/* Structured Data for Articles */}
        {InitialNews.map((news) => (
          <script key={news.id} type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://www.reachmalayalam.com/${news.category}/${news.id}`
              },
              "headline": news.title,
              "image": news.imageUrl || "https://reachmalayalam.com/logo512.png",
              "datePublished": new Date(news.timestamp).toISOString(),
              "dateModified": news.editedTime ? new Date(news.editedTime).toISOString() : new Date(news.timestamp).toISOString(),
              "author": {
                "@type": "Person",
                "name": news.reporterName || "Reach Malayalam Staff Reporter"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Reach Malayalam",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://reachmalayalam.com/logo512.png"
                }
              },
              "description": news.description1 || news.heading1 || "Latest news from Reach Malayalam."
            })}
          </script>
        ))}
      </Head>
      <main className={`${styles.main} `}>
        <CategoryPage data={InitialNews} category={category} />
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const paths = pages.slice(1).map(page => ({
    params: { category: page.english }
  }));

  return {
    paths,
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const { category } = params;
  const InitialNews = await fetchCategoryNews(category, 6);

  return {
    props: {
      InitialNews,
      category,
    },
    revalidate: 3600, // Regenerate the page every hour
  };
}
