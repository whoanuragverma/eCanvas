import { widgetParser } from "@repo/parser";
import { validateApiKey } from "../../../../../lib/apiKeys";
import { adminApp } from "../../../../firebaseAdmin";

export const runtime = "nodejs";
export const maxDuration = 60;

async function getWidget(ownerUid: string, id: string) {
  const db = adminApp.firestore();
  const doc = await db.collection(ownerUid).doc(id).get();

  if (!doc.exists) {
    throw new Error("Widget not found");
  }

  return doc.data();
}

async function renderPng(markup: string, width = 800, height = 600) {
  const chromium = (await import("@sparticuz/chromium")).default;
  const { chromium: playwrightChromium } = await import("playwright-core");

  const browser = await playwrightChromium.launch({
    headless: true,
    args: chromium.args,
    executablePath: await chromium.executablePath(),
  });

  try {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      isMobile: false,
    });

    const wrappedMarkup = `<div id="eCanvas-root" style="display:inline-block;">${markup}</div>`;

    await page.setContent(
      `<html><body style="margin:0; background:#fff;">${wrappedMarkup}</body></html>`,
      { waitUntil: "networkidle" }
    );

    const root = page.locator("#eCanvas-root");
    return Buffer.from(await root.screenshot({ type: "png" }));
  } finally {
    await browser.close();
  }
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

    const html = await widgetParser(widget as any);
    const markup = html[0] ?? "";
    const png = await renderPng(markup, 800, 600);

    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="widget.png"',
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
