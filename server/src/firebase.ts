import { initializeApp, getApps, cert } from 'firebase-admin/app';
import dotenv from 'dotenv';

dotenv.config();

if (!getApps().length) {
  try {
    // If you haven't provided actual credentials yet, you can initialize without cert for the mock to work
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== 'your-project-id') {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle newline characters in the private key
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin initialized successfully');
    } else {
       initializeApp(); // Dummy initialization to prevent errors
       console.log('Firebase Admin initialized with default config (Mock Mode)');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

