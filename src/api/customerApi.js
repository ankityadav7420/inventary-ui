import api from "../services/axiosInstance";

export const getCustomers = async () => {
  const { data } = await api.get(
    "/api/v1/customers"
  );

  return data;
};

export const getCustomerById =
  async (id) => {
    const { data } =
      await api.get(
        `/api/v1/customers/${id}`
      );

    return data;
  };

export const createCustomer =
  async (payload) => {
    const { data } =
      await api.post(
        "/api/v1/customers",
        payload
      );

    return data;
  };

export const deleteCustomer =
  async (id) => {
    const { data } =
      await api.delete(
        `/api/v1/customers/${id}`
      );

    return data;
  };