"use client";

import HostelManagement from "@/components/common-in-admin/HostelManagement";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { hostelApi } from "@/services/api";
import { Hostel } from "@/types";
import { useEffect, useState } from "react";

export default function HostelsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch hostels data
  const fetchHostels = async () => {
    try {
      const response = await hostelApi.getAll();
      setHostels(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hostels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  return (
    <div className="container mx-auto pb-8">
      <HostelManagement
        hostels={hostels}
        userRole={user ? user.role : ""}
        loading={loading}
      />
    </div>
  );
}
