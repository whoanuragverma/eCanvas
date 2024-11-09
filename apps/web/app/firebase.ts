import { initializeApp } from "firebase/app";

export const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!}.firebaseapp.com`,
});
