import { JSDOM } from "jsdom";
import { Widget } from "@repo/schema";
import REST from "./hooks/REST";
import domBuilder from "./domBuilder";
const window = new JSDOM(`<!DOCTYPE html></html>`).window;

export async function widgetParser(widget: Widget): Promise<HTMLElement> {
  const document = window.document;
  const { hooks, component } = widget;
  const hooksData: Record<string, Object> = {}; // Cache for hooks data
  for await (const hook of hooks!) {
    hooksData[hook.name] = await REST(hook);
  }

  const domElement = domBuilder(component, document, hooksData);

  console.log(domElement.outerHTML);

  return domElement;
}

widgetParser({
  name: "widget",
  author: "Anonymous",
  description: "A widget.",
  version: "1.0.0",
  component: {
    element: "div",
    style: {
      color: "red",
      "font-size": "12px",
    },
    children: [
      {
        element: "span",
        text: "hooksData['todoHook'].todos[0].todo",
        eval: true,
      },
      {
        element: "span",
        text: "hooksData['ttodoHook'].todo",
        eval: true,
        style: {
          color: "blue",
        },
      },
      {
        element: "img",
        src: "hooksData['todoHook'].todos[0].todo",
        eval: true,
      },
    ],
  },
  hooks: [
    {
      type: "REST",
      url: "https://dummyjson.com/todos",
      method: "GET",
      headers: {},
      body: undefined,
      name: "todoHook",
    },
    {
      type: "REST",
      url: "https://dummyjson.com/todos/2",
      method: "GET",
      headers: {},
      body: undefined,
      name: "ttodoHook",
    },
  ],
});
