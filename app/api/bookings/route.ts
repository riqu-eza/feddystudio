import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  service: z.string().min(2),
  date: z.string().min(4),
  message: z.string().optional().nullable(),
  referral: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = schema.parse(json);

    const dateObj = new Date(data.date + "T09:00:00");

    // Block if already booked or in blocked list
    const alreadyBooked = await prisma.booking.findFirst({
      where: {
        date: dateObj,
        status: { in: ["pending", "paid"] },
      },
    });
    const blocked = await prisma.blockedDate.findUnique({
      where: { date: dateObj },
    });

    if (alreadyBooked || blocked) {
      return NextResponse.json(
        { ok: false, error: "Date is not available." },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        name: data.name,
        phone: data.phone,
        service: data.service,
        date: dateObj,
        message: data.message ?? null,
        referral: data.referral ?? null,
      },
    });

    return NextResponse.json({ ok: true, booking });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Invalid request" },
      { status: 400 }
    );
  }
}

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { date: "asc" },
  });
  return NextResponse.json({ bookings });
}