import { adminApp } from "../app/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export interface ApiKeyRecord {
  id: string;
  key: string;
  name: string;
  ownerUid: string;
  enabled: boolean;
  createdAt: string;
  lastUsedAt?: string;
}

export async function createApiKeyForUser(
  ownerUid: string,
  name: string
): Promise<ApiKeyRecord> {
  const key = `ecanvas_${Array.from({ length: 32 }, () =>
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
      Math.floor(Math.random() * 62)
    )
  ).join("")}`;

  const now = new Date().toISOString();
  const record: ApiKeyRecord = {
    id: key,
    key,
    name: name || "Default app key",
    ownerUid,
    enabled: true,
    createdAt: now,
  };

  const db = adminApp.firestore();
  await db.collection("apiKeys").doc(key).set({
    ...record,
    createdAt: FieldValue.serverTimestamp(),
  });
  await db.collection("users").doc(ownerUid).collection("apiKeys").doc(key).set({
    ...record,
    createdAt: FieldValue.serverTimestamp(),
  });

  return record;
}

export async function listApiKeysForUser(ownerUid: string): Promise<ApiKeyRecord[]> {
  const db = adminApp.firestore();
  const snapshot = await db
    .collection("users")
    .doc(ownerUid)
    .collection("apiKeys")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    key: doc.id,
    ...doc.data(),
  })) as ApiKeyRecord[];
}

export async function validateApiKey(
  request: Request
): Promise<{ key: string; ownerUid: string; name: string }> {
  const headerKey = request.headers.get("x-api-key");
  const queryKey = new URL(request.url).searchParams.get("api_key");
  const apiKey = headerKey || queryKey;

  if (!apiKey) {
    throw new Error("Missing x-api-key header.");
  }

  const db = adminApp.firestore();
  const keyRecord = await db.collection("apiKeys").doc(apiKey).get();

  if (!keyRecord.exists) {
    throw new Error("Invalid API key.");
  }

  const data = keyRecord.data() as Partial<ApiKeyRecord> & { enabled?: boolean };

  if (!data.enabled) {
    throw new Error("This API key is disabled.");
  }

  await db.collection("apiKeys").doc(apiKey).update({
    lastUsedAt: new Date().toISOString(),
  });

  return {
    key: apiKey,
    ownerUid: data.ownerUid!,
    name: data.name || "API key",
  };
}
