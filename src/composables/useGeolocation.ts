import { onMounted, ref } from 'vue';

export function useGeolocation() {
  const coordinates = ref<{ latitude: number; longitude: number } | null>(null)
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  const getCurrentPosition = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        enableHighAccuracy: true,
      })
    })
  }

  const updateLocation = async () => {
    isLoading.value = true
    error.value = null

    try {
      const position = await getCurrentPosition()
      coordinates.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get location'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    updateLocation()
  })

  return {
    coordinates,
    error,
    isLoading,
    updateLocation,
  }
}
