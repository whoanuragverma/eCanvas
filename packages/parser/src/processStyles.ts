import { Component } from "@repo/schema/component";
import autoprefixer from "autoprefixer";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

async function generateStyles(className: string): Promise<string> {
  const content = `<div class="${className}"></div>`;
  //@ts-ignore
  const result = await postcss([
    tailwindcss({
      content: [{ raw: content, extension: "html" }],
    }),
    autoprefixer,
  ]).process("@tailwind base;@tailwind components;@tailwind utilities;", {
    from: undefined,
  });

  return result.css;
}

export default async function processStyles(
  component: Component
): Promise<string> {
  return await generateStyles(findClassNames(component));
}

function findClassNames(component: Component): string {
  let classNames: string[] = [];

  if (component.className) {
    classNames.push(component.className);
  }

  if (component.element === "div" && component.children) {
    for (let children of component.children) {
      classNames.push(findClassNames(children));
    }
  }

  return classNames.join(" ");
}
