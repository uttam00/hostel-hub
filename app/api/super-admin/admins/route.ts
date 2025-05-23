import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import sgMail from "@sendgrid/mail";
import bcrypt from "bcryptjs";

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

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "";

if (!SENDGRID_API_KEY || !FROM_EMAIL) {
  throw new Error("Missing required environment variables for SendGrid");
}

sgMail.setApiKey(SENDGRID_API_KEY);
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const tempPassword = uuidv4().substring(0, 12);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email } = body;

    // Validate required fields
    if (!name || !email) {
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
        password: hashedPassword, // Note: In production, ensure password is hashed
        role: "HOSTEL_ADMIN",
      },
    });

    if (!admin.email) {
      return new NextResponse("Error while generating hostel admin", {
        status: 400,
      });
    }

    const msg = {
      to: admin.email,
      from: process.env.FROM_EMAIL!, // Your verified sender email address
      subject: "Your New Account Information",
      html: `
      <p>Hello ${admin.name},</p>
      <p>An administrator has created a new account for you on our platform.</p>
      <p>Your temporary password is: <strong>${tempPassword}</strong></p>
      <p>Please log in with this password and immediately change it to a password of your choice.</p>
      <p><a href="${process.env.FRONTEND_URL}/auth">Click here to log in</a></p>
      <p>Thank you,</p>
      <p>The Team</p>
    `,
    };
    
    await sgMail.send(msg);
    return NextResponse.json(admin);
  } catch (error) {
    console.error("[ADMINS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
