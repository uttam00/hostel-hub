import { bookingApi } from "./api";

// Types
export type Booking = {
  id: string;
  checkIn: string;
  checkOut: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  room: {
    id: string;
    roomNumber: string;
    roomType: string;
    price: number;
    hostel: {
      id: string;
      name: string;
      city: string;
      state: string;
    };
  };
  payments: Payment[];
};

export type BookingDetails = Booking & {
  user: {
    id: string;
    name?: string;
    email?: string;
  };
  room: {
    id: string;
    roomNumber: string;
    roomType: string;
    price: number;
    hostel: {
      id: string;
      name: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
};

export type Payment = {
  id: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  method?: string;
  createdAt: string;
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

// Fetch all bookings for the current user
export async function getBookings(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Booking>> {
  const searchParams = new URLSearchParams();

  if (params?.status) searchParams.append("status", params.status);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  const queryString = searchParams.toString();
  const url = `/api/bookings${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  const data = await response.json();

  return {
    data: data.bookings,
    pagination: data.pagination,
  };
}

// Fetch a single booking by ID
export async function getBookingById(id: string): Promise<BookingDetails> {
  const response = await bookingApi.getById(id);
  return response;
}

// Create a new booking
export async function createBooking(bookingData: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}): Promise<Booking> {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create booking");
  }

  return await response.json();
}

// Update a booking
export async function updateBooking(
  id: string,
  bookingData: Partial<{
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    checkIn: string;
    checkOut: string;
    totalPrice: number;
  }>
): Promise<Booking> {
  const response = await fetch(`/api/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update booking");
  }

  return await response.json();
}

// Cancel a booking
export async function cancelBooking(id: string): Promise<void> {
  const response = await fetch(`/api/bookings/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to cancel booking");
  }
}

// Create a payment for a booking
export async function createPayment(
  bookingId: string,
  paymentData: {
    amount: number;
    method: string;
  }
): Promise<Payment> {
  const response = await fetch(`/api/bookings/${bookingId}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create payment");
  }

  return await response.json();
}

// Get payments for a booking
export async function getPayments(bookingId: string): Promise<Payment[]> {
  const response = await fetch(`/api/bookings/${bookingId}/payments`);

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }

  return await response.json();
}

export async function getUserBookings(): Promise<BookingDetails[]> {
  const response = await bookingApi.getAll();
  return response.data;
}
