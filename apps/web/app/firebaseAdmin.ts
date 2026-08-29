import admin from "firebase-admin";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECTID;
const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, "\n");
const clientEmail = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL;
const hasServiceAccountCredentials = Boolean(projectId && privateKey && clientEmail);

export const adminApp =
  admin.apps.length === 0
    ? hasServiceAccountCredentials
      ? admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey,
            clientEmail,
          }),
          databaseURL: `https://${projectId}.firebaseio.com`,
        })
      : admin.initializeApp({
          projectId: projectId ?? "demo-project",
        })
    : admin.app();
