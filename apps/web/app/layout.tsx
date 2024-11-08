import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "eCanvas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col bg-[#1e1e1e] text-white">
        <header className="px-4 py-3 grid grid-cols-6 gap-4 place-items-center">
          <h1 className="text-2xl place-self-start col-span-4">eCanvas</h1>
          <Link href="/" className="">
            Library
          </Link>
          <Link href="/">Create Widget</Link>
        </header>
        <div>{children}</div>
      </body>
    </html>
  );
}
