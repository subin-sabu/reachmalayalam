// pages/[category]/[id]/index.js

import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import News from "@/components/Pages/News";
import { fetchNewsWithID } from "@/lib/fetchNews";
import { fetchLatestNews } from "@/lib/fetchLatestNews";
import pages from "@/components/Navbar/Categories";

const inter = Inter({ subsets: ["latin"] });

export default function NewsPage({ newsData, category }) {
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
    const encodedId = encodeURIComponent(news.id);
    pages.slice(1).map(page => page.english).forEach(category => {
      paths.push({
        params: { category, id: encodedId },
      });
    });
  });

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { id, category } = params;
  const decodedId = decodeURIComponent(id);
  const newsData = await fetchNewsWithID(decodedId);

  return {
    props: {
      newsData,
      category,
    },
    revalidate: 50, // Regenerate the page every 50 seconds
  };
}
