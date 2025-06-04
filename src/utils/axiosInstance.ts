// src/utils/axiosInstance.ts
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const unauthorizedListeners: (() => void)[] = [];

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      unauthorizedListeners.forEach(fn => fn());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
