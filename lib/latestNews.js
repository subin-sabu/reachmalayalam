// lib/latestNews.js


import { db } from './firebase';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';



export const fetchLatestNews = async () => {
  try {
    const newsRef = collection(db, 'news');
    const q = query(newsRef, orderBy('timestamp', 'desc'), limit(30));
    const querySnapshot = await getDocs(q);

    const newsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return newsData;
  } catch (error) {
    console.error('Failed to fetch latest news from backend', error);
    return [];
  }
};

