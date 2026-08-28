// import { api } from "../api";

// export function fetchProducts(params = {}) {
//   return api.get("/api/supplier/products", { params });
// }

// export function fetchProduct(id) {
//   return api.get(`/api/supplier/products/${id}`);
// }

// export function createProduct(data) {
//   if (data instanceof FormData) {
//     return api.post("/api/supplier/products", data, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   }
//   return api.post("/api/supplier/products", data);
// }

// export function updateProduct(id, data) {
//   if (data instanceof FormData) {
//     data.append("_method", "PUT");
//     return api.post(`/api/supplier/products/${id}`, data, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   }
//   return api.put(`/api/supplier/products/${id}`, data);
// }

// export function deleteProduct(id) {
//   return api.delete(`/api/supplier/products/${id}`);
// }





// import { api } from "../api";

// export function fetchProducts(params = {}) {
//   return api.get("/api/supplier/products", { params });
// }

// export function fetchProduct(id) {
//   return api.get(`/api/supplier/products/${id}`);
// }

// export function createProduct(data) {
//   return api.post("/api/supplier/products", data);
// }

// export function updateProduct(id, data) {
//   if (data instanceof FormData) {
//     data.append("_method", "PUT");
//     return api.post(`/api/supplier/products/${id}`, data);
//   }
//   return api.put(`/api/supplier/products/${id}`, data);
// }

// export function deleteProduct(id) {
//   return api.delete(`/api/supplier/products/${id}`);
// }

import { api } from "../api";

export function fetchProducts(params = {}) {
  return api.get("/api/products", { params });
}

export function fetchProduct(id) {
  return api.get(`/api/products/${id}`);
}

export function createProduct(data) {
  return api.post("/api/products", data);
}

export function updateProduct(id, data) {
  if (data instanceof FormData) {
    data.append("_method", "PUT");
    return api.post(`/api/products/${id}`, data);
  }
  return api.put(`/api/products/${id}`, data);
}

export function deleteProduct(id) {
  return api.delete(`/api/products/${id}`);
}
