// Types
export type HostelAdmin = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

// Get all admins for a hostel
export async function getHostelAdmins(
  hostelId: string
): Promise<HostelAdmin[]> {
  const response = await fetch(`${baseUrl}/api/hostels/${hostelId}/admins`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch hostel admins");
  }

  return await response.json();
}

// Add an admin to a hostel
export async function addHostelAdmin(
  hostelId: string,
  userId: string
): Promise<void> {
  const response = await fetch(`/api/hostels/${hostelId}/admins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to add hostel admin");
  }
}

// Remove an admin from a hostel
export async function removeHostelAdmin(
  hostelId: string,
  userId: string
): Promise<void> {
  const response = await fetch(
    `/api/hostels/${hostelId}/admins?userId=${userId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to remove hostel admin");
  }
}
