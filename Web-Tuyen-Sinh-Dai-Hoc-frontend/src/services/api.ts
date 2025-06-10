// Central API configuration and utilities
import axios, { type AxiosResponse } from 'axios';

// API Configuration - use environment variable if available, fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Helper function for API calls
export const makeApiCall = async <T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> => {
  try {
    let response: AxiosResponse<ApiResponse<T>>;
    
    switch (method) {
      case 'GET':
        response = await apiClient.get(endpoint);
        break;
      case 'POST':
        response = await apiClient.post(endpoint, data);
        break;
      case 'PUT':
        response = await apiClient.put(endpoint, data);
        break;
      case 'DELETE':
        response = await apiClient.delete(endpoint);
        break;
    }

    if (!response.data.success) {
      throw new Error(response.data.message || 'API call failed');
    }

    return response.data.data;
  } catch (error: any) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error.response?.data || error;
  }
};

export default apiClient;
