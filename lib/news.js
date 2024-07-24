// lib/news.js

import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Function to fetch news from Firebase Firestore by ID
export const fetchNewsFromFirebase = async (newsId) => {
  try {
    // Ensure the newsId is correctly passed
    if (!newsId || typeof newsId !== 'string') {
      console.error("Invalid newsId provided:", newsId);
      return null;
    }

    // Log the newsId to debug
    console.log("Fetching news with ID:", newsId);

    const docRef = doc(db, 'news', newsId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};
