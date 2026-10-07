import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LoginButton from "./LoginButton";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user?.isAdmin) redirect("/admin");

  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-light">
      <div className="w-full max-w-sm p-6 border border-line bg-card rounded space-y-4 text-center">
        <h1 className="text-xl font-extrabold tracking-[2px]">
          FEDDY <span className="text-gold">ADMIN</span>
        </h1>
        {error && (
          <p className="text-sm text-red-400">
            {error === "AccessDenied"
              ? "That Google account isn't an admin."
              : "Sign-in failed. Try again."}
          </p>
        )}
        <LoginButton />
      </div>
    </div>
  );
}