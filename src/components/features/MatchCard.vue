<template>
  <Card class="match-card" @click="$emit('click')">
    <template #content>
      <div class="match-header">
        <Avatar :label="matchUser?.firstName?.charAt(0) || 'U'" size="large" shape="circle" />
        <div class="match-info">
          <h4>{{ matchUser?.firstName }} {{ matchUser?.lastName }}</h4>
          <p class="match-date">Matched {{ formatRelativeTime(match.createdAt) }}</p>
        </div>
        <Badge v-if="unreadCount > 0" :value="unreadCount" class="unread-badge" />
      </div>

      <div v-if="lastMessage" class="last-message">
        <p>{{ lastMessage.content }}</p>
        <span class="message-time">{{ formatTime(lastMessage.timestamp) }}</span>
      </div>

      <div v-else class="no-messages">
        <p>Start a conversation!</p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { Match, MatchUser, Message } from '@/types'
import { formatRelativeTime, formatTime } from '@/utils/date'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Card from 'primevue/card'
import { computed } from 'vue'

interface Props {
  match: Match
}

interface Emits {
  (event: 'click'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

// Mock data - in real app, this would come from props or API
const matchUser = computed<MatchUser>(() => ({
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
}))

const lastMessage = computed<Message | null>(() => {
  if (!props.match.messages || props.match.messages.length === 0) {
    return null
  }
  return props.match.messages[props.match.messages.length - 1]
})

const unreadCount = computed(() => {
  if (!props.match.messages) return 0
  return props.match.messages.filter(msg => !msg.isRead).length
})
</script>

<style scoped>
.match-card {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.match-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
}

.match-info {
  flex: 1;
}

.match-info h4 {
  margin: 0 0 0.25rem 0;
  color: var(--text-color);
  font-weight: 600;
}

.match-date {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.unread-badge {
  position: absolute;
  top: -0.5rem;
  right: 0;
}

.last-message {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.last-message p {
  margin: 0;
  color: var(--text-color);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-time {
  color: var(--text-color-secondary);
  font-size: 0.75rem;
  white-space: nowrap;
}

.no-messages p {
  margin: 0;
  color: var(--text-color-secondary);
  font-style: italic;
}
</style>
