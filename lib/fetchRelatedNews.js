// lib/fetchRelatedNews.js

import { db } from './firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

/**
 * Fetch related news based on the tags in the current news.
 * @param {string[]} currentTags - Tags from the current news item.
 * @param {number} newsLimit - The maximum number of related news items to fetch.
 * @param {string} id - The ID of the current news item.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of related news items.
 */
export const fetchRelatedNews = async (currentTags, id, newsLimit, tagLimit) => {
  try {
    // Ensure currentTags is an array and filter out 'main'
    const relevantTags = (Array.isArray(currentTags) ? currentTags : [])
      .filter(tag => tag.toLowerCase() !== 'main')
      .slice(0, tagLimit)
      .map(tag => tag.toLowerCase());

    // Create a query to fetch news items, ordered by timestamp desc
    const newsRef = collection(db, 'news');
    let newsQuery = query(newsRef, orderBy('timestamp', 'desc'), limit(newsLimit));

    const querySnapshot = await getDocs(newsQuery);
    const newsData = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamps to milliseconds
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp ? data.timestamp.toMillis() : null,
        editedTime: data.editedTime ? data.editedTime.toMillis() : null,
      };
    });

    // Filter newsData based on relevant tags and exclude the current news item
    const filteredNews = newsData.filter(newsItem => {
      // Get tags from the newsItem and check if they match any of the relevantTags
      const newsTags = newsItem.tags ? newsItem.tags.map(tag => tag.toLowerCase()) : [];
      return newsItem.id !== id && relevantTags.some(tag => newsTags.includes(tag));
    });

    // Sort filtered results to ensure the latest news appears first
    const sortedFilteredNews = filteredNews.sort((a, b) => b.timestamp - a.timestamp);

    // Return the filtered and sorted news
    return sortedFilteredNews.slice(0, newsLimit);
  } catch (error) {
    console.error('Failed to fetch related news from backend', error);
    return [];
  }
};
