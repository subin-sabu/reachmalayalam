// pages/[category]/[id]/index.js

import Head from "next/head";
import styles from "@/styles/Home.module.css";
import News from "@/components/Pages/News";
import { encodeId, decodeId } from "@/lib/idEncoding";
import { fetchLatestNews } from "@/lib/fetchLatestNews";
import { fetchNewsWithID } from "@/lib/fetchNews";

export default function NewsPage({ newsData, category }) {
  if (!newsData) {
    return <div>Article not found</div>;
  }

  const {
    title,
    description1,
    imageUrl,
    heading1,
    reporterName,
    timestamp,
    editedTime,
    tags,
  } = newsData;

  return (
    <>
      <Head>
        <title>{title} | Reach Malayalam</title>
        <meta
          name="description"
          content={`${
            heading1 || description1 || "Latest news updates from Reach Malayalam"
          } | Get the latest updates on ${category} at reachmalayalam.com`}
        />
        <meta name="keywords" content={tags ? tags.join(", ") : ""} />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={heading1 || description1 || "Latest news updates from Reach Malayalam"}
        />
        <meta
          property="og:image"
          content={imageUrl || `https://reachmalayalam.com/logo512.png`}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://www.reachmalayalam.com/${category}/${newsData.id}`}
        />
        <meta property="article:published_time" content={new Date(timestamp).toISOString()} />
        <meta
          property="article:modified_time"
          content={new Date(editedTime || timestamp).toISOString()}
        />
        <meta property="article:section" content={category} />
        <meta property="article:tag" content={tags ? tags.join(", ") : ""} />
        <meta name="author" content={reporterName || `Reach Malayalam Staff Reporter`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta
          name="twitter:description"
          content={heading1 || description1 || "Latest news updates from Reach Malayalam"}
        />
        <meta
          name="twitter:image"
          content={imageUrl || `https://reachmalayalam.com/logo512.png`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} `}>
        <News newsData={newsData} category={category} />
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const latestNews = await fetchLatestNews(3);
  const paths = latestNews.map((news) => ({
    params: {
      id: encodeId(news.id),
      category: news.category,
    },
  }));

  console.log("Generated paths:", paths); 

  return {
    paths,
    fallback: 'blocking', // Use 'blocking' for server-side rendering when a page is not generated at build time
  };
}

export async function getStaticProps({ params }) {
  const { id: encodedId } = params;
  const id = decodeId(encodedId);

  let newsData = null;

  try {
    newsData = await fetchNewsWithID(id);
    console.log("Fetched News Data:", newsData); // Log the fetched news data for debugging
  } catch (error) {
    console.error(`Failed to fetch news with ID: ${id}`, error);
  }

  if (!newsData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      newsData,
      category: newsData.category,
    },
    revalidate: 3600, // Set ISR to 1 hour
  };
}
