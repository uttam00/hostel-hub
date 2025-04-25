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

export type HostelDetails = Hostel & {
  rooms: Room[];
  reviews: Review[];
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
  const searchParams = new URLSearchParams();

  if (params?.city) searchParams.append("city", params.city);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  const queryString = searchParams.toString();
  const url = `${baseUrl}/api/hostels${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch hostels");
  }

  const data = await response.json();

  return {
    data: data.hostels,
    pagination: data.pagination,
  };
}

// Fetch a single hostel by ID
export async function getHostelById(id: string): Promise<HostelDetails> {
  const response = await fetch(`${baseUrl}/api/hostels/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch hostel");
  }

  return await response.json();
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
