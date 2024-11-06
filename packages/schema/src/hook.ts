/**
 * A hook is called before the widget is loaded. It can be used to dynamically load content for the widget via REST API or Native methods.
 * Hooks run in the order they are defined - sequentially.
 * Output of hooks are cached and can be accessed in the next hook or the widget using {{hooksData[hookName][...property]}}.
 */
export type Hook = {
  /**
   * The name of the hook.
   * @default 'hook'
   */
  name: string;
} & (RestHook | NativeHook);

type RestHook = {
  /**
   * The name of the hook.
   */
  type: "REST";
  /**
   * The URL to fetch data from.
   */
  url: string;
  /**
   * Headers to include in the request.
   */
  headers?: Record<string, string>;
  /**
   * The method to use for the request.
   */
  method: "GET" | "POST" | "PUT" | "DELETE";
  /**
   * The body to send with the request.
   */
  body?: string;
};

type NativeHook = {
  /**
   * The name of the hook.
   */
  type: "NATIVE";
  /**
   * The native method to call.
   */
  methodName: string;
};
