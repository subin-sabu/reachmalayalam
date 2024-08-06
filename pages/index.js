// pages/index.js

import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Home from "@/components/Pages/Home";
import { fetchLatestNews } from "@/lib/fetchLatestNews";


export default function HomePage({ InitialNews }) {
  const latestNews = InitialNews[0];

  return (
    <>
      <Head>
        <title>Reach Malayalam - Latest News Updates</title>
        <meta name="description" content="Get the latest updates on your favorite topics at reachmalayalam.com. Stay informed with breaking news, in-depth analysis, and exclusive reports." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Reach Malayalam - Latest News Updates" />
        <meta property="og:description" content="Get the latest updates on your favorite topics at reachmalayalam.com. Stay informed with breaking news, in-depth analysis, and exclusive reports." />
        <meta property="og:url" content="https://www.reachmalayalam.com/" />
        <meta property="og:image" content="https://reachmalayalam.com/logo512.png" />
        <meta property="og:image:alt" content="Reach Malayalam Logo" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Reach Malayalam - Latest News Updates" />
        <meta name="twitter:description" content="Get the latest updates on your favorite topics at reachmalayalam.com. Stay informed with breaking news, in-depth analysis, and exclusive reports." />
        <meta name="twitter:image" content="https://reachmalayalam.com/logo512.png" />
        <meta name="twitter:image:alt" content="Reach Malayalam Logo" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.reachmalayalam.com/" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "name": "Reach Malayalam",
            "url": "https://www.reachmalayalam.com/",
            "logo": "https://reachmalayalam.com/logo512.png",
            "sameAs": [
              "https://www.facebook.com/reachmalayalam",
              "https://www.twitter.com/reachmalayalam",
              "https://www.instagram.com/reachmalayalam"
            ],
            "foundingDate": "2023-01-01",
            "founders": [
              {
                "@type": "Person",
                "name": "Founder Name"
              }
            ],
            "description": "Get the latest updates on your favorite topics at reachmalayalam.com. Stay informed with breaking news, in-depth analysis, and exclusive reports.",
            "publisher": {
              "@type": "Organization",
              "name": "Reach Malayalam",
              "logo": {
                "@type": "ImageObject",
                "url": "https://reachmalayalam.com/logo512.png"
              }
            },
            "headline": latestNews.title || "Latest News",
            "image": latestNews.imageUrl || "https://reachmalayalam.com/logo512.png",
            "datePublished": latestNews.timestamp ? new Date(latestNews.timestamp).toISOString() : new Date().toISOString(),
            "dateModified": latestNews.timestamp ? new Date(latestNews.timestamp).toISOString() : new Date().toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://www.reachmalayalam.com/"
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
        <Home data={InitialNews} />
      </main>
    </>
  );
}

export async function getStaticProps() {
  const InitialNews = await fetchLatestNews(13);
  // Return the props and revalidate period
  return {
    props: {
      InitialNews,
    },
    revalidate: 3600, // Regenerate the page every hour
  };
}
