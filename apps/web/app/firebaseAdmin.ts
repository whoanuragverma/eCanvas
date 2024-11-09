import admin from "firebase-admin";

export const adminApp =
  admin.apps.length == 0
    ? admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!,
          privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY!,
          clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL!,
        }),
        databaseURL: `'https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!}.firebaseio.com'`,
      })
    : admin.app();
