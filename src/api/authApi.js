import api from "../services/axiosInstance";

/**
 * Send OTP
 */
export const getOtp = async (email) => {
  const response = await api.post(
    "/api/v1/auth/get-otp",
    {
      email,
    }
  );

  return response.data;
};

/**
 * Login using OTP
 */
export const login = async (email, otp) => {
  const response = await api.post(
    "/api/v1/auth/login",
    {
      email,
      otp,
    }
  );

  return response.data;
};