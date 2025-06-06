import { NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { paymentSchema } from "@/lib/validation_schema"


// GET all payments for a booking
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        room: {
          include: {
            hostel: {
              include: {
                admins: {
                  where: { id: user.id },
                },
              },
            },
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if user has permission to view payments for this booking
    if (
      (user.role === "STUDENT" && booking.userId !== user.id) ||
      (user.role === "HOSTEL_ADMIN" && booking.room.hostel.admins.length === 0)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const payments = await prisma.payment.findMany({
      where: { bookingId: params.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

// POST create a new payment
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        payments: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Only the booking owner can make payments
    if (booking.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = paymentSchema.parse(body)

    // Calculate total paid amount
    const totalPaid = booking.payments.reduce((sum, payment) => {
      if (payment.status === "COMPLETED") {
        return sum + payment.amount
      }
      return sum
    }, 0)

    // Check if payment would exceed total price
    if (totalPaid + validatedData.amount > booking.totalPrice) {
      return NextResponse.json({ error: "Payment amount exceeds remaining balance" }, { status: 400 })
    }

    // Create the payment (in a real app, this would integrate with a payment processor)
    const payment = await prisma.payment.create({
      data: {
        amount: validatedData.amount,
        method: validatedData.method,
        status: "COMPLETED", // In a real app, this would initially be PENDING
        bookingId: params.id,
      },
    })

    // If this is the first payment, update booking status to CONFIRMED
    if (booking.status === "PENDING") {
      await prisma.booking.update({
        where: { id: params.id },
        data: { status: "CONFIRMED" },
      })
    }

    // If full payment is made, update room availability
    const newTotalPaid = totalPaid + validatedData.amount
    if (newTotalPaid >= booking.totalPrice) {
      // In a real app, you might want to mark the room as unavailable
      // only for the duration of the booking
      await prisma.room.update({
        where: { id: booking.roomId },
        data: { isAvailable: false },
      })
    }

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.flatten() }, { status: 400 })
    }
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
