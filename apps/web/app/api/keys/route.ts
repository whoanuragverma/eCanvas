import { NextResponse } from "next/server";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { toUser } from "../../../utils/toUser";
import { createApiKeyForUser, listApiKeysForUser } from "../../../lib/apiKeys";

async function getAuthenticatedUser() {
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

  if (!tokens) {
    return null;
  }

  return toUser(tokens);
}

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const keys = await listApiKeysForUser((user as any).uid ?? "");

  return NextResponse.json({ success: true, data: keys });
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const name = typeof body?.name === "string" ? body.name : "Default app key";

  const key = await createApiKeyForUser((user as any).uid ?? "", name);

  return NextResponse.json({ success: true, data: key });
}
