import Editor, { useMonaco } from "@monaco-editor/react";
import React, { useEffect } from "react";
import Schema from "@repo/schema/json";

interface WidgetEditorProps {
  text: string | undefined;
  setText: (text?: string) => void;
}

export default function WidgetEditor({ text, setText }: WidgetEditorProps) {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemaValidation: "error",
        schemas: [
          {
            uri: "https://json.schemastore.org/schema",
            fileMatch: ["*"],
            schema: Schema,
          },
        ],
      });
    }
  }, [monaco]);

  return (
    <Editor
      defaultLanguage="json"
      height={"calc(100vh - 56px)"}
      onChange={setText}
      value={text}
      width={"50%"}
      theme="vs-dark"
    />
  );
}
