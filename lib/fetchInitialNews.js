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
        const data = doc.data();
        categoryNews.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toMillis(), // Convert Firestore timestamp to Unix timestamp
          editedTime: data.editedTime ? data.editedTime.toMillis() : null // Handle editedTime if it exists
        });
      });

      unsortedNews = [
        ...unsortedNews,
        ...categoryNews
      ];
    }

    const sortedNews = unsortedNews.sort((a, b) => b.timestamp - a.timestamp);
    return sortedNews;

  } catch (error) {
    console.error('Failed to fetch initial news from backend', error);
    return [];
  }
};
