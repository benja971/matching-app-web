import { useAppToast } from '@/composables/useAppToast'
import { feedService } from '@/services/feed'
// import { swipeService } from '@/services/swipe' // Enable when backend is ready
import type { Match, MatchUser } from '@/types'
import { feedProfileDTOToMatchUser } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMatchStore = defineStore('match', () => {
  // Toast utilities
  const { showLike, showMatch, showError, showFeedLoaded } = useAppToast()
  
  // State
  const matches = ref<Match[]>([])
  const potentialMatches = ref<MatchUser[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const hasMore = ref(true)
  const currentPage = ref(1)

  // Actions
  const fetchPotentialMatches = async (page = 1, reset = false) => {
    if (isLoading.value) return
    
    isLoading.value = true
    error.value = null

    try {
      const feedResponse = await feedService.getFeed(page, 10)
      
      // Convert feed profiles to MatchUser format
      const newMatches = feedResponse.profiles.map(feedProfileDTOToMatchUser)
      
      if (reset || page === 1) {
        potentialMatches.value = newMatches
        currentPage.value = 1
        // Show toast for initial load
        showFeedLoaded(newMatches.length)
      } else {
        potentialMatches.value.push(...newMatches)
        // Show toast for additional matches loaded
        if (newMatches.length > 0) {
          showFeedLoaded(newMatches.length)
        }
      }
      
      hasMore.value = feedResponse.has_more
      currentPage.value = page
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch feed'
      showError('Feed Error', error.value)
      
      // Fallback to mock data if API fails (for development)
      if (page === 1) {
        potentialMatches.value = [
          {
            id: '2',
            email: 'jane@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            age: 24,
            bio: 'Love hiking and photography',
            gender: 'female',
            interests: ['hiking', 'photography', 'coffee'],
            location: 'New York, NY',
            preferences: {
              ageRange: { min: 22, max: 30 },
              maxDistance: 30,
              interests: ['hiking', 'photography'],
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]
        hasMore.value = false
      }
    } finally {
      isLoading.value = false
    }
  }

  const loadMoreMatches = async () => {
    if (!hasMore.value || isLoading.value) return
    await fetchPotentialMatches(currentPage.value + 1, false)
  }

  const fetchMatches = async () => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock data
      matches.value = []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch matches'
    } finally {
      isLoading.value = false
    }
  }

  const swipeUser = async (userId: string, isLike: boolean) => {
    try {
      // Record the swipe with the backend
      // const swipeResponse = await swipeService.recordSwipe({
      //   target_user_id: userId,
      //   is_like: isLike
      // })
      
      // TODO: Remove this mock delay when backend is integrated
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Remove from potential matches
      const swipedUser = potentialMatches.value.find(user => user.id === userId)
      potentialMatches.value = potentialMatches.value.filter(user => user.id !== userId)
      
      // Auto-load more if we're running low on cards (more aggressive for single-card display)
      if (potentialMatches.value.length <= 1 && hasMore.value && !isLoading.value) {
        loadMoreMatches()
      }
      
      if (isLike) {
        // Show like toast
        if (swipedUser) {
          showLike(swipedUser.firstName)
        }
        
        // TODO: Use actual match response from backend
        // if (swipeResponse.is_match && swipedUser) {
        //   showMatch(swipedUser.firstName)
        //   // Add to matches if it's a match
        //   const newMatch: Match = {
        //     id: swipeResponse.match_id!,
        //     userId1: 'current-user-id', // Get from auth store
        //     userId2: userId,
        //     status: 'matched',
        //     createdAt: new Date(),
        //   }
        //   matches.value.push(newMatch)
        // }
        
        // Simulate potential match (for demo - remove when backend is ready)
        const isMatch = Math.random() > 0.7 // 30% chance of match
        if (isMatch && swipedUser) {
          showMatch(swipedUser.firstName)
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Swipe failed'
      showError('Swipe Failed', error.value)
    }
  }

  return {
    // State
    matches,
    potentialMatches,
    isLoading,
    error,
    hasMore,
    currentPage,
    // Actions
    fetchPotentialMatches,
    loadMoreMatches,
    fetchMatches,
    swipeUser,
  }
})
