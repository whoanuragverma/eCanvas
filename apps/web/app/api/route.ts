import { widgetParser } from "@repo/parser";
import { html as html_beautify } from "js-beautify";
import { Widget } from "@repo/schema";
import { chromium } from "playwright";

export interface ApiResponse {
  success: boolean;
  data: string[];
}

export interface RenderOptions {
  format?: "html" | "png";
  width?: number;
  height?: number;
}

function isWidgetPayload(payload: unknown): payload is Widget {
  if (!payload || typeof payload !== "object") return false;
  return "component" in payload || "name" in payload;
}

function isStaticPagePayload(payload: unknown): payload is {
  title?: string;
  content?: string;
  html?: string;
  text?: string;
} {
  if (!payload || typeof payload !== "object") return false;
  return "content" in payload || "html" in payload || "text" in payload;
}

async function renderPayload(body: unknown): Promise<string[]> {
  const payload = typeof body === "string" ? JSON.parse(body) : body;

  if (isWidgetPayload(payload)) {
    const html = await widgetParser(payload);
    const generatedHtml = html[0] ?? "";
    const debugHtml = html[1] ?? generatedHtml;

    return [
      generatedHtml,
      html_beautify(debugHtml, {
        indent_size: 1,
        indent_char: "\t",
        wrap_line_length: 40,
      }),
    ];
  }

  if (isStaticPagePayload(payload)) {
    const pageHtml = payload.html ?? payload.content ?? payload.text ?? "";
    const title = payload.title ?? "Static page";
    const markup = `
      <article class="eink-page" style="padding: 24px; font-family: Arial, sans-serif; color: #111827; line-height:1.6;">
        <h1 style="margin:0 0 16px; font-size: 2rem; font-weight: 700;">${title}</h1>
        <div>${pageHtml}</div>
      </article>
    `;

    return [markup, `<body>${markup}</body>`];
  }

  throw new Error(
    "The request body must be a widget object or a static page payload with html/content/text."
  );
}

async function renderPng(
  markup: string,
  width = 800,
  height = 600
): Promise<Buffer> {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
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

export async function GET(request: Request): Promise<Response> {
  const headers = request.headers;
  const authHeader = headers.get("authorization");
  const hasKey =
    !!headers.get("x-api-key") ||
    !!(authHeader && authHeader.startsWith("Bearer ")) ||
    !!new URL(request.url).searchParams.get("api_key") ||
    !!new URL(request.url).searchParams.get("apiKey") ||
    !!new URL(request.url).searchParams.get("key");

  if (hasKey) {
    try {
      const { validateApiKey } = await import("../../lib/apiKeys");
      await validateApiKey(request);
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: (error as Error).message,
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const url = new URL(request.url);
  const payload = url.searchParams.get("payload");
  const format = (url.searchParams.get("format") as RenderOptions["format"]) ?? "html";

  try {
    const parsed = payload ? JSON.parse(payload) : null;
    const rawOptions =
      parsed && typeof parsed === "object" && "format" in parsed ? parsed : {};
    const outputFormat =
      format === "png" || (rawOptions as RenderOptions).format === "png"
        ? "png"
        : "html";

    if (outputFormat === "png") {
      const html = await renderPayload(parsed ?? {});
      const markup = html[0] ?? "";
      const png = await renderPng(
        markup,
        typeof rawOptions === "object" && rawOptions && "width" in rawOptions
          ? Number((rawOptions as RenderOptions).width ?? 800)
          : 800,
        typeof rawOptions === "object" && rawOptions && "height" in rawOptions
          ? Number((rawOptions as RenderOptions).height ?? 600)
          : 600
      );

      return new Response(png, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": 'inline; filename="widget.png"',
        },
      });
    }

    const html = await renderPayload(parsed);

    return new Response(
      JSON.stringify({
        success: true,
        data: html,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        data: [
          `<h2>${(error as Error).message}</h2><br/><em>${(error as Error).stack}</em>`,
        ],
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  const headers = request.headers;
  const authHeader = headers.get("authorization");
  const hasKey =
    !!headers.get("x-api-key") ||
    !!(authHeader && authHeader.startsWith("Bearer ")) ||
    !!new URL(request.url).searchParams.get("api_key") ||
    !!new URL(request.url).searchParams.get("apiKey") ||
    !!new URL(request.url).searchParams.get("key");

  if (hasKey) {
    try {
      const { validateApiKey } = await import("../../lib/apiKeys");
      await validateApiKey(request);
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: (error as Error).message,
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  try {
    const body = await request.json();
    const renderFormat =
      (body && typeof body === "object" && "format" in body
        ? String((body as RenderOptions).format)
        : "html") || "html";

    if (renderFormat === "png") {
      const html = await renderPayload(body);
      const markup = html[0] ?? "";
      const png = await renderPng(
        markup,
        typeof body === "object" && body && "width" in body
          ? Number((body as RenderOptions).width ?? 800)
          : 800,
        typeof body === "object" && body && "height" in body
          ? Number((body as RenderOptions).height ?? 600)
          : 600
      );

      return new Response(png, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": 'inline; filename="widget.png"',
        },
      });
    }

    const html = await renderPayload(body);

    return new Response(
      JSON.stringify({
        success: true,
        data: html,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        data: [
          `<h2>${(error as Error).message}</h2><br/><em>${(error as Error).stack}</em>`,
        ],
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
