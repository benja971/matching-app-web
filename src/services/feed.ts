import type { FeedResponseDTO } from '@/types'
import { apiClient } from './api'

class FeedService {
  async getFeed(page = 1, limit = 10): Promise<FeedResponseDTO> {
    const response = await apiClient.get<FeedResponseDTO>(`/users/feed?page=${page}&limit=${limit}`)
    return response.data
  }
}

export const feedService = new FeedService()
