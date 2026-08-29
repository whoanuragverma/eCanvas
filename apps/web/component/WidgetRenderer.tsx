"use client";
import { useEffect, useState } from "react";
import { ApiResponse } from "../app/api/route";
import { Editor } from "@monaco-editor/react";
import { db } from "../app/firebase";
import saveWidget from "../firestore/saveWidget";
import { useAuth } from "./AuthContext";

interface WidgetRendererProps {
  text?: string;
}
enum SaveStatus {
  notSaved = "Save",
  saving = "Saving",
  saved = "Saved",
}
export default function WidgetRenderer({ text }: WidgetRendererProps) {
  const [htmlResponse, setHtmlResponse] = useState<ApiResponse | undefined>();
  const [debug, setDebug] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<SaveStatus>(SaveStatus.notSaved);
  const [copied, setCopied] = useState<boolean>(false);
  const auth = useAuth();

  useEffect(() => {
    async function fetchHtml() {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const apiKey = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("api_key") ||
          new URLSearchParams(window.location.search).get("apiKey") ||
          new URLSearchParams(window.location.search).get("key")
        : null;

      if (apiKey) {
        headers["x-api-key"] = apiKey;
      }

      const response = await fetch("/api", {
        method: "POST",
        headers,
        body: JSON.stringify(text),
      });

      const html = (await response.json()) as ApiResponse;

      setHtmlResponse(html);
    }

    if (text) fetchHtml();
  }, [text]);

  const apiExample = text
    ? `curl -X POST "${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/api" -H "Content-Type: application/json" --data '${text.replace(/'/g, "'\\\"'\\\"'")}'`
    : "";

  const previewMarkup = Array.isArray(htmlResponse?.data) ? htmlResponse.data[0] ?? "" : "";
  const debugMarkup = htmlResponse?.success && Array.isArray(htmlResponse.data)
    ? htmlResponse.data[1] ?? ""
    : "Error";

  const onSave = async () => {
    if (!auth.user || !text) {
      return;
    }

    setIsSaving(SaveStatus.saving);
    await saveWidget(db, auth.user, {
      ...JSON.parse(text),
      preview: htmlResponse?.data[0],
    });
    setIsSaving(SaveStatus.saved);
    setTimeout(() => setIsSaving(SaveStatus.notSaved), 5000);
  };

  const onCopyApi = async () => {
    if (!apiExample) return;
    await navigator.clipboard.writeText(apiExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-1/2 min-w-0 flex-shrink-0">
      <div className="absolute bottom-10 right-10 flex flex-wrap gap-3 z-10">
        <span
          onClick={onCopyApi}
          className="cursor-pointer px-4 py-2 bg-slate-600 rounded-full select-none hover:bg-slate-500"
        >
          {copied ? "Copied" : "Copy API"}
        </span>
        <span
          onClick={() => setDebug(!debug)}
          className={`cursor-pointer px-4 py-2 ${debug ? "bg-blue-500" : "bg-slate-500"} rounded-full select-none`}
        >
          Debug
        </span>
        <span
          onClick={onSave}
          className={`cursor-pointer px-4 py-2 bg-blue-600 rounded-full select-none ${!auth.user ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSaving}
        </span>
      </div>
      <div className="grid grid-rows-10 gap-4 place-items-center w-full h-[calc(100vh_-_56px)] min-w-0">
        {debug && (
          <div className="row-span-5 place-self-start w-full min-w-0">
            <Editor
              defaultLanguage="html"
              height={"40vh"}
              width={"50vw"}
              theme="vs-dark"
              value={debugMarkup}
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
        <div className="w-full h-full flex items-center justify-center p-6 overflow-auto min-w-0">
          <div
            className={`${debug ? "row-span-5" : "row-span-10"} contents max-w-full min-w-0 contents`}
            dangerouslySetInnerHTML={{ __html: previewMarkup }}
          />
        </div>
      </div>
    </div>
  );
}
