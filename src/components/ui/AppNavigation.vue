<template>
  <nav class="app-navigation">
    <div class="nav-items">
      <router-link
        v-for="item in navigationItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="nav-item"
        :class="{ active: isActive(item.name) }"
      >
        <i :class="item.icon"></i>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

interface NavigationItem {
  name: string
  label: string
  icon: string
}

const route = useRoute()

const navigationItems: NavigationItem[] = [
  { name: 'Home', label: 'Discover', icon: 'pi pi-heart' },
  { name: 'Matches', label: 'Matches', icon: 'pi pi-users' },
  { name: 'Profile', label: 'Profile', icon: 'pi pi-user' },
  { name: 'Settings', label: 'Settings', icon: 'pi pi-cog' },
]

const isActive = (routeName: string) => {
  return route.name === routeName
}
</script>

<style scoped>
.app-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface-card);
  border-top: 1px solid var(--surface-border);
  z-index: 100;
}

.nav-items {
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  text-decoration: none;
  color: var(--text-color-secondary);
  transition: color 0.2s;
  min-width: 4rem;
}

.nav-item:hover,
.nav-item.active {
  color: var(--primary-color);
}

.nav-item i {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.nav-label {
  font-size: 0.75rem;
  font-weight: 500;
}

@media (min-width: 768px) {
  .app-navigation {
    position: static;
    background: var(--surface-card);
    border-top: none;
    border-right: 1px solid var(--surface-border);
    width: 250px;
    height: 100vh;
  }

  .nav-items {
    flex-direction: column;
    padding: 2rem 0;
    gap: 0.5rem;
  }

  .nav-item {
    flex-direction: row;
    justify-content: flex-start;
    padding: 1rem 2rem;
    margin: 0 1rem;
    border-radius: 0.5rem;
    min-width: auto;
  }

  .nav-item i {
    margin-bottom: 0;
    margin-right: 0.75rem;
  }

  .nav-label {
    font-size: 1rem;
  }
}
</style>
