import { api } from "./api";

export async function fetchMessages(orderId) {
  const res = await api.get(`/api/orders/${orderId}/messages`);
  return res.data;
}

export async function sendMessage(orderId, message, proposedPrice) {
  const payload = { message };
  if (proposedPrice != null) {
    payload.proposed_price = proposedPrice;
  }
  const res = await api.post(`/api/orders/${orderId}/messages`, payload);
  return res.data;
}
