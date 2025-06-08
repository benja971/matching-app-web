import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

// PrimeVue imports
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

async function initializeApp() {
  const app = createApp(App)
  const pinia = createPinia()

  // Configure PrimeVue
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })

  app.use(ToastService)
  app.use(pinia)
  app.use(router)

  // Initialize auth store (validate token if exists)
  const authStore = useAuthStore()
  await authStore.initialize()

  app.mount('#app')
}

initializeApp()
