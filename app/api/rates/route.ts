import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.rate.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  const rates = rows.map((r) => ({
    id: r.id,
    icon: r.icon,
    title: r.title,
    price: r.price,
    items: r.items as string[],
    ctaLabel: r.ctaLabel,
    ctaMessage: r.ctaMessage,
    sortOrder: r.sortOrder,
  }));

  return NextResponse.json({ rates });
}