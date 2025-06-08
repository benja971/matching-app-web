import router from '@/router'
import { authService } from '@/services/auth'
import { profileService } from '@/services/profile'
import type { Profile, User } from '@/types'
import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Toast instance
  const toast = useToast()
  
  // State
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => user.value !== null && token.value !== null)
  const userEmail = computed(() => user.value?.email ?? '')
  const hasProfile = computed(() => profile.value !== null)

  // Actions
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.login(email, password)
      
      if (response.success && response.data) {
        // Set user and token from login response
        user.value = {
          id: response.data.user.id,
          email: response.data.user.email,
          profileId: response.data.user.profile_id,
        }
        token.value = response.data.token
        
        // Save token to localStorage
        localStorage.setItem('auth_token', response.data.token)
        
        // Check if user has a profile ID, if so fetch the profile
        let hasProfile = false
        if (response.data.user.profile_id) {
          console.log('User has profile ID:', response.data.user.profile_id)
          hasProfile = await loadProfile(response.data.user.profile_id)
        } else {
          console.log('User has no profile ID, profile needs to be created')
          profile.value = null
        }
        
        // Show success toast
        toast.add({
          severity: 'success',
          summary: 'Welcome back!',
          detail: 'You have been successfully logged in.',
          life: 4000
        })
        
        // Navigate based on profile status
        if (!hasProfile) {
          console.log('User has no profile after login, navigating to Profile page')
          await router.push({ name: 'Profile' })
        } else {
          console.log('User has profile after login, navigating to Home page')
          await router.push({ name: 'Home' })
        }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      
      // Show error toast
      toast.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: error.value,
        life: 5000
      })
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.register({ email, password })
      
      if (response.success && response.data) {
        // Set user and token from register response
        user.value = {
          id: response.data.user.id,
          email: response.data.user.email,
        }
        token.value = response.data.token
        
        // Save token to localStorage
        localStorage.setItem('auth_token', response.data.token)
        
        // Profile won't exist for new users, so set it to null
        profile.value = null
        
        // Show success toast
        toast.add({
          severity: 'success',
          summary: 'Account Created!',
          detail: 'Your account has been successfully created. Welcome!',
          life: 4000
        })
        
        // Navigate to profile creation since new users don't have profiles
        console.log('New user registered, navigating to Profile page to create profile')
        toast.add({
          severity: 'info',
          summary: 'Complete Your Profile',
          detail: 'Please create your profile to start matching!',
          life: 5000
        })
        await router.push({ name: 'Profile' })
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      
      // Show error toast
      toast.add({
        severity: 'error',
        summary: 'Registration Failed',
        detail: error.value,
        life: 5000
      })
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadProfile = async (profileId?: string): Promise<boolean> => {
    if (!user.value && !profileId) return false

    try {
      // Use provided profileId or fall back to user.id for backward compatibility
      const idToUse = profileId || user.value!.id
      const response = await profileService.getProfileById(idToUse)
      
      if (response.success && response.data) {
        profile.value = {
          id: response.data.id,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          bio: response.data.bio,
          age: response.data.age,
          gender: response.data.gender,
          interests: response.data.interests,
          location: response.data.location,
        }
        return true
      }
      return false
    } catch (err) {
      // Profile doesn't exist yet, that's okay
      profile.value = null
      
      // Check if it's a 404 error (profile not found)
      if (err instanceof Error && ((err as any).status === 404 || err.message.includes('404') || err.message.includes('not found'))) {
        console.log('Profile not found (404) - user needs to create profile')
        return false
      }
      
      // For other errors, we'll still return false but log them
      console.error('Error loading profile:', err)
      return false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      
      // Show success toast
      toast.add({
        severity: 'info',
        summary: 'Logged Out',
        detail: 'You have been successfully logged out.',
        life: 3000
      })
    } catch (err) {
      // Log error but continue with logout
      console.error('Logout error:', err)
      
      // Show warning toast for logout error but still proceed
      toast.add({
        severity: 'warn',
        summary: 'Logout Warning',
        detail: 'There was an issue with logout, but you have been signed out locally.',
        life: 4000
      })
    } finally {
      user.value = null
      profile.value = null
      token.value = null
      error.value = null
      
      // Remove token from localStorage
      localStorage.removeItem('auth_token')
    }
  }

  const deleteAccount = async () => {
    if (!user.value) return

    isLoading.value = true
    error.value = null

    try {
      await authService.deleteAccount()
      user.value = null
      profile.value = null
      token.value = null
      
      // Remove token from localStorage
      localStorage.removeItem('auth_token')
      
      // Show success toast
      toast.add({
        severity: 'success',
        summary: 'Account Deleted',
        detail: 'Your account has been permanently deleted.',
        life: 4000
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Delete account failed'
      
      // Show error toast
      toast.add({
        severity: 'error',
        summary: 'Delete Account Failed',
        detail: error.value,
        life: 5000
      })
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const initialize = async () => {

    console.log('Initializing auth store...');
    
    // Check if we have a token in localStorage
    const savedToken = localStorage.getItem('auth_token')
    if (!savedToken) {
      return
    }

    // Set the token and try to validate it
    token.value = savedToken
    isLoading.value = true
    error.value = null

    console.log('Validating token:', savedToken);

    try {
      // Validate token by getting current user
      const response = await authService.getCurrentUser()
      
      
      if (response.success && response.data) {
        // Token is valid, set user data
        user.value = {
          id: response.data.id,
          email: response.data.email,
        }
        
        // Check if user has a profile ID, if so fetch the profile
        let hasProfile = false
        if (response.data.profile_id) {
          console.log('User has profile ID during initialization:', response.data.profile_id)
          hasProfile = await loadProfile(response.data.profile_id)
        } else {
          console.log('User has no profile ID during initialization, profile needs to be created')
          profile.value = null
        }
        
        // Show welcome back toast
        toast.add({
          severity: 'success',
          summary: 'Welcome back!',
          detail: `Hello ${response.data.email}, you're automatically signed in.`,
          life: 3000
        })
        
        // Navigate based on profile status only if on Auth page or root path
        const currentRoute = router.currentRoute.value
        if (currentRoute.name === 'Auth' || currentRoute.path === '/') {
          if (!hasProfile) {
            // User doesn't have a profile, send them to create one
            console.log('User has no profile, navigating to Profile page to create one')
            toast.add({
              severity: 'info',
              summary: 'Complete Your Profile',
              detail: 'Please create your profile to start matching!',
              life: 5000
            })
            await router.push({ name: 'Profile' })
          } else {
            // User has a profile, send them to Home
            console.log('User has profile, navigating to Home after successful token validation')
            await router.push({ name: 'Home' })
          }
        }
        
      } else {
        // Token is invalid, clear it
        throw new Error('Invalid token')
      }
    } catch (err) {
      console.error('Token validation error:', err)
      // Token is invalid or expired, clear everything
      user.value = null
      profile.value = null
      token.value = null
      localStorage.removeItem('auth_token')
      
      // Show session expired toast only if it's not a network error
      if (err instanceof Error && !err.message.includes('fetch')) {
        toast.add({
          severity: 'warn',
          summary: 'Session Expired',
          detail: 'Your session has expired. Please log in again.',
          life: 4000
        })
        console.log('Token validation failed:', err.message)
      }
    } finally {
      isLoading.value = false
    }
  }

  const setProfile = (newProfile: Profile | null) => {
    profile.value = newProfile
  }

  const updateUserProfileId = (profileId: string) => {
    if (user.value) {
      user.value = { ...user.value, profileId }
    }
  }

  return {
    // State
    user,
    profile,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    userEmail,
    hasProfile,
    // Actions
    login,
    register,
    loadProfile,
    setProfile,
    updateUserProfileId,
    logout,
    deleteAccount,
    initialize,
  }
})
