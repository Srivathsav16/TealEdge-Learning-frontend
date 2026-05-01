export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://tealedge-backend.onrender.com";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("jwt_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "API Error");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};
