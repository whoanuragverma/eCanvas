export type Component = {
  /**
   * The CSS to apply to the component.
   */
  style?: Record<string, string>;
  /**
   * Tailwind CSS classes to apply to the component.
   */
  className?: string;
} & (ImgComponent | DivComponent | SpanComponent);

type ImgComponent = {
  /**
   * Element to render for the component.
   */
  element: "img";
  /**
   * The source of the image.
   */
  src: string;
};

type DivComponent = {
  /**
   * Element to render for the component.
   */
  element: "div";
  /**
   * The children of the component.
   */
  children: Component[];
};

type SpanComponent = {
  /**
   * Element to render for the component.
   */
  element: "span";
  /**
   * The text to render for the component. This text can include output from hooks using {{hooksData[hookName][...property]}}.
   */
  text: string;
};
