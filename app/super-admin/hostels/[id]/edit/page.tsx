import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getHostelById } from "@/services/hostel-service";
import NewHostelForm from "@/components/super-admin/NewHostelForm";

export default async function EditHostelPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const hostel = await getHostelById(params.id);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Hostel</h1>
        <NewHostelForm hostel={hostel} mode="edit" />
      </div>
    </div>
  );
}
