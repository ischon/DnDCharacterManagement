"use strict"
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Validate required environment variables
const requiredEnvVars = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  throw new Error(`Missing required Firebase environment variables: ${missingVars.join(', ')}`)
}

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// // Add debug logging
// console.log('Firebase Config:', {
//   apiKey: firebaseConfig.apiKey ? 'Present' : 'Missing',
//   authDomain: firebaseConfig.authDomain ? 'Present' : 'Missing',
//   projectId: firebaseConfig.projectId ? 'Present' : 'Missing',
//   storageBucket: firebaseConfig.storageBucket ? 'Present' : 'Missing',
//   messagingSenderId: firebaseConfig.messagingSenderId ? 'Present' : 'Missing',
//   appId: firebaseConfig.appId ? 'Present' : 'Missing'
// })

let app
let auth
let firestore

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  firestore = getFirestore(app)
} catch (error) {
  console.error('Error initializing Firebase:', error)
  throw error
}

export { auth, firestore }
export default app
