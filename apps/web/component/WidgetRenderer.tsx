import { useEffect, useState } from "react";
import { ApiResponse } from "../app/api/route";
import { Editor } from "@monaco-editor/react";

interface WidgetRendererProps {
  text?: string;
}

export default function WidgetRenderer({ text }: WidgetRendererProps) {
  const [htmlResponse, setHtmlResponse] = useState<ApiResponse | undefined>();
  const [debug, setDebug] = useState<boolean>(false);
  useEffect(() => {
    async function fetchHtml() {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(text),
      });

      const html = (await response.json()) as ApiResponse;

      setHtmlResponse(html);
    }

    fetchHtml();
  }, [text]);

  return (
    <>
      <div className="absolute bottom-10 right-10">
        <span
          onClick={() => setDebug(!debug)}
          className={`cursor-pointer px-4 py-2 ${debug ? "bg-blue-500" : "bg-slate-500"} rounded-full select-none`}
        >
          Debug
        </span>
      </div>
      <div className="grid grid-rows-10  gap-4 place-items-center w-[50%] h-[calc(100vh_-_56px)]">
        {debug && (
          <div className="row-span-5 place-self-start">
            <Editor
              defaultLanguage="html"
              height={"40vh"}
              width={"50vw"}
              theme="vs-dark"
              value={htmlResponse?.success ? htmlResponse?.data[1] : "Error"}
              options={{
                readOnly: true,
                lineNumbers: "off",
                wordWrap: "on",
                minimap: { enabled: false },
                showFoldingControls: "never",
              }}
            />
          </div>
        )}
        <div
          className={debug ? "row-span-5" : "row-span-10"}
          dangerouslySetInnerHTML={{ __html: htmlResponse?.data[0]! }}
        />
      </div>
    </>
  );
}
