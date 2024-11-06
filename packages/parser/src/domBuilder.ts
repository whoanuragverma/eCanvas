import { Component } from "@repo/schema/component";

export default function domBuilder(
  component: Component,
  document: Document,
  hooksData: Record<string, object>,
  debug: boolean
): HTMLElement {
  const baseElement = document.createElement(component.element);

  if (component.style) {
    Object.entries(component.style).forEach(([key, value]) => {
      // @ts-ignore
      baseElement.style[key] = value;
    });
  }

  if (component.className) {
    baseElement.className = component.className;
  }

  if (component.element === "img") {
    (baseElement as HTMLImageElement).src =
      component.eval && !debug ? eval(component.src) : component.src;
  }

  if (component.element === "span") {
    (baseElement as HTMLSpanElement).innerHTML =
      component.eval && !debug ? eval(component.text) : component.text;
  }

  if (component.element === "div" && component.children) {
    for (let children of component.children) {
      const childComponent = domBuilder(children, document, hooksData, debug);
      baseElement.appendChild(childComponent);
    }
  }

  return baseElement;
}
