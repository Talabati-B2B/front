import { api } from "./api";

export async function fetchNotifications(params = {}) {
  const res = await api.get("/api/notifications", { params });
  return res.data;
}

export async function fetchUnreadCount() {
  const res = await api.get("/api/notifications/unread-count");
  return res.data?.data?.count ?? res.data?.count ?? 0;
}

export async function markAsRead(id) {
  const res = await api.post(`/api/notifications/${id}/read`);
  return res.data;
}

export async function markAllAsRead() {
  const res = await api.post("/api/notifications/read-all");
  return res.data;
}

export async function deleteNotification(id) {
  const res = await api.delete(`/api/notifications/${id}`);
  return res.data;
}
