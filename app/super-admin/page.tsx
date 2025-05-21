import DashboardCard from "@/components/dashboardCard";
import { getCurrentUser } from "@/lib/auth";
import { getHostels } from "@/services/hostel-service";
import { Building, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

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

  const cardData = [
    {
      title: "Total Hostels",
      count: totalHostels,
      description: "Manage all hostels and their admins",
      icon: Building,
      link: "/super-admin/hostels",
    },
    {
      title: "Total Hostel Admins",
      count: totalAdmins,
      description: "Manage hostel administrators",
      icon: Users,
      link: "/super-admin/admins",
    },
  ];

  return (
    <div className="container mx-auto pb-8">
      <h1 className="text-2xl font-bold mb-8">Super Admin Dashboard</h1>

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
