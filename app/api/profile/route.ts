import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validation_schema";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    // Ensure user can only update their own profile
    if (validatedData.id !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First, check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: validatedData.id,
      },
      data: {
        name: validatedData.name,
        image: validatedData.image,
        phoneNumber: validatedData.phoneNumber,
      },
    });

    // Return the updated user data
    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      image: updatedUser.image,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);

    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
