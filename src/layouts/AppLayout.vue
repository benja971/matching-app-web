<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppNavigation v-if="showNavigation" />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/ui/AppHeader.vue'
import AppNavigation from '@/components/ui/AppNavigation.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showNavigation = computed(() => {
  const routesWithoutNav = ['Auth']
  return !routesWithoutNav.includes(route.name as string)
})
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--surface-ground);
}

.main-content {
  flex: 1;
  padding: 1rem;
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .main-content {
    margin-bottom: 0;
    padding: 2rem;
  }
}
</style>
