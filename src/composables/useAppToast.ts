import { useToast } from 'primevue/usetoast'

/**
 * Utility composable for common toast notifications
 */
export const useAppToast = () => {
  const toast = useToast()

  const showWelcome = (name?: string) => {
    toast.add({
      severity: 'success',
      summary: 'Welcome!',
      detail: name ? `Hello ${name}, welcome to Matching App!` : 'Welcome to Matching App!',
      life: 4000
    })
  }

  const showError = (title: string, message: string) => {
    toast.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 5000
    })
  }

  const showSuccess = (title: string, message: string) => {
    toast.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000
    })
  }

  const showWarning = (title: string, message: string) => {
    toast.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: 4000
    })
  }

  const showInfo = (title: string, message: string) => {
    toast.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: 3000
    })
  }

  const showMatch = (matchName: string) => {
    toast.add({
      severity: 'success',
      summary: "It's a Match! 🎉",
      detail: `You and ${matchName} liked each other!`,
      life: 6000
    })
  }

  const showLike = (name: string) => {
    toast.add({
      severity: 'info',
      summary: 'Like Sent! 💙',
      detail: `You liked ${name}`,
      life: 2000
    })
  }

  const showConnectionError = () => {
    toast.add({
      severity: 'error',
      summary: 'Connection Error',
      detail: 'Unable to connect to the server. Please check your internet connection.',
      life: 5000
    })
  }

  const showFeedLoaded = (count: number) => {
    if (count > 0) {
      toast.add({
        severity: 'info',
        summary: 'New Matches',
        detail: `Found ${count} new potential ${count === 1 ? 'match' : 'matches'}!`,
        life: 2000
      })
    }
  }

  return {
    showWelcome,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    showMatch,
    showLike,
    showConnectionError,
    showFeedLoaded,
  }
}
