import api from "../services/axiosInstance";

export const getOrders =
  async () => {
    const { data } =
      await api.get(
        "/api/v1/orders"
      );

    return data;
  };

export const getOrderById =
  async (id) => {
    const { data } =
      await api.get(
        `/api/v1/orders/${id}`
      );

    return data;
  };

export const createOrder =
  async (payload) => {
    const { data } =
      await api.post(
        "/api/v1/orders",
        payload
      );

    return data;
  };

export const deleteOrder =
  async (id) => {
    const { data } =
      await api.delete(
        `/api/v1/orders/${id}`
      );

    return data;
  };