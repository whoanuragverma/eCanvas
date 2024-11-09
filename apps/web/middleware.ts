/* eslint-disable turbo/no-undeclared-env-vars */
import { NextResponse, type NextRequest } from "next/server";
import {
  authMiddleware,
  redirectToHome,
  redirectToLogin,
} from "next-firebase-auth-edge";

const PUBLIC_PATHS = ["/register", "/login"];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    cookieName: "AuthToken",
    cookieSignatureKeys: [process.env.NEXT_PUBLIC_COOKIE_SIGNATURE_KEY!],
    cookieSerializeOptions: {
      path: "/",
      httpOnly: true,
      secure: false, // Set this to true on HTTPS environments
      sameSite: "lax" as const,
      maxAge: 12 * 60 * 60 * 24, // Twelve days
    },
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!,
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY!,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL!,
    },
    handleValidToken: async ({ token, decodedToken }, headers) => {
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request);
      }

      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    handleInvalidToken: async () => {
      return redirectToLogin(request, {
        path: "/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
    handleError: async () => {
      return redirectToLogin(request, {
        path: "/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
  });
}

export const config = {
  matcher: [
    "/api/login",
    "/api/logout",
    "/",
    "/((?!_next|favicon.ico|api|.*\\.).*)",
  ],
};
