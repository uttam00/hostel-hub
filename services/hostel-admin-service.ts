import { adminApi } from "./api";

// Types
export type HostelAdmin = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  hostels: Array<{ id: string }>;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

// Get all admins for a hostel
export async function getHostelAdmins(
  hostelId: string
): Promise<HostelAdmin[]> {
  const response = await adminApi.getAll();
  return response.filter((admin: HostelAdmin) =>
    admin.hostels.some((hostel) => hostel.id === hostelId)
  );
}

// Add an admin to a hostel
export async function addHostelAdmin(
  hostelId: string,
  userId: string
): Promise<void> {
  await adminApi.assignHostel(userId, [hostelId]);
}

// Remove an admin from a hostel
export async function removeHostelAdmin(
  hostelId: string,
  userId: string
): Promise<void> {
  const admin = await adminApi
    .getAll()
    .then((admins) => admins.find((a: HostelAdmin) => a.id === userId));

  if (admin) {
    const remainingHostels = admin.hostels
      .filter((h: { id: string }) => h.id !== hostelId)
      .map((h: { id: string }) => h.id);

    await adminApi.assignHostel(userId, remainingHostels);
  }
}
