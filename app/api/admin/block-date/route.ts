import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, reason } = await req.json();
  const d = new Date(date + "T09:00:00");

  const row = await prisma.blockedDate.upsert({
    where: { date: d },
    update: { reason },
    create: { date: d, reason },
  });
  return NextResponse.json({ ok: true, row });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date } = await req.json();
  const d = new Date(date + "T09:00:00");
  await prisma.blockedDate.delete({ where: { date: d } });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const rows = await prisma.blockedDate.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json({ blocked: rows });
}