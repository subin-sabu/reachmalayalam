// lib/fetchInitialNews.js


import { db } from './firebase';
import { collection, getDocs, orderBy, limit, query, where } from 'firebase/firestore';
import pages from '../components/Navbar/Categories';

// List of all categories excluding 'home'
const categories = pages.slice(1).map(page => page.english);

export const fetchInitialNews = async () => {
  let unsortedNews = [];

  try {
    for (const category of categories) {
      const newsRef = collection(db, 'news');
      const q = query(newsRef, where('category', '==', category), orderBy('timestamp', 'desc'), limit(3));
      const querySnapshot = await getDocs(q);
      
      const categoryNews = [];
      querySnapshot.forEach((doc) => {
        categoryNews.push({ id: doc.id, ...doc.data() });
      });

      unsortedNews = [
        ...unsortedNews,
        ...categoryNews
      ];
    }

    const sortedNews = unsortedNews.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
    return sortedNews;

  } catch (error) {
    console.error('Failed to fetch initial news from backend', error);
    return [];
  }
};
