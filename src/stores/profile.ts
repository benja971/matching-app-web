import { profileService } from '@/services/profile'
import type { Profile } from '@/types'
import { profileDTOToProfile, profileToCreateDTO, profileToUpdateDTO } from '@/types'
import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { computed, ref } from 'vue'
import { useAuthStore } from './auth'

export const useProfileStore = defineStore('profile', () => {
  // Toast instance
  const toast = useToast()
  
  // State
  const profile = ref<Profile | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasProfile = computed(() => profile.value !== null)
  const fullName = computed(() => {
    if (!profile.value) return ''
    return `${profile.value.firstName} ${profile.value.lastName}`.trim()
  })

  // Actions
  const createProfile = async (profileData: Omit<Profile, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    isLoading.value = true
    error.value = null

    try {
      const createDTO = profileToCreateDTO(profileData)
      const response = await profileService.createProfile(createDTO)
      
      if (response.success && response.data) {
        profile.value = profileDTOToProfile(response.data)
        
        // Update the profile in auth store as well
        const authStore = useAuthStore()
        authStore.setProfile(profile.value)
        authStore.updateUserProfileId(profile.value.id)
        
        // Show success toast
        toast.add({
          severity: 'success',
          summary: 'Profile Created!',
          detail: 'Your profile has been successfully created.',
          life: 4000
        })
      } else {
        throw new Error(response.message || 'Failed to create profile')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create profile'
      
      // Show error toast
      toast.add({
        severity: 'error',
        summary: 'Profile Creation Failed',
        detail: error.value,
        life: 5000
      })
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile.value) return

    isLoading.value = true
    error.value = null

    try {
      const updateDTO = profileToUpdateDTO({ ...profile.value, ...updates })
      const response = await profileService.updateProfile(updateDTO)
      
      if (response.success && response.data) {
        profile.value = profileDTOToProfile(response.data)
        
        // Update the profile in auth store as well
        const authStore = useAuthStore()
        authStore.setProfile(profile.value)
        
        // Show success toast
        toast.add({
          severity: 'success',
          summary: 'Profile Updated!',
          detail: 'Your profile has been successfully updated.',
          life: 3000
        })
      } else {
        throw new Error(response.message || 'Failed to update profile')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update profile'
      
      // Show error toast
      toast.add({
        severity: 'error',
        summary: 'Profile Update Failed',
        detail: error.value,
        life: 5000
      })
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadProfile = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await profileService.getProfileById(id)

      if (response.success && response.data) {
        profile.value = profileDTOToProfile(response.data)
      } else {
        throw new Error(response.message || 'Failed to load profile')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load profile'
      profile.value = null
    } finally {
      isLoading.value = false
    }
  }

  const deleteProfile = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await profileService.deleteProfile()
      
      if (response.success) {
        profile.value = null
        
        // Update the profile in auth store as well
        const authStore = useAuthStore()
        authStore.profile = null
        
        // Show success toast
        toast.add({
          severity: 'info',
          summary: 'Profile Deleted',
          detail: 'Your profile has been successfully deleted.',
          life: 4000
        })
      } else {
        throw new Error(response.message || 'Failed to delete profile')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete profile'
      
      // Show error toast
      toast.add({
        severity: 'error',
        summary: 'Profile Deletion Failed',
        detail: error.value,
        life: 5000
      })
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearProfile = () => {
    profile.value = null
    error.value = null
  }

  return {
    // State
    profile,
    isLoading,
    error,
    // Getters
    hasProfile,
    fullName,
    // Actions
    createProfile,
    updateProfile,
    loadProfile,
    deleteProfile,
    clearProfile,
  }
})
