// pages/[category]/[id]/index.js

import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import News from "@/components/Pages/News";
import { fetchNewsWithID } from "@/lib/fetchNews";
import { fetchLatestNews } from "@/lib/fetchLatestNews";

const inter = Inter({ subsets: ["latin"] });

export default function NewsPage({ newsData, category }) {
  if (!newsData) {
    return <div>Article not found</div>;
  }

  return (
    <>
      <Head>
        <title>{newsData.title} | Reach Malayalam</title>
        <meta name="description" content={`${newsData.heading1 || newsData.description1} | Get the latest updates on ${category} at reachmalayalam.com`} />
        <meta name="og:image" content={newsData.imageUrl || `https://www.example.com/default-image.jpg`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <News newsData={newsData} category={category} />
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const latestNewsItems = await fetchLatestNews(); // Fetch the latest 10 news items
  const paths = [];

  latestNewsItems.forEach(news => {
    const encodedId = encodeURIComponent(news.id); // Encode the ID to ensure it fits in the URL
    const category = news.category;
    paths.push({
      params: { category, id: encodedId },
    });
  });

  return {
    paths,
    fallback: 'blocking', // Use blocking to ensure new paths are generated at request time
  };
}

export async function getStaticProps({ params }) {
  const { id, category } = params;
  const decodedId = decodeURIComponent(id); // Decode the URL-encoded ID
  let newsData = null;

  console.log("Decoded ID:", decodedId); // Log the decoded ID for debugging

  try {
    newsData = await fetchNewsWithID(decodedId);
    console.log("Fetched News Data:", newsData); // Log the fetched news data for debugging
  } catch (error) {
    console.error(`Failed to fetch news with ID: ${decodedId}`, error);
  }

  if (!newsData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      newsData,
      category,
    },
    revalidate: 50, // Regenerate the page every 50 seconds
  };
}


