import { JSDOM } from "jsdom";
import { Widget } from "@repo/schema";
import REST from "./hooks/REST";
import domBuilder from "./domBuilder";
import processStyles from "./processStyles";
const window = new JSDOM(`<!DOCTYPE html></html>`).window;

export async function widgetParser(widget: Widget): Promise<string> {
  const document = window.document;
  const { hooks, component, debug } = widget;
  const hooksData: Record<string, Object> = {}; // Cache for hooks data
  if (hooks && !debug) {
    for await (const hook of hooks) {
      hooksData[hook.name] = await REST(hook);
    }
  }

  const domElement = domBuilder(component, document, hooksData, !!debug);

  const styles = await processStyles(component);
  const styleElement = document.createElement("style");
  styleElement.innerHTML = styles;

  return styleElement.outerHTML + domElement.outerHTML;
}
