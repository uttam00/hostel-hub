"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HostelDetails } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ImageUpload from "../ImageUpload";
import LocationPicker from "@/components/LocationPicker";
import { HostelStatus } from "@prisma/client";
import { hostelSchema } from "@/lib/validation_schema";

type HostelFormData = Omit<
  HostelDetails,
  "id" | "rooms" | "reviews" | "createdAt" | "updatedAt"
>;

type HostelFormValues = {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  images: string[];
  country: string;
  status: HostelStatus;
  averageRating: number;
  reviewCount: number;
  availableRooms: number;
  lowestPrice: number;
  totalRooms: number;
};

interface HostelFormProps {
  initialData?: HostelFormData;
  onSubmit: (data: HostelFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function HostelForm({
  initialData,
  onSubmit,
  isLoading = false,
}: HostelFormProps) {
  const form = useForm<HostelFormValues>({
    resolver: zodResolver(hostelSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipCode: initialData?.zipCode || "",
      latitude: initialData?.latitude || 0,
      longitude: initialData?.longitude || 0,
      amenities: initialData?.amenities || [],
      images: initialData?.images || [],
      country: initialData?.country || "USA",
      status: initialData?.status ?? HostelStatus.ACTIVE,
      averageRating: initialData?.averageRating || 0,
      reviewCount: initialData?.reviewCount || 0,
      availableRooms: initialData?.availableRooms || 0,
      lowestPrice: initialData?.lowestPrice || 0,
      totalRooms: initialData?.totalRooms || 1,
    },
  });

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  }) => {
    form.setValue("address", location.address);
    form.setValue("city", location.city);
    form.setValue("state", location.state);
    form.setValue("zipCode", location.zipCode);
    form.setValue("country", location.country);
    form.setValue("latitude", location.latitude);
    form.setValue("longitude", location.longitude);
  };

  const handleSubmit = async (data: HostelFormValues) => {
    const formattedData: HostelFormData = {
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
      amenities: data.amenities,
      images: data.images,
      status: data.status,
      averageRating: data.averageRating,
      reviewCount: data.reviewCount,
      availableRooms: data.availableRooms,
      lowestPrice: data.lowestPrice,
      totalRooms: data.totalRooms,
    };
    console.log("Formatted data:", formattedData);
    await onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(handleSubmit, (errors) => {
            console.log("Form validation failed:", errors);
          })(e);
        }}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter hostel name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter hostel description"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Location</FormLabel>
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            initialAddress={form.getValues("address")}
            initialLatitude={form.getValues("latitude")}
            initialLongitude={form.getValues("longitude")}
          />
        </div>

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value.join(", ")}
                  onChange={(e) => {
                    const value = e.target.value;
                    const amenitiesArray = value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean);
                    field.onChange(amenitiesArray);
                  }}
                  placeholder="Enter amenities separated by commas"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={(urls) => field.onChange(urls)}
                  onRemove={(url) =>
                    field.onChange(field.value.filter((val) => val !== url))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value={HostelStatus.ACTIVE}>Active</option>
                  <option value={HostelStatus.INACTIVE}>Inactive</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalRooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Rooms</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
