"use client";
import Link from "next/link";
import { FirestoreWidget } from "../firestore/types";
import deleteWidget from "../firestore/deleteWidget";
import { db } from "../app/firebase";
import { useAuth } from "./AuthContext";
export default function Widget({ widget }: { widget: FirestoreWidget }) {
  const auth = useAuth();
  return (
    <div className="mx-3 my-2 border border-gray-600 rounded-md flex flex-col relative">
      <div
        className="px-3 py-2 h-[200px] grid place-items-center overflow-scroll"
        dangerouslySetInnerHTML={{ __html: widget.preview }}
      ></div>
      {widget.hooks?.some((hook) => hook.type === "REST") && (
        <div className="absolute text-[10px] bottom-16 my-1 mx-1.5 right-0 p-1 py-0.5 rounded-2xl bg-sky-700">
          Needs Internet
        </div>
      )}
      <div className="border-t border-gray-600 flex px-3 py-2">
        <div className="flex flex-col gap-1 justify-center">
          <span className="font-sans text-md">{widget.name}</span>
          <span className="text-xs font-thin">
            {widget.author} - {widget.version}
          </span>
        </div>
        <div className="ml-auto grid place-items-center grid-cols-2 gap-2">
          <Link
            className="p-3 bg-slate-200/15 rounded hover:bg-slate-200/25"
            href={`/create/${widget.name}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              />
            </svg>
          </Link>
          <button
            className="p-3 bg-red-500/15 rounded hover:bg-red-700/50"
            name="Delete"
            onClick={() => deleteWidget(db, auth.user, widget.name)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
