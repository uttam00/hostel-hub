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
  latitude?: string;
  longitude?: string;
  amenities: string;
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

const hostelFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  amenities: z.string().min(1, "At least one amenity is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  country: z.string().default("USA"),
  status: z.nativeEnum(HostelStatus).default(HostelStatus.ACTIVE),
  averageRating: z.number().default(0),
  reviewCount: z.number().default(0),
  availableRooms: z.number().default(0),
  lowestPrice: z.number().default(0),
  totalRooms: z.number().default(0),
});

export default function HostelForm({
  initialData,
  onSubmit,
  isLoading = false,
}: HostelFormProps) {
  const form = useForm<HostelFormValues>({
    resolver: zodResolver(hostelFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipCode: initialData?.zipCode || "",
      latitude: initialData?.latitude?.toString() || "",
      longitude: initialData?.longitude?.toString() || "",
      amenities: initialData?.amenities.join(", ") || "",
      images: initialData?.images || [],
      country: initialData?.country || "USA",
      status: initialData?.status ?? HostelStatus.ACTIVE,
      averageRating: initialData?.averageRating || 0,
      reviewCount: initialData?.reviewCount || 0,
      availableRooms: initialData?.availableRooms || 0,
      lowestPrice: initialData?.lowestPrice || 0,
      totalRooms: initialData?.totalRooms || 0,
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
    form.setValue("latitude", location.latitude.toString());
    form.setValue("longitude", location.longitude.toString());
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
      latitude: parseFloat(data.latitude ?? "0"),
      longitude: parseFloat(data.longitude ?? "0"),
      amenities: data.amenities.split(",").map((item) => item.trim()),
      images: data.images,
      status: data.status,
      averageRating: data.averageRating,
      reviewCount: data.reviewCount,
      availableRooms: data.availableRooms,
      lowestPrice: data.lowestPrice,
      totalRooms: data.totalRooms,
    };
    await onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
            initialLatitude={
              form.getValues("latitude")
                ? parseFloat(form.getValues("latitude") ?? "")
                : undefined
            }
            initialLongitude={
              form.getValues("longitude")
                ? parseFloat(form.getValues("longitude") ?? "")
                : undefined
            }
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
