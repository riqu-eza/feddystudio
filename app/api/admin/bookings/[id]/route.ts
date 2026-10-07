import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json();
  const { status, depositType, depositValue } = body;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {};
  if (status) data.status = status;
  if (depositType) data.depositType = depositType;
  if (depositValue !== undefined) data.depositValue = Number(depositValue);

  if (depositType && depositValue !== undefined) {
    data.depositAmount = computeDeposit(depositType, Number(depositValue));
  }

  const updated = await prisma.booking.update({
    where: { id },
    data,
  });

  return NextResponse.json({ ok: true, booking: updated });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

function computeDeposit(type: string, value: number) {
  if (type === "fixed") return value;
  if (type === "percent") return value; // % used to compute at charge time
  return value; // custom
}