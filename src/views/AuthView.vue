<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-header">
        <h1>{{ appName }}</h1>
        <p>Find your perfect match</p>
      </div>

      <Card class="auth-card">
        <template #content>
          <div class="tab-buttons">
            <Button
              label="Login"
              :class="{ active: isLogin }"
              class="p-button-text tab-button"
              @click="isLogin = true"
            />
            <Button
              label="Sign Up"
              :class="{ active: !isLogin }"
              class="p-button-text tab-button"
              @click="isLogin = false"
            />
          </div>

          <form @submit.prevent="handleSubmit" class="auth-form">
            <div class="field">
              <label for="email">Email</label>
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                autocomplete="email"
                :class="{ 'p-invalid': errors.email }"
              />
              <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>

            <div class="field">
              <label for="password">Password</label>
              <div class="password-wrapper">
                <Password
                  id="password"
                  v-model="form.password"
                  placeholder="Enter your password"
                  :feedback="!isLogin"
                  :toggleMask="true"
                  :class="{ 'p-invalid': errors.password }"
                  inputClass="w-full"
                  :inputProps="{ autocomplete: isLogin ? 'current-password' : 'new-password' }"
                />
              </div>
              <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
            </div>

            <Button
              type="submit"
              :label="isLogin ? 'Login' : 'Sign Up'"
              class="submit-button"
              :loading="isLoading"
            />
          </form>

          <div v-if="error" class="error-message">
            <Message severity="error" :closable="false">
              {{ error }}
            </Message>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { validateEmail, validatePassword, validateRequired } from '@/utils/validation'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const authStore = useAuthStore()
const toast = useToast()
const { isLoading, error } = storeToRefs(authStore)

const appName = computed(() => import.meta.env.VITE_APP_NAME || 'Matching App')

const isLogin = ref(true)

const form = ref({
  email: '',
  password: '',
})

const errors = ref({
  email: '',
  password: '',
})

const validateForm = () => {
  errors.value = {
    email: '',
    password: '',
  }

  let isValid = true

  if (!validateEmail(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!validateRequired(form.value.email)) {
    errors.value.email = 'Email is required'
    isValid = false
  }

  if (!validateRequired(form.value.password)) {
    errors.value.password = 'Password is required'
    isValid = false
  }

  if (!isLogin.value) {
    const passwordValidation = validatePassword(form.value.password)
    if (!passwordValidation.isValid) {
      errors.value.password = passwordValidation.errors[0]
      isValid = false
    }
  }

  // Show toast for validation errors
  if (!isValid) {
    toast.add({
      severity: 'warn',
      summary: 'Form Validation Error',
      detail: 'Please fix the errors in the form before submitting.',
      life: 4000,
    })
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    if (isLogin.value) {
      await authStore.login(form.value.email, form.value.password)
    } else {
      await authStore.register(form.value.email, form.value.password)
    }

    // Let the router guard handle navigation based on authentication and profile status
    // No explicit navigation needed here
  } catch (err) {
    console.error('Auth error:', err)
  }
}

onMounted(() => {
  // Prevent body scrolling when auth view is mounted
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  // Restore body scrolling when leaving auth view
  document.body.style.overflow = ''
})
</script>

<style scoped>
.auth-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
  padding: 1rem;
  margin: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  margin: 0;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.auth-header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.auth-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.auth-card {
  width: 100%;
}

.tab-buttons {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--surface-border);
}

.tab-button {
  flex: 1;
  justify-content: center;
  border-radius: 0;
  font-weight: 600;
  color: var(--text-color);
  background: transparent;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-button.active {
  border-bottom-color: var(--primary-600) !important;
  background: transparent;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 600;
  color: var(--text-color);
}

.password-wrapper {
  width: 100%;
}

.password-wrapper :deep(.p-password) {
  width: 100%;
}

.password-wrapper :deep(.p-password .p-inputtext) {
  width: 100%;
}

.submit-button {
  margin-top: 1rem;
  font-weight: 600;
}

.error-message {
  margin-top: 1rem;
}
</style>
