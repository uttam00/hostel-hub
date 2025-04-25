import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getHostels } from "@/services/hostel-service";
import HostelManagement from "@/components/super-admin/HostelManagement";

export default async function HostelsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const { data: hostels } = await getHostels();

  return (
    <div className="space-y-6">
      <HostelManagement hostels={hostels} />
    </div>
  );
}
