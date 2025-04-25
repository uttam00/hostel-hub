import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { adminId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { adminId } = params;
    const { hostelId } = await req.json();

    if (!hostelId) {
      return NextResponse.json(
        { message: "Hostel ID is required" },
        { status: 400 }
      );
    }

    // Check if hostel exists and is active
    const hostel = await prisma.hostel.findUnique({
      where: { id: hostelId },
    });

    if (!hostel) {
      return NextResponse.json(
        { message: "Hostel not found" },
        { status: 404 }
      );
    }

    // Update admin with hostel assignment
    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: {
        hostelId,
      },
      include: {
        hostel: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error("Error assigning hostel to admin:", error);
    return NextResponse.json(
      { message: "Failed to assign hostel to admin" },
      { status: 500 }
    );
  }
}
