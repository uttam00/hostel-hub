"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHostel, updateHostel, Hostel } from "@/services/hostel-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import LocationPicker from "@/components/LocationPicker";

interface NewHostelFormProps {
  hostel?: Hostel;
  mode?: "create" | "edit";
}

export default function NewHostelForm({
  hostel,
  mode = "create",
}: NewHostelFormProps) {
  const router = useRouter();
  const { isSuperAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: hostel?.name || "",
    description: hostel?.description || "",
    address: hostel?.address || "",
    city: hostel?.city || "",
    state: hostel?.state || "",
    zipCode: hostel?.zipCode || "",
    country: hostel?.country || "",
    amenities: hostel?.amenities || ([] as string[]),
    latitude: hostel?.latitude || undefined,
    longitude: hostel?.longitude || undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate address field
    if (!formData.address || formData.address.length < 5) {
      toast.error("Address must be at least 5 characters long");
      setIsLoading(false);
      return;
    }

    try {
      if (mode === "create") {
        await createHostel(formData);
        toast.success("Hostel created successfully");
      } else if (hostel) {
        await updateHostel(hostel.id, formData);
        toast.success("Hostel updated successfully");
      }
      router.push(`/${isSuperAdmin ? "super-admin" : "admin"}/hostels`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        mode === "create"
          ? "Failed to create hostel"
          : "Failed to update hostel"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amenities = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, amenities }));
  };

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...location,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Hostel Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          minLength={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          minLength={10}
        />
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          initialAddress={formData.address}
          initialLatitude={formData.latitude}
          initialLongitude={formData.longitude}
        />
        {formData.address && formData.address.length < 5 && (
          <p className="text-sm text-red-500">
            Address must be at least 5 characters long
          </p>
        )}
        {formData.address && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <p className="text-sm font-medium">Current address:</p>
            <p className="text-sm">{formData.address}</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
        <Input
          id="amenities"
          name="amenities"
          value={formData.amenities.join(", ")}
          onChange={handleAmenitiesChange}
          placeholder="Wi-Fi, AC, Laundry, etc."
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading
          ? mode === "create"
            ? "Creating..."
            : "Updating..."
          : mode === "create"
          ? "Create Hostel"
          : "Update Hostel"}
      </Button>
    </form>
  );
}
