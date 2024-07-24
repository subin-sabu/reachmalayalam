// lib/firebase.js


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//Firebase Configuration with API key
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// initialize firebase
export const app = initializeApp(firebaseConfig);

// initialize firebase services 
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
  // experimentalForceLongPolling: true,
  useFetchStreams: false,
  //after I turned off useFetchStreams, app started to load data correctly. may be sth wrong with this. 
});
