import { NextResponse } from "next/server";
import { UserFactory } from "@/src/lib/factories/UserFactory";

export async function POST(req: Request) {
  const { name, email, role } = await req.json();
  const user = await UserFactory.createUser(name, email, role);
  return NextResponse.json(user);
}
