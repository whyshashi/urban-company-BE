import { prisma } from "../prisma";

export class UserFactory {
  static async createUser(name: string, email: string, role: "USER" | "PROVIDER") {
    return prisma.user.create({ data: { name, email, role } });
  }

  static async getUserById(userId: number) {
    return prisma.user.findUnique({ where: { id: userId } });
  }
}
