import { api } from "./api";

// Login
export const login = async (credentials) => {
  const res = await api.post("/api/login", credentials);
  return res.data;
};

// register
export const register = async (data) => {
  const formData = new FormData();

  // step one data
  formData.append("first_name", data.firstName);
  formData.append("last_name", data.lastName);
  formData.append("email", data.email);
  formData.append("mobile", data.phone);
  formData.append("ID_number", data.idNumber);
  formData.append("password", data.password);
  formData.append("password_confirmation", data.confirmPassword);
  formData.append("role", data.role);

  // step three data
  if (data.role === "store") {
    formData.append("store_name", data.businessName);
    formData.append("store_location", data.location);
    formData.append("store_type_id", data.businessType);

    if (data.docFile) {
      formData.append("commercial_register", data.docFile);
    }
  }

  if (data.role === "supplier") {
    formData.append("company_name", data.businessName);
    formData.append("company_location", data.location);
    formData.append("category_id", data.businessType);

    if (data.docFile) {
      formData.append("commercial_register", data.docFile);
    }
  }

  // نرجّع جسم الرد (access_token + user) ليدخل الفرونت المستخدم مباشرة لشاشة المراجعة
  const res = await api.post("/api/register", formData);
  return res.data;
};

// forget password
export const forgotPassword = (email) => {
  return api.post("/api/forgot-password", { email });
};

// reset password
export const resetPassword = (data) => {
  return api.post("/api/reset-password", {
    token: data.token,
    email: data.email,
    password: data.password,
    password_confirmation: data.confirmPassword,
  });
};

// logout
export const logout = async () => {
  const res = await api.post("/api/logout");
  return res.data;
};

// get current user
export const getMe = async () => {
  const res = await api.get("/api/user");
  return res.data;
};
