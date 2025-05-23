import { Role } from "@prisma/client";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

// Types
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
};

// Auth APIs
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },
};

// Hostel APIs
export const hostelApi = {
  getAll: async (params?: {
    city?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> => {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.append("city", params.city);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();
    const url = `${baseUrl}/api/hostels${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch hostels");
    const data = await response.json();
    return {
      data: data.hostels,
      pagination: data.pagination,
    };
  },

  getById: async (id: string) => {
    const response = await fetch(`${baseUrl}/api/hostels/${id}`);
    if (!response.ok) throw new Error("Failed to fetch hostel");
    return response.json();
  },

  create: async (hostelData: {
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    amenities: string[];
  }) => {
    const response = await fetch(`${baseUrl}/api/hostels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hostelData),
    });
    if (!response.ok) throw new Error("Failed to create hostel");
    return response.json();
  },

  update: async (
    id: string,
    hostelData: Partial<{
      name: string;
      description: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      amenities: string[];
    }>
  ) => {
    const response = await fetch(`${baseUrl}/api/hostels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hostelData),
    });
    if (!response.ok) throw new Error("Failed to update hostel");
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${baseUrl}/api/hostels/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete hostel");
  },
};

// Admin APIs
export const adminApi = {
  getAll: async () => {
    const response = await fetch("/api/super-admin/admins");
    if (!response.ok) throw new Error("Failed to fetch admins");
    return response.json();
  },

  create: async (adminData: { name: string; email: string }) => {
    const response = await fetch("/api/super-admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminData),
    });
    if (!response.ok) throw new Error("Failed to create admin");
    return response.json();
  },

  delete: async (adminId: string) => {
    const response = await fetch(`/api/super-admin/admins/${adminId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete admin");
  },

  assignHostel: async (adminId: string, hostelIds: string[]) => {
    const response = await fetch(
      `/api/super-admin/admins/${adminId}/assign-hostel`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostelIds }),
      }
    );
    if (!response.ok) throw new Error("Failed to assign hostel");
    return response.json();
  },
};

// Booking APIs
export const bookingApi = {
  getAll: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();
    const url = `/api/bookings${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch bookings");
    const data = await response.json();
    return {
      data: data.bookings,
      pagination: data.pagination,
    };
  },

  getById: async (id: string) => {
    const response = await fetch(`/api/bookings/${id}`);
    if (!response.ok) throw new Error("Failed to fetch booking");
    return response.json();
  },

  create: async (bookingData: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
  }) => {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) throw new Error("Failed to create booking");
    return response.json();
  },

  update: async (
    id: string,
    bookingData: Partial<{
      status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
      checkIn: string;
      checkOut: string;
      totalPrice: number;
    }>
  ) => {
    const response = await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) throw new Error("Failed to update booking");
    return response.json();
  },

  cancel: async (id: string) => {
    const response = await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to cancel booking");
  },
};

// Payment APIs
export const paymentApi = {
  getAll: async () => {
    const response = await fetch("/api/payments");
    if (!response.ok) throw new Error("Failed to fetch payments");
    return response.json();
  },

  create: async (paymentData: {
    bookingId: string;
    amount: number;
    method: string;
  }) => {
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) throw new Error("Failed to create payment");
    return response.json();
  },
};

// Notification APIs
export const notificationApi = {
  getAll: async () => {
    const response = await fetch("/api/notifications");
    if (!response.ok) throw new Error("Failed to fetch notifications");
    return response.json();
  },

  markAsRead: async (notificationId: string) => {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: "PUT",
    });
    if (!response.ok) throw new Error("Failed to mark notification as read");
    return response.json();
  },

  delete: async (notificationId: string) => {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete notification");
  },
};
