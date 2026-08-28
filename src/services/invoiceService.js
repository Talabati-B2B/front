import { api } from "./api";

export async function fetchInvoice(id) {
  const res = await api.get(`/api/invoices/${id}`);
  return res.data;
}

export async function uploadPaymentProof(invoiceId, file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post(`/api/invoices/${invoiceId}/payment-proof`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function verifyPaymentProof(proofId) {
  const res = await api.post(`/api/payment-proofs/${proofId}/verify`);
  return res.data;
}

export async function rejectPaymentProof(proofId) {
  const res = await api.post(`/api/payment-proofs/${proofId}/reject`);
  return res.data;
}
