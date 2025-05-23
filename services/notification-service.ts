import { notificationApi } from "./api";

export type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export async function getUserNotifications(): Promise<Notification[]> {
  const response = await notificationApi.getAll();
  return response;
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<Notification> {
  const response = await fetch(`/api/notifications/${notificationId}/read`, {
    method: "PUT",
  });
  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }
  return response.json();
}

export async function deleteNotification(
  notificationId: string
): Promise<void> {
  const response = await fetch(`/api/notifications/${notificationId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete notification");
  }
}
