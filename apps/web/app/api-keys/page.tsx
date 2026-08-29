"use client";

import { useEffect, useState } from "react";

interface ApiKeyRecord {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const loadKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/keys");
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to load API keys");
      }

      setKeys(json.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const generateKey = async () => {
    setError(null);
    setStatus(null);

    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `Eink app ${keys.length + 1}` }),
      });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to generate API key");
      }

      setStatus(`Generated key: ${json.data.key}`);
      await loadKeys();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Developer tools</p>
          <h1 className="mt-2 text-3xl font-bold text-white">API keys</h1>
        </div>
        <button
          onClick={generateKey}
          className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-500"
        >
          Generate key
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-500/10 p-3 text-red-200">
          {error}
        </div>
      )}

      {status && (
        <div className="mb-4 rounded border border-emerald-500 bg-emerald-500/10 p-3 text-emerald-200">
          {status}
        </div>
      )}

      <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
        {loading ? (
          <p className="text-slate-300">Loading keys…</p>
        ) : keys.length === 0 ? (
          <p className="text-slate-300">No API keys yet. Generate one to allow an eInk app to install widgets.</p>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <div key={key.id} className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{key.name}</p>
                    <p className="mt-1 font-mono text-sm text-slate-300">{key.key}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs ${key.enabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-600 text-slate-200"}`}>
                    {key.enabled ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
