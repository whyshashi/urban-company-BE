import { NextResponse } from "next/server";
import { BookingFactory } from "@/src/app/api/lib/factories/BookingFactory";

export async function POST(req: Request) {
  try {
    const { userId, slotId } = await req.json();
    const booking = await BookingFactory.bookSlot(userId, slotId);
    return NextResponse.json(booking);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { bookingId } = await req.json();
    const booking = await BookingFactory.cancelBooking(bookingId);
    return NextResponse.json(booking);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
