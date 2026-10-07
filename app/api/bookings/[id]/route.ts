import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

// Public endpoint: fetch one booking by ID (used after M-Pesa payment)
export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    booking: {
      id: booking.id,
      name: booking.name,
      service: booking.service,
      date: booking.date,
      status: booking.status,
      depositAmount: booking.depositAmount,
      mpesaReceipt: booking.mpesaReceipt,
    },
  });
}