<template>
  <div class="profile-view">
    <div class="profile-header">
      <h2>My Profile</h2>
      <Button icon="pi pi-pencil" class="p-button-outlined" @click="toggleEditMode" />
    </div>

    <div v-if="profile" class="profile-content">
      <div class="profile-photo">
        <Avatar
          :label="`${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`"
          size="xlarge"
          shape="circle"
        />
        <Button
          v-if="isEditing"
          icon="pi pi-camera"
          class="p-button-rounded p-button-sm camera-btn"
          @click="uploadPhoto"
        />
      </div>

      <div class="profile-info">
        <div class="info-field">
          <label>First Name</label>
          <InputText
            v-if="isEditing"
            v-model="editForm.firstName"
            placeholder="Enter your first name"
          />
          <p v-else>{{ profile.firstName }}</p>
        </div>

        <div class="info-field">
          <label>Last Name</label>
          <InputText
            v-if="isEditing"
            v-model="editForm.lastName"
            placeholder="Enter your last name"
          />
          <p v-else>{{ profile.lastName }}</p>
        </div>

        <div class="info-field">
          <label>Age</label>
          <InputNumber v-if="isEditing" v-model="editForm.age" :min="18" :max="100" />
          <p v-else>{{ profile.age }}</p>
        </div>

        <div class="info-field">
          <label>Gender</label>
          <InputText v-if="isEditing" v-model="editForm.gender" placeholder="Enter your gender" />
          <p v-else>{{ profile.gender || 'Not specified' }}</p>
        </div>

        <div class="info-field">
          <label>Bio</label>
          <Textarea
            v-if="isEditing"
            v-model="editForm.bio"
            placeholder="Tell us about yourself..."
            rows="3"
          />
          <p v-else>{{ profile.bio || 'No bio yet' }}</p>
        </div>

        <div class="info-field">
          <label>Interests</label>
          <div v-if="isEditing" class="interests-edit">
            <Chips v-model="editForm.interests" placeholder="Add interests" />
          </div>
          <div v-else class="interests-display">
            <Tag
              v-for="interest in profile.interests"
              :key="interest"
              :value="interest"
              class="interest-tag"
            />
          </div>
        </div>

        <div class="info-field">
          <label>Location</label>
          <InputText
            v-if="isEditing"
            v-model="editForm.location"
            placeholder="Enter your location"
          />
          <p v-else>{{ profile.location || 'No location set' }}</p>
        </div>

        <div v-if="isEditing" class="form-actions">
          <Button label="Save" @click="saveProfile" :loading="isLoading" />
          <Button label="Cancel" class="p-button-outlined" @click="cancelEdit" />
        </div>
      </div>
    </div>
    <div v-else class="no-profile">
      <h3>No Profile Created</h3>
      <p>You haven't created your profile yet. Click below to get started!</p>
      <Button label="Create Profile" @click="createNewProfile" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Chips from 'primevue/chips'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const toast = useToast()
const route = useRoute()
const { user, profile } = storeToRefs(authStore)
const { isLoading } = storeToRefs(profileStore)

const isEditing = ref(false)
const editForm = ref({
  firstName: '',
  lastName: '',
  age: 18,
  bio: '',
  interests: [] as string[],
  location: '',
  gender: '',
})

const toggleEditMode = () => {
  if (profile.value) {
    editForm.value = {
      firstName: profile.value.firstName,
      lastName: profile.value.lastName,
      age: profile.value.age,
      bio: profile.value.bio || '',
      interests: [...profile.value.interests],
      location: profile.value.location || '',
      gender: profile.value.gender || '',
    }
  }
  isEditing.value = !isEditing.value
}

const saveProfile = async () => {
  if (profile.value) {
    await profileStore.updateProfile(editForm.value)
  } else {
    await profileStore.createProfile(editForm.value)
  }
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
}

const createNewProfile = () => {
  editForm.value = {
    firstName: '',
    lastName: '',
    age: 18,
    bio: '',
    interests: [],
    location: '',
    gender: '',
  }
  isEditing.value = true
}

const uploadPhoto = () => {
  // TODO: Implement photo upload
  console.log('Upload photo')
}

onMounted(() => {
  // Show helpful message if user was redirected here to create profile
  if (route.redirectedFrom && route.redirectedFrom.name !== 'Profile') {
    toast.add({
      severity: 'info',
      summary: 'Profile Required',
      detail: 'Please complete your profile to access all features of the app.',
      life: 5000,
    })
  }

  // If user has profileId but no profile loaded, try to load it
  if (user.value?.profileId && !profile.value) {
    console.log('Profile not loaded yet, attempting to load profile:', user.value.profileId)
    authStore.loadProfile(user.value.profileId)
  }
})
</script>

<style scoped>
.profile-view {
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-header h2 {
  margin: 0;
  color: var(--text-color);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-photo {
  position: relative;
  display: flex;
  justify-content: center;
}

.camera-btn {
  position: absolute;
  bottom: 0;
  right: calc(50% - 60px);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-field label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.info-field p {
  margin: 0;
  color: var(--text-color-secondary);
}

.interests-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.interest-tag {
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.no-profile {
  text-align: center;
  padding: 2rem;
  background: var(--surface-card);
  border-radius: var(--border-radius);
  border: 1px solid var(--surface-border);
}

.no-profile h3 {
  margin: 0 0 1rem 0;
  color: var(--text-color);
}

.no-profile p {
  margin: 0 0 2rem 0;
  color: var(--text-color-secondary);
}
</style>
