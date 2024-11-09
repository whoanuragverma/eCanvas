"use client";

import { signOut, getAuth } from "firebase/auth";
import { app } from "../app/firebase";
import Link from "next/link";

export default function Header() {
  async function handleLogout() {
    await signOut(getAuth(app));

    await fetch("/api/logout");

    window.location.pathname = "/login";
  }

  return (
    <header className="px-4 py-3 grid grid-cols-8 gap-4 place-items-center">
      <h1 className="text-2xl place-self-start col-span-5">eCanvas</h1>
      <Link href="/" className="">
        Library
      </Link>
      <Link href="/create">Create Widget</Link>
      <Link href="#" onClick={handleLogout}>
        Logout
      </Link>
    </header>
  );
}
