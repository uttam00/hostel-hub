import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CreditCard } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function HostelAdminDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "HOSTEL_ADMIN") {
    redirect("/");
  }

  // Get the hostel admin's hostels
  const hostels = await prisma.hostel.findMany({
    where: {
      admins: {
        some: {
          id: user.id,
        },
      },
    },
  });

  if (!hostels.length) {
    redirect("/");
  }

  // For simplicity, we'll use the first hostel
  const hostel = hostels[0];

  // Get statistics for the hostel
  const totalStudents = await prisma.user.count({
    where: {
      role: "STUDENT",
      bookings: {
        some: {
          room: {
            hostelId: hostel.id,
          },
        },
      },
    },
  });

  const totalBookings = await prisma.booking.count({
    where: {
      room: {
        hostelId: hostel.id,
      },
    },
  });

  const totalPayments = await prisma.payment.count({
    where: {
      booking: {
        room: {
          hostelId: hostel.id,
        },
      },
    },
  });

  return (
    <div className="container mx-auto pb-8">
      <h1 className="text-3xl font-bold mb-8">Hostel Admin Dashboard</h1>
      <h2 className="text-xl text-muted-foreground mb-8">{hostel.name}</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/hostel-admin/students">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Manage student enrollments
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/hostel-admin/bookings">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                View and manage bookings
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/hostel-admin/payments">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Payments
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPayments}</div>
              <p className="text-xs text-muted-foreground">
                Track payment history
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
