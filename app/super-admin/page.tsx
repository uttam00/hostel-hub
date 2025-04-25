import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getHostels } from "@/services/hostel-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users } from "lucide-react";
import Link from "next/link";

export default async function SuperAdminDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const { data: hostels } = await getHostels();
  const totalHostels = hostels.length;
  const totalAdmins = hostels.reduce(
    (acc, hostel) => acc + (hostel.admins?.length || 0),
    0
  );

  return (
    <div className="container mx-auto pb-8">
      <h1 className="text-2xl font-bold mb-8">Super Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/super-admin/hostels">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Hostels
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHostels}</div>
              <p className="text-xs text-muted-foreground">
                Manage all hostels and their admins
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/super-admin/admins">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Hostel Admins
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAdmins}</div>
              <p className="text-xs text-muted-foreground">
                Manage hostel administrators
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
