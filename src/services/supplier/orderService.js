import { api } from "../api";

export async function fetchOrders(params = {}) {
  const res = await api.get("/api/supplier/orders", { params });
  return res.data;
}

export async function fetchOrder(id) {
  const res = await api.get(`/api/supplier/orders/${id}`);
  return res.data;
}

export async function acceptOrder(id) {
  const res = await api.post(`/api/supplier/orders/${id}/accept`);
  return res.data;
}

export async function rejectOrder(id, reason) {
  const res = await api.post(`/api/supplier/orders/${id}/reject`, { reason });
  return res.data;
}

export async function shipOrder(id) {
  const res = await api.post(`/api/supplier/orders/${id}/ship`);
  return res.data;
}

export async function deliverOrder(id) {
  const res = await api.post(`/api/supplier/orders/${id}/deliver`);
  return res.data;
}

export async function proposePrice(id, proposedPrice, notes) {
  const res = await api.put(`/api/supplier/orders/${id}/propose-price`, {
    proposed_price: proposedPrice,
    notes,
  });
  return res.data;
}

export async function approveCancellation(id) {
  const res = await api.post(`/api/supplier/orders/${id}/approve-cancellation`);
  return res.data;
}

export async function rejectCancellation(id) {
  const res = await api.post(`/api/supplier/orders/${id}/reject-cancellation`);
  return res.data;
}

export async function updateStatus(id, status) {
  const res = await api.put(`/api/supplier/orders/${id}/status`, { status });
  return res.data;
}
