import { apiClient } from './api'

export interface SwipeData {
  target_user_id: string
  is_like: boolean
}

export interface SwipeResponse {
  is_match: boolean
  match_id?: string
}

class SwipeService {
  async recordSwipe(swipeData: SwipeData): Promise<SwipeResponse> {
    const response = await apiClient.post<SwipeResponse>('/swipes', swipeData)
    return response.data
  }
}

export const swipeService = new SwipeService()
