<template>
  <header class="app-header">
    <div class="header-content">
      <h1 class="app-title">{{ title }}</h1>
      <div class="header-actions">
        <Button
          v-if="showBackButton"
          icon="pi pi-arrow-left"
          class="p-button-text"
          @click="goBack"
        />
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const title = computed(() => (route.meta.title as string) || 'Matching App')
const showBackButton = computed(() => {
  const routesWithBackButton = ['Chat', 'Settings', 'Profile']
  return routesWithBackButton.includes(route.name as string)
})

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.app-header {
  border-bottom: 1px solid var(--surface-border);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
