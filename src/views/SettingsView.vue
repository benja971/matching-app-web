<template>
  <div class="settings-view">
    <h2>Settings</h2>

    <div class="settings-sections">
      <Card class="settings-section">
        <template #title>Discovery Preferences</template>
        <template #content>
          <div class="setting-item">
            <label>Age Range</label>
            <div class="range-inputs">
              <InputNumber
                v-model="preferences.ageRange.min"
                :min="18"
                :max="100"
                placeholder="Min"
              />
              <span>to</span>
              <InputNumber
                v-model="preferences.ageRange.max"
                :min="18"
                :max="100"
                placeholder="Max"
              />
            </div>
          </div>

          <div class="setting-item">
            <label>Maximum Distance (km)</label>
            <Slider v-model="preferences.maxDistance" :min="1" :max="100" class="distance-slider" />
            <span class="slider-value">{{ preferences.maxDistance }} km</span>
          </div>

          <div class="setting-item">
            <label>Preferred Interests</label>
            <Chips v-model="preferences.interests" placeholder="Add interests" />
          </div>
        </template>
      </Card>

      <Card class="settings-section">
        <template #title>Notifications</template>
        <template #content>
          <div class="setting-item">
            <div class="checkbox-item">
              <Checkbox v-model="notifications.newMatches" :binary="true" inputId="new-matches" />
              <label for="new-matches">New matches</label>
            </div>
          </div>

          <div class="setting-item">
            <div class="checkbox-item">
              <Checkbox v-model="notifications.messages" :binary="true" inputId="messages" />
              <label for="messages">New messages</label>
            </div>
          </div>

          <div class="setting-item">
            <div class="checkbox-item">
              <Checkbox v-model="notifications.likes" :binary="true" inputId="likes" />
              <label for="likes">Someone likes you</label>
            </div>
          </div>
        </template>
      </Card>

      <Card class="settings-section">
        <template #title>Privacy</template>
        <template #content>
          <div class="setting-item">
            <div class="checkbox-item">
              <Checkbox v-model="privacy.showDistance" :binary="true" inputId="show-distance" />
              <label for="show-distance">Show my distance</label>
            </div>
          </div>

          <div class="setting-item">
            <div class="checkbox-item">
              <Checkbox v-model="privacy.showAge" :binary="true" inputId="show-age" />
              <label for="show-age">Show my age</label>
            </div>
          </div>
        </template>
      </Card>

      <Card class="settings-section">
        <template #title>Account</template>
        <template #content>
          <div class="account-actions">
            <Button
              label="Change Password"
              icon="pi pi-key"
              class="p-button-outlined"
              @click="changePassword"
            />
            <Button
              label="Delete Account"
              icon="pi pi-trash"
              class="p-button-danger p-button-outlined"
              @click="confirmDeleteAccount"
            />
          </div>
        </template>
      </Card>
    </div>

    <div class="settings-actions">
      <Button label="Save Settings" @click="saveSettings" :loading="isLoading" />
      <Button
        label="Logout"
        icon="pi pi-sign-out"
        class="p-button-outlined"
        @click="handleLogout"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import Slider from 'primevue/slider'
import Chips from 'primevue/chips'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)

const preferences = ref({
  ageRange: { min: 22, max: 30 },
  maxDistance: 50,
  interests: ['music', 'travel'] as string[],
})

const notifications = ref({
  newMatches: true,
  messages: true,
  likes: true,
})

const privacy = ref({
  showDistance: true,
  showAge: true,
})

const saveSettings = async () => {
  isLoading.value = true
  try {
    // TODO: Save settings via API
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Settings saved')
  } catch (error) {
    console.error('Failed to save settings:', error)
  } finally {
    isLoading.value = false
  }
}

const changePassword = () => {
  // TODO: Implement password change dialog
  console.log('Change password')
}

const confirmDeleteAccount = () => {
  // TODO: Implement account deletion confirmation dialog
  console.log('Delete account')
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'Auth' })
}
</script>

<style scoped>
.settings-view {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.settings-view h2 {
  margin-bottom: 2rem;
  color: var(--text-color);
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.settings-section {
  width: 100%;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-item label {
  font-weight: 600;
  color: var(--text-color);
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.range-inputs span {
  color: var(--text-color-secondary);
}

.distance-slider {
  margin: 1rem 0;
}

.slider-value {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-item label {
  margin: 0;
  font-weight: 400;
}

.account-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--surface-border);
}

@media (min-width: 768px) {
  .range-inputs {
    max-width: 300px;
  }

  .account-actions {
    flex-direction: row;
  }

  .settings-actions {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
