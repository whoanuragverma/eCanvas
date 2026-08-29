import { widgetParser } from "@repo/parser";
import { html as htmlBeautify } from "js-beautify";
import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import { chromium as playwrightChromium } from "playwright-core";
import { validateApiKey } from "../../../../../lib/apiKeys";
import { adminApp } from "../../../../firebaseAdmin";

export const maxDuration = 60;

async function getWidget(ownerUid: string, id: string) {
  const db = adminApp.firestore();
  const doc = await db.collection(ownerUid).doc(id).get();

  if (!doc.exists) {
    throw new Error("Widget not found");
  }

  return doc.data();
}

async function renderWidgetHtml(widget: any) {
  const html = await widgetParser(widget);
  const generated = html[0] ?? "";
  const debug = html[1] ?? generated;

  return [
    generated,
    htmlBeautify(debug, {
      indent_size: 1,
      indent_char: "\t",
      wrap_line_length: 40,
    }),
  ];
}

async function renderPng(markup: string, width = 800, height = 600) {
  const browser = await playwrightChromium.launch({
    headless: chromium.headless,
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

    const html = await renderWidgetHtml(widget as any);
    const url = new URL(request.url);
    const format = url.searchParams.get("format") === "png" ? "png" : "html";

    if (format === "png") {
      const png = await renderPng(html[0] ?? "", 800, 600);

      return new Response(png, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": 'inline; filename="widget.png"',
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: html,
    });
  } catch (error) {
    const message = (error as Error).message;
    const status = message === "Widget not found" ? 404 : 401;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}
