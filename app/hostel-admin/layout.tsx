import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import {
  Building,
  Home,
  LogOut,
  Menu,
  Users,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "next-auth/react";
import prisma from "@/lib/prisma";

export default async function HostelAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "HOSTEL_ADMIN") {
    redirect("/");
  }

  // Get the hostel admin's hostel
  const hostel = await prisma.hostel.findFirst({
    where: {
      admins: {
        some: {
          id: user.id,
        },
      },
    },
    include: {
      admins: true,
    },
  });

  if (!hostel) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                <Link
                  href="/hostel-admin"
                  className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/hostel-admin/students"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
                >
                  <Users className="h-4 w-4" />
                  Students
                </Link>
                <Link
                  href="/hostel-admin/bookings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
                >
                  <Calendar className="h-4 w-4" />
                  Bookings
                </Link>
                <Link
                  href="/hostel-admin/payments"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
                >
                  <CreditCard className="h-4 w-4" />
                  Payments
                </Link>
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col border-r">
        <div className="flex h-14 items-center border-b px-4">
          <Link
            href="/hostel-admin"
            className="flex items-center gap-2 font-semibold"
          >
            <Building className="h-6 w-6" />
            <span>{hostel.name}</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              href="/hostel-admin"
              className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/hostel-admin/students"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <Users className="h-4 w-4" />
              Students
            </Link>
            <Link
              href="/hostel-admin/bookings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <Calendar className="h-4 w-4" />
              Bookings
            </Link>
            <Link
              href="/hostel-admin/payments"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <CreditCard className="h-4 w-4" />
              Payments
            </Link>
          </nav>
        </div>
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="ml-2">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
