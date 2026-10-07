import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function isAuthorizedEmail(email?: string | null) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 hours
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    async signIn({ user }) {
      if (!isAuthorizedEmail(user.email)) return false;

      if (user.email) {
        await prisma.admin.upsert({
          where: { email: user.email },
          update: { name: user.name ?? undefined, image: user.image ?? undefined },
          create: {
            email: user.email,
            name: user.name ?? null,
            image: user.image ?? null,
          },
        });
      }
      return true;
    },
    async jwt({ token }) {
      // re-checked on every request, so removing an email from ADMIN_EMAILS revokes access
      token.isAdmin = isAuthorizedEmail(token.email);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.isAdmin = !!token.isAdmin;
      }
      return session;
    },
  },
};