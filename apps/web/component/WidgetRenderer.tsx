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
  const auth = useAuth();
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

    if (text) fetchHtml();
  }, [text]);

  const onSave = async () => {
    setIsSaving(SaveStatus.saving);
    await saveWidget(db, auth.user, {
      ...JSON.parse(text!),
      preview: htmlResponse?.data[0],
    });
    setIsSaving(SaveStatus.saved);
    setTimeout(() => setIsSaving(SaveStatus.notSaved), 5000);
  };

  return (
    <>
      <div className="absolute bottom-10 right-10 flex gap-4">
        <span
          onClick={() => setDebug(!debug)}
          className={`cursor-pointer px-4 py-2 ${debug ? "bg-blue-500" : "bg-slate-500"} rounded-full select-none`}
        >
          Debug
        </span>
        <span
          onClick={onSave}
          className={`cursor-pointer px-4 py-2 bg-blue-600 rounded-full select-none`}
        >
          {isSaving}
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
