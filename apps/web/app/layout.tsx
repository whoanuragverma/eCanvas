/* eslint-disable turbo/no-undeclared-env-vars */
import "./globals.css";
import { filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";
import { Tokens, getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { User } from "../component/AuthContext";
import { AuthProvider } from "../component/AuthProvider";
import { Metadata } from "next";
import Header from "../component/Header";

export const metadata: Metadata = {
  title: "eCanvas",
};

const toUser = ({ decodedToken }: Tokens): User => {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
    source_sign_in_provider: signInProvider,
  } = decodedToken;

  const customClaims = filterStandardClaims(decodedToken);

  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
    providerId: signInProvider,
    customClaims,
  };
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
