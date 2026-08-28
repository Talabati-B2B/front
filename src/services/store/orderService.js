import { api } from "../api";

export async function checkout() {
  const res = await api.post("/api/store/checkout");
  return res.data;
}

export async function createNegotiatedOrder(data) {
  const res = await api.post("/api/store/orders/negotiated", data);
  return res.data;
}

export async function fetchOrders(params = {}) {
  const res = await api.get("/api/store/orders", { params });
  return res.data;
}

export async function fetchOrder(id) {
  const res = await api.get(`/api/store/orders/${id}`);
  return res.data;
}

export async function cancelOrder(id, reason) {
  const res = await api.post(`/api/store/orders/${id}/cancel`, { reason });
  return res.data;
}

export async function acceptOffer(id) {
  const res = await api.post(`/api/store/orders/${id}/accept-offer`);
  return res.data;
}

export async function rejectOffer(id) {
  const res = await api.post(`/api/store/orders/${id}/reject-offer`);
  return res.data;
}

export async function confirmDelivery(id) {
  const res = await api.post(`/api/store/orders/${id}/confirm-delivery`);
  return res.data;
}

export async function requestRefund(id, reason) {
  const res = await api.post(`/api/store/orders/${id}/request-refund`, { reason });
  return res.data;
}
