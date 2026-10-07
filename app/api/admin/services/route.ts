import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function guard() {
  const s = await getServerSession(authOptions);
  return !!s;
}
export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ services });
}
export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const row = await prisma.service.create({
    data: {
      icon: body.icon || "📸",
      title: body.title,
      description: body.description,
      sortOrder: body.sortOrder ?? 0,
      published: body.published ?? true,
    },
  });
  return NextResponse.json({ ok: true, row });
}

export async function PATCH(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...rest } = await req.json();
  const row = await prisma.service.update({ where: { id }, data: rest });
  return NextResponse.json({ ok: true, row });
}

export async function DELETE(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}