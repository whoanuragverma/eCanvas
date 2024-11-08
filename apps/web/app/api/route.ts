import { widgetParser } from "@repo/parser";
import { html as html_beautify } from "js-beautify";
export interface ApiResponse {
  success: boolean;
  data: string[];
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  try {
    const html = await widgetParser(
      typeof body === "string" ? JSON.parse(body) : body
    );
    return new Response(
      JSON.stringify({
        success: true,
        data: [
          html[0],
          html_beautify(`<body>${html[1]}</body>`, {
            indent_size: 1,
            indent_char: "\t",
            wrap_line_length: 40,
          }),
        ],
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        data: `<h2>${(error as Error).message}</h2><br/><em>${(error as Error).stack}</em>`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
