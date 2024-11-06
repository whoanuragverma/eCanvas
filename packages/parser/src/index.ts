import { JSDOM } from "jsdom";
import { Widget } from "@repo/schema";
import REST from "./hooks/REST";
import domBuilder from "./domBuilder";
import processStyles from "./processStyles";
const window = new JSDOM(`<!DOCTYPE html></html>`).window;

export async function widgetParser(widget: Widget): Promise<string> {
  const document = window.document;
  const { hooks, component } = widget;
  const hooksData: Record<string, Object> = {}; // Cache for hooks data
  if (hooks) {
    for await (const hook of hooks) {
      hooksData[hook.name] = await REST(hook);
    }
  }

  const domElement = domBuilder(component, document, hooksData);

  const styles = await processStyles(component);
  const styleElement = document.createElement("style");
  styleElement.innerHTML = styles;

  return styleElement.outerHTML + domElement.outerHTML;
}

// widgetParser({
//   name: "widget",
//   author: "Anonymous",
//   description: "A widget.",
//   version: "1.0.0",
//   component: {
//     element: "div",
//     className: "text-red-500 text-xl",
//     children: [
//       {
//         element: "span",
//         text: "hooksData['todoHook'].todos[0].todo",
//         eval: true,
//       },
//       {
//         element: "span",
//         text: "hooksData['ttodoHook'].todo",
//         eval: true,
//         className: "text-blue-500",
//       },
//       {
//         element: "img",
//         src: "hooksData['todoHook'].todos[0].todo",
//         eval: true,
//       },
//     ],
//   },
//   hooks: [
//     {
//       type: "REST",
//       url: "https://dummyjson.com/todos",
//       method: "GET",
//       headers: {},
//       body: undefined,
//       name: "todoHook",
//     },
//     {
//       type: "REST",
//       url: "https://dummyjson.com/todos/2",
//       method: "GET",
//       headers: {},
//       body: undefined,
//       name: "ttodoHook",
//     },
//   ],
// }).then(console.log);
