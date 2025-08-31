import { prisma } from "../prisma";

export class SlotFactory {
  static async createSlot(providerId: number, startTime: Date, endTime: Date, price: number) {
    return prisma.slot.create({
      data: { providerId, startTime, endTime, price },
    });
  }

  static async getAvailableSlots(providerId: number) {
    return prisma.slot.findMany({
      where: { providerId, isBooked: false },
    });
  }
}
