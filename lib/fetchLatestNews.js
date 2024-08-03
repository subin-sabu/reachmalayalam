// lib/fetchLatestNews.js

import { db } from './firebase';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';

export const fetchLatestNews = async (newsLimit) => {
  try {
    const newsRef = collection(db, 'news');
    const q = query(newsRef, orderBy('timestamp', 'desc'), limit(newsLimit));
    const querySnapshot = await getDocs(q);

    const newsData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp ? data.timestamp.toMillis() : null, // Convert Firestore timestamp to Unix timestamp
        editedTime: data.editedTime ? data.editedTime.toMillis() : null // Handle editedTime if it exists
      };
    });

    return newsData;
  } catch (error) {
    console.error('Failed to fetch latest news from backend', error);
    return [];
  }
};
