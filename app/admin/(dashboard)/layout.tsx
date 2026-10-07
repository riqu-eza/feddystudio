import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/rates", label: "Packages" },
  { href: "/admin/portfolio", label: "Portfolio" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect if not logged in or not admin — unless on /admin/login
  // (login page renders without this layout guard)
 
  if (!session?.user?.isAdmin) {
  redirect("/admin/login");
}

  return (
    <div className="min-h-screen flex bg-bg text-light">
      {/* Sidebar */}
      <aside className="w-60 border-r border-line bg-card p-5 hidden md:block">
        <Link href="/" className="block text-lg font-extrabold tracking-[2px] mb-8">
          FEDDY <span className="text-gold">ADMIN</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-2 rounded hover:bg-[#1c1c1c] hover:text-gold text-sm"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        {session?.user && (
          <div className="mt-8 pt-4 border-t border-line text-xs text-muted">
            <p className="truncate">{session.user.email}</p>
            <Link
              href="/api/auth/signout"
              className="inline-block mt-2 text-gold hover:underline"
            >
              Sign out
            </Link>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">{children}</main>
    </div>
  );
}