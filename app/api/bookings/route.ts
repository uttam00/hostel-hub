import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createBookingSchema } from "@/lib/validation_schema";

// GET all bookings for the current user
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit") as string)
      : 10;
    const page = searchParams.get("page")
      ? Number.parseInt(searchParams.get("page") as string)
      : 1;
    const skip = (page - 1) * limit;

    // Build the where clause based on user role and query params
    const where: any = {};

    if (user.role === "STUDENT") {
      // Students can only see their own bookings
      where.userId = user.id;
    } else if (user.role === "HOSTEL_ADMIN") {
      // Hostel admins can see bookings for their hostels
      where.room = {
        hostel: {
          admins: {
            some: {
              id: user.id,
            },
          },
        },
      };
    }
    // Super admins can see all bookings

    // Add status filter if provided
    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            roomType: true,
            price: true,
            hostel: {
              select: {
                id: true,
                name: true,
                city: true,
                state: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const total = await prisma.booking.count({ where });

    return NextResponse.json({
      bookings,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST create a new booking
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createBookingSchema.parse(body);

    // Check if room exists and is available
    const room = await prisma.room.findUnique({
      where: {
        id: validatedData.roomId,
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (!room.isAvailable) {
      return NextResponse.json(
        { error: "Room is not available" },
        { status: 400 }
      );
    }

    // Check for date validity
    const checkIn = validatedData.checkIn;
    const checkOut = validatedData.checkOut;

    if (checkIn >= checkOut) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 }
      );
    }

    if (checkIn < new Date()) {
      return NextResponse.json(
        { error: "Check-in date cannot be in the past" },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        roomId: validatedData.roomId,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        OR: [
          {
            // New booking starts during an existing booking
            AND: [{ checkIn: { lte: checkIn } }, { checkOut: { gt: checkIn } }],
          },
          {
            // New booking ends during an existing booking
            AND: [
              { checkIn: { lt: checkOut } },
              { checkOut: { gte: checkOut } },
            ],
          },
          {
            // New booking completely contains an existing booking
            AND: [
              { checkIn: { gte: checkIn } },
              { checkOut: { lte: checkOut } },
            ],
          },
        ],
      },
    });

    if (overlappingBookings.length > 0) {
      return NextResponse.json(
        { error: "Room is already booked for the selected dates" },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        checkIn,
        checkOut,
        totalPrice: validatedData.totalPrice,
        status: "PENDING",
        userId: user.id,
        roomId: validatedData.roomId,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
