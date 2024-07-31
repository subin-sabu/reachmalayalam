// pages/[category]/index.js


import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import CategoryPage from "@/components/Pages/CategoryPage"; 
import pages from "@/components/Navbar/Categories";
import { fetchCategoryNews } from "@/lib/fetchCategoryNews"; 

const inter = Inter({ subsets: ["latin"] });

export default function Category({ InitialNews, category }) {
  return (
    <>
      <Head>
        <title>{category} - Reach Malayalam</title>
        <meta name="description" content={`Get the latest updates on ${category} at reachmalayalam.com`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
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
  const InitialNews = await fetchCategoryNews(category);

  return {
    props: {
      InitialNews,
      category,
    },
    revalidate: 3600, // Regenerate the page every 3600 seconds
  };
}
