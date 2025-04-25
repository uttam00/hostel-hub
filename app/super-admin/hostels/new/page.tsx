"use client";

import HostelForm from "@/app/components/HostelForm";
import { createHostel } from "@/services/hostel-service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewHostelPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createHostel(data);
      toast.success("Hostel created successfully");
      router.push("/super-admin/hostels");
    } catch (error) {
      console.error("Error creating hostel:", error);
      toast.error("Failed to create hostel");
    }
  };

  return (
    <div className="container mx-auto pb-8">
      <h1 className="text-2xl font-bold mb-8">Create New Hostel</h1>
      <HostelForm onSubmit={handleSubmit} />
    </div>
  );
}
