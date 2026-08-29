"use client";
import Link from "next/link";
import { useAuth } from "../component/AuthContext";

export default function Home() {
  const auth = useAuth();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-300">
              eInk content studio
            </p>
            <h1 className="mt-3 text-4xl font-bold text-white">Design widgets and static pages for eInk displays.</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/create" className="rounded-full bg-sky-600 px-5 py-2.5 font-medium text-white transition hover:bg-sky-500">
              Create widget
            </Link>
            <Link href="/library" className="rounded-full border border-slate-600 bg-slate-800 px-5 py-2.5 font-medium text-slate-100 transition hover:border-slate-400">
              Open library
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Render API</p>
          <p className="mt-3 text-2xl font-semibold text-white">/api</p>
          <p className="mt-2 text-sm text-slate-300">Post a widget or static page payload to generate HTML for any eInk client.</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Saved items</p>
          <p className="mt-3 text-2xl font-semibold text-white">Library</p>
          <p className="mt-2 text-sm text-slate-300">Keep reusable widgets and page layouts organized by name and version.</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Usage</p>
          <p className="mt-3 text-2xl font-semibold text-white">Preview + ship</p>
          <p className="mt-2 text-sm text-slate-300">Review generated HTML, debug markup, and copy a curl snippet for deployment.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
        <h2 className="text-xl font-semibold text-white">What this app supports</h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>• Live widget rendering with generated HTML and debug markup.</li>
          <li>• Static page payloads for simple content screens without a full widget schema.</li>
          <li>• Saved library items for reuse across multiple eInk devices.</li>
          <li>• API-first output with copyable curl commands to integrate into external apps.</li>
        </ul>
      </section>

      {!auth.user && (
        <section className="rounded-2xl border border-amber-600/40 bg-amber-500/10 p-5 text-amber-100">
          Sign in to save widgets, manage the library, and access the full render pipeline.
        </section>
      )}
    </main>
  );
}
