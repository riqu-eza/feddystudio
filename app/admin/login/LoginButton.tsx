"use client";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/admin" })}
      className="w-full p-3 bg-gold text-black font-bold rounded"
    >
      Sign in with Google
    </button>
  );
}