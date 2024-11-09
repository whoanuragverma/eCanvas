import { getTokens } from "next-firebase-auth-edge";
import { toUser } from "../../utils/toUser";
import { cookies } from "next/headers";
import { adminApp } from "../firebaseAdmin";
import getAllWidgets from "../../firestore/getAllWidgets";
import Link from "next/link";
import deleteWidget from "../../firestore/deleteWidget";
import Widget from "../../component/Widget";
export default async function Library() {
  const tokens = await getTokens(await cookies(), {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    cookieName: "AuthToken",
    cookieSignatureKeys: [process.env.NEXT_PUBLIC_COOKIE_SIGNATURE_KEY!],
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!,
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY!,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL!,
    },
  });

  const user = tokens ? toUser(tokens) : null;

  const db = adminApp.firestore();

  const widgets = await getAllWidgets(db, user);
  return (
    <div className="grid grid-cols-4 gap-3">
      {widgets.map((widget) => (
        <Widget widget={widget} key={widget.name} />
      ))}
    </div>
  );
}
