import { Hook } from "@repo/schema/hook";

export default async function REST(hook: Hook): Promise<Object> {
  if (hook.type === "NATIVE") throw new Error("Hook type must be REST");
  const { url, method, headers, body } = hook;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(`Failed to fetch: ${error}`);
  }
}
