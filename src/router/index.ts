import { useAuthStore } from '@/stores/auth'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

// Import views
import ChatView from '@/views/ChatView.vue'
import HomeView from '@/views/HomeView.vue'
import MatchesView from '@/views/MatchesView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SettingsView from '@/views/SettingsView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Discover',
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: {
      title: 'Profile',
      requiresAuth: true,
    },
  },
  {
    path: '/matches',
    name: 'Matches',
    component: MatchesView,
    meta: {
      title: 'Matches',
      requiresAuth: true,
    },
  },
  {
    path: '/chat/:matchId',
    name: 'Chat',
    component: ChatView,
    meta: {
      title: 'Chat',
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: {
      title: 'Settings',
      requiresAuth: true,
    },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/AuthView.vue'),
    meta: {
      title: 'Login',
      requiresAuth: false,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const hasProfile = authStore.hasProfile

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Not authenticated and trying to access protected route
    next({ name: 'Auth' })
  } else if (to.name === 'Auth' && isAuthenticated) {
    // Authenticated user trying to access auth page
    if (!hasProfile) {
      next({ name: 'Profile' })
    } else {
      next({ name: 'Home' })
    }
  } else if (isAuthenticated && !hasProfile && to.name !== 'Profile' && to.name !== 'Settings' && to.meta.requiresAuth) {
    // Authenticated user without profile trying to access protected route (except Profile/Settings)
    next({ name: 'Profile' })
  } else {
    // Allow navigation
    next()
  }
})

// Update document title
router.afterEach(to => {
  document.title = `${to.meta.title} | Matching App`
})

export default router
