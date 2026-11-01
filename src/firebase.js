// src/firebase.js

// Import the functions you need from the SDKs you want to use
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Importing the Auth module
import { getFirestore } from "firebase/firestore"; // Importing Firestore

// Firebase configuration - requires .env file with your Firebase credentials
// Copy .env.example to .env and fill in your actual Firebase config values
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Validate required config values in development
if (process.env.NODE_ENV === 'development' && Object.values(firebaseConfig).some(v => v === undefined)) {
  console.warn('⚠️ Firebase config missing values. Set them in .env file (see .env.example)');
}

// Ensure the API key is configured in production
if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_FIREBASE_API_KEY) {
  throw new Error('SECURITY ERROR: Firebase API key is missing from the production environment');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Initialize Auth
const db = getFirestore(app); // Initialize Firestore

// Export auth and db for use in other files
export { auth, db };
