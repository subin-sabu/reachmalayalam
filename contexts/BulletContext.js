"use client"

import React, { createContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

// Create Context
export const BulletContext = createContext();

// Provider Component
export const BulletProvider = ({ children }) => {
  // State to store the news bullets
  const [bullets, setBullets] = useState([]);

  useEffect(() => {
    // Function to fetch news bullet data
    const fetchBullets = async () => {
      try {
        // Check if there is cached news bullets available in local storage
        const cachedBullets = JSON.parse(localStorage.getItem('cachedBullets')) || [];

        // Set cached news bullets to state
        setBullets(cachedBullets);

        // Reference to the 'bullets' collection
        const bulletsRef = collection(db, 'bullets');

        // Create a query to order news bullets by timestamp in descending order and limit to 10
        const q = query(bulletsRef, orderBy('timestamp', 'desc'), limit(10));

        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const updatedBullets = [];
          querySnapshot.forEach((doc) => {
            updatedBullets.push({ id: doc.id, ...doc.data() });
          });

          // Update state with fetched news bullets
          setBullets(updatedBullets);

          // Cache the fetched news bullets in local storage
          localStorage.setItem('cachedBullets', JSON.stringify(updatedBullets));
          console.log('Latest news bullets added to cache successfully');
          console.log(updatedBullets)
        });

        // Cleanup function to unsubscribe from real-time updates
        return () => unsubscribe();

      } catch (error) {
        console.error('Failed to fetch news bullets from backend', error);
      }
    };

    // Fetch news data
    fetchBullets();

    // No cleanup needed for timeout as there's no timeout being set

  }, []); // Empty dependency array ensures this effect runs only once on component mount

  return (
    // Provide the news bullets context to children components
    <BulletContext.Provider value={bullets}>
      {children}
    </BulletContext.Provider>
  );
};
