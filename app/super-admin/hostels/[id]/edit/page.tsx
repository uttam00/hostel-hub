"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // <-- useParams
import HostelForm from "@/components/HostelForm";
import { getHostelById, updateHostel } from "@/services/hostel-service";
import { toast } from "sonner";

export default function EditHostelPage() {
  const router = useRouter();
  const params: { id: string }  = useParams(); // <-- use this
  const [hostel, setHostel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    const fetchHostel = async () => {
      try {
        const data = await getHostelById(params.id); // cast to string
        setHostel(data);
      } catch (error) {
        console.error("Error fetching hostel:", error);
        toast.error("Failed to fetch hostel details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHostel();
  }, [params]);

  const handleSubmit = async (data: any) => {
    try {
      await updateHostel(params.id, data);
      toast.success("Hostel updated successfully");
      router.push("/super-admin/hostels");
    } catch (error) {
      console.error("Error updating hostel:", error);
      toast.error("Failed to update hostel");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hostel) {
    return <div>Hostel not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Edit Hostel</h1>
      <HostelForm initialData={hostel} onSubmit={handleSubmit} />
    </div>
  );
}
