<template>
  <div class="chat-view">
    <div class="chat-header">
      <Avatar :label="matchUser?.firstName?.charAt(0) || 'U'" size="large" shape="circle" />
      <div class="match-info">
        <h3>{{ matchUser?.firstName }} {{ matchUser?.lastName }}</h3>
        <span class="last-seen">Active 2 hours ago</span>
      </div>
    </div>

    <div class="messages-container" ref="messagesContainer">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['message', { 'own-message': message.senderId === currentUserId }]"
      >
        <div class="message-content">
          {{ message.content }}
        </div>
        <div class="message-time">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>

    <div class="message-input">
      <InputText
        v-model="newMessage"
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
        class="message-field"
      />
      <Button
        icon="pi pi-send"
        @click="sendMessage"
        :disabled="!newMessage.trim()"
        class="send-button"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import type { MatchUser, Message } from '@/types'
import { formatTime } from '@/utils/date'
import { storeToRefs } from 'pinia'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const matchId = computed(() => route.params.matchId as string)
const currentUserId = computed(() => user.value?.id || '')

// Mock data - replace with actual API calls
const matchUser = ref<MatchUser>({
  id: '2',
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Smith',
  age: 24,
  bio: 'Love hiking and photography',
  gender: 'female',
  interests: ['hiking', 'photography'],
  location: 'New York, NY',
  preferences: {
    ageRange: { min: 22, max: 30 },
    maxDistance: 30,
    interests: ['hiking'],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
})

const messages = ref<Message[]>([
  {
    id: '1',
    matchId: matchId.value,
    senderId: '2',
    content: 'Hey! How are you doing?',
    timestamp: new Date(Date.now() - 3600000),
    isRead: true,
  },
  {
    id: '2',
    matchId: matchId.value,
    senderId: currentUserId.value,
    content: "Hi! I'm doing great, thanks! How about you?",
    timestamp: new Date(Date.now() - 3000000),
    isRead: true,
  },
])

const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const message: Message = {
    id: Date.now().toString(),
    matchId: matchId.value,
    senderId: currentUserId.value,
    content: newMessage.value.trim(),
    timestamp: new Date(),
    isRead: false,
  }

  messages.value.push(message)
  newMessage.value = ''

  // Scroll to bottom
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }

  // TODO: Send message via API
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
  background: white;
  gap: 1rem;
}

.match-info h3 {
  margin: 0;
  color: var(--text-color);
}

.last-seen {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message:not(.own-message) {
  align-self: flex-start;
}

.own-message {
  align-self: flex-end;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: var(--surface-100);
  color: var(--text-color);
}

.own-message .message-content {
  background: var(--primary-color);
  color: white;
}

.message-time {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  margin-top: 0.25rem;
  padding: 0 0.5rem;
}

.own-message .message-time {
  text-align: right;
}

.message-input {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid var(--surface-border);
  background: white;
  gap: 0.5rem;
}

.message-field {
  flex: 1;
}

.send-button {
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
}
</style>
