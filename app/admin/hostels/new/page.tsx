import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import NewHostelForm from "@/components/super-admin/NewHostelForm";

export default async function NewHostelPage() {
  try {
    const user = await getCurrentUser();
    console.log("Current user:", user); // Debug log

    if (!user) {
      console.log("No user found, redirecting to login"); // Debug log
      redirect("/auth/login");
    }

    if (user.role !== "SUPER_ADMIN") {
      console.log("User role is not SUPER_ADMIN:", user.role); // Debug log
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
  } catch (error) {
    console.error("Error in NewHostelPage:", error); // Debug log
    throw error; // Re-throw to show error page
  }
}
