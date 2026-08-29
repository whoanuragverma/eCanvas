import { widgetParser } from "@repo/parser";
import { validateApiKey } from "../../../../../lib/apiKeys";
import { adminApp } from "../../../../firebaseAdmin";

async function getWidget(ownerUid: string, id: string) {
  const db = adminApp.firestore();
  const doc = await db.collection(ownerUid).doc(id).get();

  if (!doc.exists) {
    throw new Error("Widget not found");
  }

  return doc.data();
}

async function renderHtml(widget: any) {
  const html = await widgetParser(widget);
  return html[0] ?? "";
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const apiKey = await validateApiKey(request);
    const widget = await getWidget(apiKey.ownerUid, params.id);

    if (!widget) {
      throw new Error("Widget not found");
    }

    const html = await renderHtml(widget as any);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    const message = (error as Error).message;
    const status = message === "Widget not found" ? 404 : 401;

    return new Response(
      JSON.stringify({
        success: false,
        error: message,
      }),
      {
        status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
