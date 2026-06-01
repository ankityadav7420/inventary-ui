export const API_ENDPOINTS = {
    AUTH: {
      GET_OTP: "/api/v1/auth/get-otp",
      LOGIN: "/api/v1/auth/login",
    },
  
    PRODUCTS: {
      LIST: "/api/v1/products",
      DETAILS: (id) =>
        `/api/v1/products/${id}`,
    },
  
    CUSTOMERS: {
      LIST: "/api/v1/customers",
      DETAILS: (id) =>
        `/api/v1/customers/${id}`,
    },
  
    ORDERS: {
      LIST: "/api/v1/orders",
      DETAILS: (id) =>
        `/api/v1/orders/${id}`,
    },
  };