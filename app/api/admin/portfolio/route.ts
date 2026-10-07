import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function guard() {
  const s = await getServerSession(authOptions);
  return !!s;
}

export async function GET() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  const row = await prisma.portfolioItem.create({
    data: {
      title: b.title,
      caption: b.caption || null,
      category: b.category,
      imageUrl: b.imageUrl,
      sortOrder: b.sortOrder ?? 0,
      published: b.published ?? true,
    },
  });
  return NextResponse.json({ ok: true, row });
}

export async function PATCH(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...rest } = await req.json();
  const row = await prisma.portfolioItem.update({ where: { id }, data: rest });
  return NextResponse.json({ ok: true, row });
}

export async function DELETE(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await prisma.portfolioItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}