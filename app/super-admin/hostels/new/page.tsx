import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import NewHostelForm from "@/components/super-admin/NewHostelForm";

export default async function NewHostelPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Hostel</h1>
        <NewHostelForm />
      </div>
    </div>
  );
}
