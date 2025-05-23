import DashboardCard from "@/components/dashboardCard";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { Calendar, CreditCard, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HostelAdminDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== Role.HOSTEL_ADMIN) {
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

  // For simplicity, we'll use the first hostel
  const hostel = hostels[0];

  // Get statistics for the hostel
  const totalStudents = !hostel
    ? 0
    : await prisma.user.count({
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

  const totalBookings = !hostel
    ? 0
    : await prisma.booking.count({
        where: {
          room: {
            hostelId: hostel.id,
          },
        },
      });

  const totalPayments = !hostel
    ? 0
    : await prisma.payment.count({
        where: {
          booking: {
            room: {
              hostelId: hostel.id,
            },
          },
        },
      });

  const cardData = [
    {
      title: "Total Students",
      count: totalStudents,
      description: "Manage student enrollments",
      icon: Users,
      link: "/hostel-admin/students",
    },
    {
      title: "Total Bookings",
      count: totalBookings,
      description: "View and manage all bookings",
      icon: Calendar,
      link: "/hostel-admin/bookings",
    },
    {
      title: "Total Payments",
      count: totalPayments,
      description: "View and manage all payments",
      icon: CreditCard,
      link: "/hostel-admin/payments",
    },
  ];

  return (
    <div className="container mx-auto pb-8">
      <h1 className="text-2xl font-bold mb-8">Hostel Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cardData.map(({ count, description, icon, link, title }, index) => {
          return (
            <Link href={link} key={`${index}-${title}`}>
              <DashboardCard
                cardDescription={description}
                cardIcon={icon}
                cardTitle={title}
                count={count}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
