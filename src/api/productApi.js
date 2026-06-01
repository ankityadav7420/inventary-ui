import api from "../services/axiosInstance";

/**
 * List Products
 */
export const getProducts = async () => {
  const response = await api.get(
    "/api/v1/products"
  );

  return response.data;
};

/**
 * Get Product
 */
export const getProductById = async (
  productId
) => {
  const response = await api.get(
    `/api/v1/products/${productId}`
  );

  return response.data;
};

/**
 * Create Product
 */
export const createProduct = async (
  payload
) => {
  const response = await api.post(
    "/api/v1/products",
    payload
  );

  return response.data;
};

/**
 * Update Product
 */
export const updateProduct = async (
  productId,
  payload
) => {
  const response = await api.put(
    `/api/v1/products/${productId}`,
    payload
  );

  return response.data;
};

/**
 * Delete Product
 */
export const deleteProduct = async (
  productId
) => {
  const response = await api.delete(
    `/api/v1/products/${productId}`
  );

  return response.data;
};