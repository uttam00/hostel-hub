import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Schema for booking update
const bookingUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  checkIn: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  checkOut: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  totalPrice: z.number().positive("Total price must be positive").optional(),
});

// GET a specific booking
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
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
                address: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
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
            method: true,
            createdAt: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if user has permission to view this booking
    if (
      (user.role === "STUDENT" && booking.userId !== user.id) ||
      (user.role === "HOSTEL_ADMIN" &&
        !(await isHostelAdmin(user.id, booking.room.hostel.id)))
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PUT update a booking
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        room: {
          select: {
            id: true,
            hostelId: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if user has permission to update this booking
    if (
      (user.role === "STUDENT" && booking.userId !== user.id) ||
      (user.role === "HOSTEL_ADMIN" &&
        !(await isHostelAdmin(user.id, booking.room.hostelId)))
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = bookingUpdateSchema.parse(body);

    // Additional validation for date changes
    if (
      validatedData.checkIn &&
      validatedData.checkOut &&
      validatedData.checkIn >= validatedData.checkOut
    ) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 }
      );
    }

    // If dates are changing, check for overlapping bookings
    if (validatedData.checkIn || validatedData.checkOut) {
      const checkIn = validatedData.checkIn || booking.checkIn;
      const checkOut = validatedData.checkOut || booking.checkOut;

      const overlappingBookings = await prisma.booking.findMany({
        where: {
          roomId: booking.roomId,
          id: { not: booking.id },
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
          OR: [
            {
              // New booking starts during an existing booking
              AND: [
                { checkIn: { lte: checkIn } },
                { checkOut: { gt: checkIn } },
              ],
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
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE a booking (cancel)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        room: {
          select: {
            id: true,
            hostelId: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if user has permission to cancel this booking
    if (
      (user.role === "STUDENT" && booking.userId !== user.id) ||
      (user.role === "HOSTEL_ADMIN" &&
        !(await isHostelAdmin(user.id, booking.room.hostelId)))
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only allow cancellation of pending or confirmed bookings
    if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: "Cannot cancel a booking that is not pending or confirmed" },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    await prisma.booking.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}

// Helper function to check if a user is an admin of a hostel
async function isHostelAdmin(userId: string, id: string): Promise<boolean> {
  const hostel = await prisma.hostel.findUnique({
    where: { id: id },
    include: {
      admins: {
        where: { id: userId },
      },
    },
  });

  return hostel?.admins.length ? hostel.admins.length > 0 : false;
}
