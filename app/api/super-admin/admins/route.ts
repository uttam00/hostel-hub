import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const admins = await prisma.user.findMany({
      where: {
        role: "HOSTEL_ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        hostels: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error("[ADMINS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if email already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    // Create new admin
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password, // Note: In production, ensure password is hashed
        role: "HOSTEL_ADMIN",
      },
    });

    return NextResponse.json(admin);
  } catch (error) {
    console.error("[ADMINS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
