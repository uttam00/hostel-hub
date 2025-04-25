import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Schema for hostel update
const hostelUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .optional(),
  city: z.string().min(2, "City must be at least 2 characters").optional(),
  state: z.string().min(2, "State must be at least 2 characters").optional(),
  zipCode: z
    .string()
    .min(5, "Zip code must be at least 5 characters")
    .optional(),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

// GET a specific hostel
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hostel = await prisma.hostel.findUnique({
      where: { id: params.id },
      include: {
        rooms: {
          select: {
            id: true,
            roomNumber: true,
            roomType: true,
            description: true,
            price: true,
            capacity: true,
            isAvailable: true,
            amenities: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!hostel) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    // Calculate average rating
    const totalRatings = hostel.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      hostel.reviews.length > 0 ? totalRatings / hostel.reviews.length : 0;

    return NextResponse.json({
      ...hostel,
      averageRating,
      reviewCount: hostel.reviews.length,
    });
  } catch (error) {
    console.error("Error fetching hostel:", error);
    return NextResponse.json(
      { error: "Failed to fetch hostel" },
      { status: 500 }
    );
  }
}

// PUT update a hostel
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an admin of this hostel or a super admin
    const hostel = await prisma.hostel.findUnique({
      where: { id: params.id },
      include: {
        admins: {
          where: { id: user.id },
        },
      },
    });

    if (!hostel) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    if (hostel.admins.length === 0 && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = hostelUpdateSchema.parse(body);

    const updatedHostel = await prisma.hostel.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedHostel);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Error updating hostel:", error);
    return NextResponse.json(
      { error: "Failed to update hostel" },
      { status: 500 }
    );
  }
}

// DELETE a hostel
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const hostel = await prisma.hostel.findUnique({
      where: { id: params.id },
    });

    if (!hostel) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    await prisma.hostel.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Hostel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hostel:", error);
    return NextResponse.json(
      { error: "Failed to delete hostel" },
      { status: 500 }
    );
  }
}
