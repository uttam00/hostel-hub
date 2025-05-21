import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  Menu
} from "lucide-react";
import { redirect } from "next/navigation";

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
              <AdminNavigation role={user.role} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sidebar */}
      <div className="hidden w-64 border-r bg-gray-50/40 md:block">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-auto py-2">
            <AdminNavigation role={user.role} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
