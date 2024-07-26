// lib/fetchNews.js

import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export const fetchNewsWithID = async (id) => {
  try {
    const newsDoc = doc(db, 'news', id);
    const docSnap = await getDoc(newsDoc);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        timestamp: data.timestamp.toMillis(), // Convert Firestore timestamp to Unix timestamp
        editedTime: data.editedTime ? data.editedTime.toMillis() : null // Handle editedTime if it exists
      };
    } else {
      console.error('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch news by ID from backend', error);
    return null;
  }
};
