import { BookingDetails } from "./booking-service";

export type Payment = {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
  dueDate: string;
  paid: boolean;
  booking: BookingDetails;
};

export async function getUserPayments(): Promise<Payment[]> {
  const response = await fetch("/api/payments");
  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }
  return response.json();
}

export async function createPayment(
  bookingId: string,
  amount: number
): Promise<Payment> {
  const response = await fetch("/api/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookingId, amount }),
  });
  if (!response.ok) {
    throw new Error("Failed to create payment");
  }
  return response.json();
}
