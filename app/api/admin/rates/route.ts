import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function guard() {
  const s = await getServerSession(authOptions);
  return !!s;
}

export async function GET() {
  const rates = await prisma.rate.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ rates });
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  const row = await prisma.rate.create({
    data: {
      icon: b.icon || "📸",
      title: b.title,
      price: b.price,
      items: b.items,           // array of strings
      ctaLabel: b.ctaLabel || "Book Now",
      ctaMessage: b.ctaMessage || "Hello FEDDY STUDIO...",
      sortOrder: b.sortOrder ?? 0,
      published: b.published ?? true,
    },
  });
  return NextResponse.json({ ok: true, row });
}

export async function PATCH(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...rest } = await req.json();
  const row = await prisma.rate.update({ where: { id }, data: rest });
  return NextResponse.json({ ok: true, row });
}

export async function DELETE(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await prisma.rate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}