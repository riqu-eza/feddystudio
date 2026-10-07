import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [booked, blocked] = await Promise.all([
    prisma.booking.findMany({
      where: { status: { in: ["pending", "paid"] } },
      select: { date: true },
    }),
    prisma.blockedDate.findMany({ select: { date: true } }),
  ]);

  const toKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const set = new Set<string>();
  booked.forEach((b) => set.add(toKey(b.date)));
  blocked.forEach((b) => set.add(toKey(b.date)));

  return NextResponse.json({ booked: Array.from(set) });
}