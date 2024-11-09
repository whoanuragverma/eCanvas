"use client";
import { useAuth } from "../component/AuthContext";

export default function Home() {
  const auth = useAuth();

  return <div className="flex">{JSON.stringify(auth.user)}</div>;
}
