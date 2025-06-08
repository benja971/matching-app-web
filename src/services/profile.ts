import type { ApiResponse, CreateProfileDTO, ProfileResponseDTO, UpdateProfileDTO } from '@/types'
import { apiClient } from './api'

export const profileService = {
  async getProfile(): Promise<ApiResponse<ProfileResponseDTO>> {
    return apiClient.get('/profiles')
  },

  async createProfile(profileData: CreateProfileDTO): Promise<ApiResponse<ProfileResponseDTO>> {
    return apiClient.post('/profiles', profileData)
  },

  async updateProfile(profileData: UpdateProfileDTO): Promise<ApiResponse<ProfileResponseDTO>> {
    return apiClient.put('/profiles', profileData)
  },

  async deleteProfile(): Promise<ApiResponse<void>> {
    return apiClient.delete('/profiles')
  },

  async getProfileById(id: string): Promise<ApiResponse<ProfileResponseDTO>> {
    return apiClient.get(`/profiles/${id}`)
  },
}
