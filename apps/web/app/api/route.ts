import { widgetParser } from "@repo/parser";
export async function POST(request: Request) {
  const body = await request.json();

  return new Response(await widgetParser(body), {
    headers: { "Content-Type": "text/html" },
  });
}
