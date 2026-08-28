import { api } from "../api";

export async function fetchMarketplaceData() {
  const res = await api.get("/api/store/marketplace/data");
  return res.data;
}

export async function searchProducts(params = {}) {
  const res = await api.get("/api/search/products", { params });
  return res.data;
}

export async function searchSuppliers(params = {}) {
  const res = await api.get("/api/search/suppliers", { params });
  return res.data;
}

export async function searchByImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/api/search/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
