import { Component } from "./component";
import { Hook } from "./hook";

export interface Widget {
  /**
   * The name of the widget.
   * @default 'widget'
   */
  name: string;
  /**
   * The version of the widget.
   * @default '1.0.0'
   */
  version: string;
  /**
   * The description of the widget.
   * @default 'A widget.'
   */
  description: string;
  /**
   * The author of the widget.
   * @default 'Anonymous'
   */
  author: string;
  /**
   * These are run before the widget is loaded. They can be used to dynamically load content for the widget via REST API or Native methods/
   */
  hooks?: Hook[];
  /**
   * The HTML to render for the widget.
   */
  component: Component;
  /**
   * Hooks will not be run in debug mode and all evals will be disabled.
   */
  debug?: boolean;
}
