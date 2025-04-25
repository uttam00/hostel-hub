import { getHostels } from "@/services/hostel-service";
import HostelManagement from "@/components/super-admin/HostelManagement";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const { data: hostels } = await getHostels();

  return (
    <div className="container mx-auto py-8">
      <HostelManagement hostels={hostels} />
    </div>
  );
}
