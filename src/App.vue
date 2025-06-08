<template>
  <AppLayout />
  <Toast />
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import Toast from 'primevue/toast'
</script>

<style>
/* Global styles */
body {
  margin: 0;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    'Roboto',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--surface-ground);
  color: var(--text-color);
}

* {
  box-sizing: border-box;
}

.p-button {
  font-weight: 600;
}

.p-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.p-inputtext,
.p-password input,
.p-inputnumber input,
.p-textarea {
  border-radius: 0.5rem;
  border: 1px solid var(--surface-border);
  padding: 0.75rem;
}

.p-inputtext:focus,
.p-password input:focus,
.p-inputnumber input:focus,
.p-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px var(--primary-color);
}
</style>
