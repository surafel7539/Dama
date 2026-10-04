const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

 const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
  ...options,
  headers,
});

const data = await response.json();

if (!response.ok) {
  console.error("Backend returned:", data);
  throw new Error(data.message || "Request failed");
}

return data;
};
export const addProductRating = (id, data) =>
  apiRequest(`/products/${id}/rating`, {
    method: "POST",
    body: JSON.stringify(data),
  });
export const deleteProductRating = async (productId) => {
  return apiRequest(`/products/${productId}/rating`, {
    method: "DELETE",
  });
};