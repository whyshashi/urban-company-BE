import { prisma } from "../prisma";

export class BookingFactory {
  static async bookSlot(userId: number, slotId: number) {
    return prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
        lock: { mode: "for update" }, // concurrency safe
      });

      if (!slot || slot.isBooked) {
        throw new Error("Slot already booked");
      }

      await tx.slot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return tx.booking.create({
        data: { userId, slotId, status: "CONFIRMED" },
      });
    });
  }

  static async cancelBooking(bookingId: number) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!booking) throw new Error("Booking not found");

      await tx.slot.update({
        where: { id: booking.slotId },
        data: { isBooked: false },
      });

      return tx.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" },
      });
    });
  }
}
