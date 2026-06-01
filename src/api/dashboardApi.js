import api from '../services/axiosInstance';

export const getDashboardData = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/products/dashboard', {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};
