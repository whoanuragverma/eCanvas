import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
export const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!}.firebaseapp.com`,
  databaseURL: `'https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!}.firebaseio.com'`,
});

export const db = getFirestore(app);
