"use client";
import { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import Schema from "@repo/schema/json";
export default function Home() {
  const [text, setText] = useState("");
  const [htmlResponse, setHtmlResponse] = useState("");
  const monaco = useMonaco();

  const handleChange = (value, _) => {
    setText(value);
  };

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
  useEffect(() => {
    async function fetchHtml() {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(text),
      });

      const html = await response.text();

      setHtmlResponse(html);
    }

    fetchHtml();
  }, [text]);

  return (
    <div className="flex">
      <Editor
        defaultLanguage="json"
        height={"100vh"}
        onChange={handleChange}
        value={text}
        width={"50%"}
      />
      <div dangerouslySetInnerHTML={{ __html: htmlResponse }} />
    </div>
  );
}
