import type { ApiResponse, LoginResponseDTO, UserResponseDTO } from '@/types';
import { apiClient } from './api';

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<LoginResponseDTO>> {
    return apiClient.post('/auth/login', { email, password })
  },

  async register(userData: {
    email: string
    password: string
  }): Promise<ApiResponse<LoginResponseDTO>> {
    return apiClient.post('/auth/register', userData)
  },

  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post('/auth/logout')
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post('/auth/refresh')
  },

  async getCurrentUser(): Promise<ApiResponse<UserResponseDTO>> {
    return apiClient.get('/users/me')
  },

  async deleteAccount(): Promise<ApiResponse<void>> {
    return apiClient.delete('/auth/account')
  },
}
