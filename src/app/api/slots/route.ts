import { NextResponse } from "next/server";
import { SlotFactory } from "@/src/lib/factories/SlotFactory";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const providerId = Number(searchParams.get("providerId"));

  if (!providerId) {
    return NextResponse.json({ error: "Provider ID required" }, { status: 400 });
  }

  const slots = await SlotFactory.getAvailableSlots(providerId);
  return NextResponse.json(slots);
}
