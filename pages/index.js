import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Home from "@/components/Pages/Home";
import { fetchInitialNews } from "@/lib/fetchInitialNews";

const inter = Inter({ subsets: ["latin"] });

export default function HomePage({ InitialNews }) {
  return (
    <>
      <Head>
        <title>Reach Malayalam</title>
        <meta name="description" content="Get the latest updates on your favorite topics at reachmalayalam.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Home data={InitialNews} />
      </main>
    </>
  );
}

// This function runs at build time and re-generates the page based on the revalidate period.
export async function getStaticProps() {
  const InitialNews = await fetchInitialNews();
  // Return the props and revalidate period
  return {
    props: {
      InitialNews,
    },
    revalidate: 60, // Regenerate the page every 10 seconds
  };
}
