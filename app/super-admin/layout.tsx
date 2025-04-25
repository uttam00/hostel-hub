import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminNavigation } from "@/components/admin/AdminNavigation";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "SUPER_ADMIN") {
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
