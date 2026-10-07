import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      icon: true,
      title: true,
      description: true,
      sortOrder: true,
    },
  });
  return NextResponse.json({ services });
}