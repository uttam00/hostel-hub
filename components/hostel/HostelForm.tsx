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
import { Hostel, HostelStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ImageUpload from "../ImageUpload";
import LocationPicker from "@/components/LocationPicker";
import { hostelSchema } from "@/lib/validation_schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";

type ImageFile = {
  file: File;
  preview: string;
};

const ROOM_TYPES = [
  "ONE_SHARING",
  "TWO_SHARING",
  "THREE_SHARING",
  "FOUR_SHARING",
] as const;
type RoomTypeValue = (typeof ROOM_TYPES)[number];

type RoomType = {
  type: RoomTypeValue;
  images: ImageFile[];
};

type HostelFormData = Omit<
  Hostel,
  "id" | "rooms" | "admins" | "createdAt" | "updatedAt"
> & {
  roomTypes: RoomType[];
};

type HostelFormValues = {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  images: Array<{ file: File; preview: string }>;
  roomTypes: Array<{
    type: RoomTypeValue;
    images: Array<{ file: File; preview: string }>;
  }>;
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
      images:
        initialData?.images.map((url) => ({
          file: new File([], url),
          preview: url,
        })) || [],
      roomTypes: initialData?.roomTypes?.map((rt) => ({
        type: rt.type as RoomTypeValue,
        images: rt.images.map((url) => ({
          file: new File([], url),
          preview: url,
        })),
      })) || [
        { type: "ONE_SHARING", images: [] },
        { type: "TWO_SHARING", images: [] },
        { type: "THREE_SHARING", images: [] },
        { type: "FOUR_SHARING", images: [] },
      ],
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
    try {
      // Upload hostel images
      const hostelImageUrls = await Promise.all(
        data.images.map(async (imageFile) => {
          // If it's an existing image (no file property or empty file), return the preview URL directly
          if (!imageFile.file || imageFile.file.size === 0) {
            return imageFile.preview;
          }

          const formData = new FormData();
          formData.append("file", imageFile.file);
          formData.append("folderName", "hostels");

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to upload hostel image");
          }

          const result = await response.json();
          return result.url;
        })
      );

      // Upload room type images
      const roomTypeImageUrls = await Promise.all(
        data.roomTypes.map(async (roomType) => {
          const imageUrls = await Promise.all(
            roomType.images.map(async (imageFile) => {
              // If it's an existing image (no file property or empty file), return the preview URL directly
              if (!imageFile.file || imageFile.file.size === 0) {
                return imageFile.preview;
              }

              const formData = new FormData();
              formData.append("file", imageFile.file);
              formData.append(
                "folderName",
                `hostels/rooms/${roomType.type.toLowerCase()}`
              );

              const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              if (!response.ok) {
                throw new Error(`Failed to upload ${roomType.type} room image`);
              }

              const result = await response.json();
              return result.url;
            })
          );

          return {
            type: roomType.type,
            images: imageUrls,
          };
        })
      );

      const formattedData: HostelFormData = {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        latitude: data.latitude ? Number(data.latitude) : 0,
        longitude: data.longitude ? Number(data.longitude) : 0,
        amenities: data.amenities,
        images: hostelImageUrls,
        roomTypes: roomTypeImageUrls,
        status: data.status,
        averageRating: data.averageRating,
        reviewCount: data.reviewCount,
        availableRooms: data.availableRooms,
        lowestPrice: data.lowestPrice,
        totalRooms: data.totalRooms,
      };

      await onSubmit(formattedData);
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
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

        <div className="space-y-4">
          <FormLabel>Hostel Images</FormLabel>
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-4">
                    <ImageUpload
                      hideLabel
                      value={field.value}
                      onChange={(files) => field.onChange(files)}
                      onRemove={(index) => {
                        const newImages = [...field.value];
                        newImages.splice(index, 1);
                        field.onChange(newImages);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormLabel>Room Types</FormLabel>
          <Tabs defaultValue="ONE_SHARING" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {ROOM_TYPES.map((type) => (
                <TabsTrigger key={type} value={type}>
                  {type
                    .split("_")
                    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                    .join(" ")}
                </TabsTrigger>
              ))}
            </TabsList>
            {ROOM_TYPES.map((type) => (
              <TabsContent key={type} value={type}>
                <FormField
                  control={form.control}
                  name="roomTypes"
                  render={({ field }) => {
                    const roomType = field.value.find(
                      (rt) => rt.type === type
                    ) || { type, images: [] };
                    const index = field.value.findIndex(
                      (rt) => rt.type === type
                    );

                    return (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            hideLabel
                            value={roomType.images}
                            onChange={(files) => {
                              const newRoomTypes = [...field.value];
                              if (index === -1) {
                                newRoomTypes.push({ type, images: files });
                              } else {
                                newRoomTypes[index] = { type, images: files };
                              }
                              field.onChange(newRoomTypes);
                            }}
                            onRemove={(imgIndex) => {
                              const newRoomTypes = [...field.value];
                              if (index !== -1) {
                                newRoomTypes[index] = {
                                  type,
                                  images: roomType.images.filter(
                                    (_, i) => i !== imgIndex
                                  ),
                                };
                                field.onChange(newRoomTypes);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>

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
