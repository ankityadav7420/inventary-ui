import api from '../services/axiosInstance';

const BASE_URL = api.BASE_URL;

export const getDashboardData = async () => {
  const token = localStorage.getItem('token');

  const response = await api.get(`${BASE_URL}/products/dashboard`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};
