/* eslint-disable turbo/no-undeclared-env-vars */
import "./globals.css";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { AuthProvider } from "../component/AuthProvider";
import { Metadata } from "next";
import Header from "../component/Header";
import { toUser } from "../utils/toUser";

export const metadata: Metadata = {
  title: "eCanvas",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  return (
    <html lang="en">
      <body className="flex flex-col bg-[#1e1e1e] text-white">
        <AuthProvider user={user}>
          {user && <Header />}
          <div>{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
