import axiosInstance from './axiosInstance';

const registerUser = async (userData) => {
  const response = await axiosInstance.post('/users/register', userData);
  return response.data;
};

const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/users/login', credentials);
  return response.data;
};

const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

export { registerUser, loginUser, getCurrentUser };