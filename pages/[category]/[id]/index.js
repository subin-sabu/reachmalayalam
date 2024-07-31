import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import News from "@/components/Pages/News";
import { fetchNewsWithID } from "@/lib/fetchNews";
import { fetchRelatedNews } from "@/lib/fetchRelatedNews";

const inter = Inter({ subsets: ["latin"] });

export default function NewsPage({ newsData, category, relatedNews }) {
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
        <News newsData={newsData} category={category} relatedNews={relatedNews} />
      </main>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { id, category } = params;
  
  let newsData = null;
  let relatedNews = [];

  try {
    newsData = await fetchNewsWithID(id);
    console.log("Fetched News Data:", newsData); // Log the fetched news data for debugging

    if (newsData && newsData.tags) {
      relatedNews = await fetchRelatedNews(newsData.tags, newsData.id, 2, 6);
    }
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
      category,
      relatedNews, // Add relatedNews to the props
    },
  };
}
