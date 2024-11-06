import { widgetParser } from "@repo/parser";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const html = await widgetParser(
      typeof body === "string" ? JSON.parse(body) : body
    );
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    return new Response(
      `<h2>${(error as Error).message}</h2><br/><em>${(error as Error).stack}</em>`,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}
