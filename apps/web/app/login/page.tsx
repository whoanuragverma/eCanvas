"use client";

import { FormEvent, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const credential = await signInWithEmailAndPassword(
        getAuth(app),
        email,
        password
      );
      const idToken = await credential.user.getIdToken();

      await fetch("/api/login", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      window.location.pathname = "/";
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-neutral-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 md:space-y-6"
            action="#"
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                className="sm:text-sm rounded-lg block w-full p-2.5 bg-neutral-600 border-gray-600 placeholder-neutral-400text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="••••••••"
                className="sm:text-sm rounded-lg block w-full p-2.5 bg-neutral-600 border-gray-600 placeholder-neutral-400text-white focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {error && (
              <div className="text-red-500" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
