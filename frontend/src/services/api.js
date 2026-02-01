import axios from 'axios';

// Create an Axios instance with your backend URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure this matches your backend port
});

// Interceptor: Before sending any request, check if we have a token
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;