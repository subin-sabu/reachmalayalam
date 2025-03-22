import React, { createContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, orderBy, limit, query, where } from 'firebase/firestore';
import pages from '../components/Navbar/Categories';

// List of all categories excluding 'home'
const categories = pages.slice(1).map(page => page.english);

// Create Context
export const NewsContext = createContext();

// Provider Component
export const NewsProvider = ({ children, initialNews }) => {
  // State to track loading status for context
  const [contextLoading, setContextLoading] = useState(true);

  // State to store the news items
  const [news, setNews] = useState(initialNews || []);

  // Array to hold all unsubscribers for each category
  const unsubscribers = [];

  // Function to fetch news data
  const fetchNews = async () => {
    try {
      // Check if there is cached news data available in local storage
      const cachedNews = JSON.parse(localStorage.getItem('cachedNews')) || [];

      // If initialNews is provided, use it
      if (initialNews && initialNews.length > 0) {
        setNews(initialNews);
        setContextLoading(false);
        console.log('Using news data received from server:', initialNews);
      } 
      // If cached data is available, use it
      else if (cachedNews.length > 0) {
        setNews(cachedNews);
        setContextLoading(false);
        console.log('Using cached news data:', cachedNews);
      }

      // Object to hold news data from all categories
      let unsortedNews = [];

      // Subscribe to real-time updates for each category
      categories.forEach(category => {
        const newsRef = collection(db, 'news');
        const q = query(newsRef, where('category', '==', category), orderBy('timestamp', 'desc'), limit(7));

        // Subscribe to real-time updates for the documents specified in query
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const categoryNews = [];
          querySnapshot.forEach((doc) => {
            categoryNews.push({ id: doc.id, ...doc.data() });
          });

          // Update unsortedNews with the latest news from the current category
          unsortedNews = [
            ...unsortedNews.filter(item => item.category !== category),
            ...categoryNews
          ];

          // Sort the merged news by timestamp in descending order
          const updatedNews = unsortedNews.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

          // Update the news state with the latest news
          setNews(updatedNews);

          // Update the cache with the latest news
          localStorage.setItem('cachedNews', JSON.stringify(updatedNews));

          console.log(updatedNews);

          // Stop the loader if it's still running
          if (contextLoading) {
            setContextLoading(false);
          }

          console.log('Real-time news updates received for category:', category, categoryNews);
        });

        // Add unsubscribe function to the array
        unsubscribers.push(unsubscribe);
      });

    } catch (error) {
      console.error('Failed to fetch news from backend', error);
      // In case of an error, setting contextLoading to false to handle errors gracefully
      setContextLoading(false);
    }
  };

  useEffect(() => {
    // Fetch news data when component mounts
    fetchNews();

    // Cleanup function to unsubscribe on unmount
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  // Provide both news data and loading state in context value
  return (
    <NewsContext.Provider value={{ news, contextLoading }}>
      {children}
    </NewsContext.Provider>
  );
};
