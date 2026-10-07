/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [today, pending, paidAgg, paidList, total, recent] =
      await Promise.all([
        prisma.booking.count({
          where: { date: { gte: start, lte: end } },
        }),
        prisma.booking.count({ where: { status: "pending" } }),
        prisma.booking.aggregate({
          where: { status: "paid" },
          _sum: { depositAmount: true },
          _count: { _all: true },
        }),
        prisma.booking.count({ where: { status: "paid" } }),
        prisma.booking.count(),
        prisma.booking.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            name: true,
            service: true,
            date: true,
            status: true,
          },
        }),
      ]);

    const revenue = paidAgg._sum.depositAmount ?? 0;

    return NextResponse.json({
      today,
      pending,
      paidCount: paidList,
      revenue,
      total,
      recent: recent.map((b) => ({
        ...b,
        date: b.date.toISOString().slice(0, 10),
      })),
    });
  } catch (err: any) {
    console.error("[stats]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load stats" },
      { status: 500 }
    );
  }
}
