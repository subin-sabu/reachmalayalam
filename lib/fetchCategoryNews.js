// lib/fetchCategoryNews.js

import { db } from './firebase';
import { collection, getDocs, orderBy, limit, query, where } from 'firebase/firestore';

export const fetchCategoryNews = async (category, newsLimit) => {
  let categoryNews = [];

  try {
    const newsRef = collection(db, 'news');
    const q = query(newsRef, where('category', '==', category), orderBy('timestamp', 'desc'), limit(newsLimit));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      categoryNews.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toMillis(), // Convert Firestore timestamp to Unix timestamp
        editedTime: data.editedTime ? data.editedTime.toMillis() : null // Handle editedTime if it exists
      });
    });

    return categoryNews;
  } catch (error) {
    console.error('Failed to fetch category news from backend', error);
    return [];
  }
};
