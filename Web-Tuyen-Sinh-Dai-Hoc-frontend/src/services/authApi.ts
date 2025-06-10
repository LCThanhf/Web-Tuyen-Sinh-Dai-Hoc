// Authentication API service
import { apiClient } from './api';
import type { ApiResponse } from './api';

export interface LoginRequest {
  cccd: string;
  password: string;
}

export interface RegisterRequest {
  cccd: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface User {
  id: string;
  cccd: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  createdAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  // Register new student
  register: async (userData: RegisterRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/register', userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<{ user: User }> => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/profile');
    return response.data.data;
  },

  // Update current user profile
  updateProfile: async (profileData: { fullName: string; email: string; phone: string }): Promise<{ user: User }> => {
    const response = await apiClient.put<ApiResponse<{ user: User }>>('/auth/profile', profileData);
    return response.data.data;
  },

  // Logout user
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data.data;
  }
};

export default authApi;
