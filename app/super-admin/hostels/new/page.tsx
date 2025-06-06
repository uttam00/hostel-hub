"use client";

import { useRouter } from "next/navigation";
import HostelForm from "@/components/hostel/HostelForm";
import { hostelApi } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Role } from "@prisma/client";

export default function NewHostelPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === Role.SUPER_ADMIN;
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await hostelApi.create(data);
      toast.success("Hostel created successfully");
      router.push(`/${isSuperAdmin ? "super-admin" : "hostel-admin"}/hostels`);
    } catch (error) {
      console.error("Error creating hostel:", error);
      toast.error("Failed to create hostel");
    }
  };

  return (
    <div className="container mx-auto pb-10">
      <h1 className="text-2xl font-bold mb-8">Add New Hostel</h1>
      <HostelForm onSubmit={handleSubmit} />
    </div>
  );
}
