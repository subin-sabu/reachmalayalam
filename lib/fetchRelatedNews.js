// lib/fetchRelatedNews.js

import { db } from './firebase';
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore';

/**
 * Fetch related news based on the tags in the current news.
 * @param {string[]} currentTags - Tags from the current news item.
 * @param {string} id - The ID of the current news item.
 * @param {number} newsLimit - The maximum number of related news items to fetch to the client.
 * @param {number} resultsPerTag - The maximum number of documents to fetch per tag query.
 * @param {number} tagLimit - The maximum number of tags to consider from the currentTags array.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of related news items.
 */
export const fetchRelatedNews = async (currentTags, id,  resultsPerTag, tagLimit, newsLimit) => {
  try {
    // Ensure currentTags is an array and filter out 'main'
    const relevantTags = (Array.isArray(currentTags) ? currentTags : [])
      .filter(tag => tag.toLowerCase() !== 'main')
      .slice(0, tagLimit)
      .map(tag => tag.toLowerCase());

    // Create an array of promises to query news items for each tag
    const promises = relevantTags.map(tag => {
      const newsRef = collection(db, 'news');
      const tagQuery = query(newsRef, where('tags', 'array-contains', tag), orderBy('timestamp', 'desc'), limit(resultsPerTag));
      return getDocs(tagQuery);
    });

    // Wait for all tag queries to complete
    const querySnapshots = await Promise.all(promises);

    // Collect and process the news data from each query snapshot
    const allNewsData = [];
    querySnapshots.forEach(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        // Convert Firestore Timestamps to milliseconds
        allNewsData.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? data.timestamp.toMillis() : null,
          editedTime: data.editedTime ? data.editedTime.toMillis() : null,
        });
      });
    });

    // Filter out duplicates and the current news item
    const uniqueNews = allNewsData.reduce((acc, newsItem) => {
      if (newsItem.id !== id && !acc.some(item => item.id === newsItem.id)) {
        acc.push(newsItem);
      }
      return acc;
    }, []);

    // Sort the unique news items by timestamp in descending order
    const sortedNews = uniqueNews.sort((a, b) => b.timestamp - a.timestamp);

    // Return the top newsLimit items
    return sortedNews.slice(0, newsLimit);
  } catch (error) {
    console.error('Failed to fetch related news from backend', error);
    return [];
  }
};
