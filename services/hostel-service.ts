import { Prisma } from "@prisma/client";
import { hostelApi } from "./api";

// Types
export enum HostelStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type Hostel = {
  id: string;
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
  images: string[];
  averageRating: number;
  reviewCount: number;
  availableRooms: number;
  lowestPrice: number;
  status: HostelStatus;
  totalRooms: number;
  rooms: {
    id: string;
    roomType: string;
    price: number;
    isAvailable: boolean;
  }[];
  admins?: { id: string; name?: string | null; email?: string | null }[];
};

export type HostelDetails = Prisma.HostelGetPayload<{
  include: {
    rooms: true;
    reviews: {
      include: {
        user: true;
      };
    };
  };
}> & {
  averageRating: number;
  reviewCount: number;
  availableRooms: number;
  lowestPrice: number;
  totalRooms: number;
};

export type Room = {
  id: string;
  roomNumber: string;
  roomType: string;
  description?: string;
  price: number;
  capacity: number;
  isAvailable: boolean;
  amenities: string[];
};

export type Review = {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    image?: string;
  };
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

// Fetch all hostels with optional filtering
export async function getHostels(params?: {
  city?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Hostel>> {
  return hostelApi.getAll(params);
}

// Fetch a single hostel by ID
export async function getHostelById(id: string): Promise<HostelDetails> {
  return hostelApi.getById(id);
}

// Create a new hostel
export async function createHostel(hostelData: {
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
}): Promise<Hostel> {
  const response = await fetch(`${baseUrl}/api/hostels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hostelData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create hostel");
  }

  return await response.json();
}

// Update a hostel
export async function updateHostel(
  id: string,
  hostelData: Partial<{
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
  }>
): Promise<Hostel> {
  const response = await fetch(`${baseUrl}/api/hostels/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hostelData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update hostel");
  }

  return await response.json();
}

// Delete a hostel
export async function deleteHostel(id: string): Promise<void> {
  const response = await fetch(`${baseUrl}/api/hostels/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete hostel");
  }
}
