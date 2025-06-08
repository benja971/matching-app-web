<template>
  <div class="matches-view">
    <div class="matches-header">
      <h2>Your Matches</h2>
      <Badge v-if="matches.length > 0" :value="matches.length" />
    </div>

    <div v-if="isLoading" class="loading-state">
      <ProgressSpinner />
      <p>Loading your matches...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <Message severity="error" :closable="false">
        {{ error }}
      </Message>
      <Button label="Try Again" @click="fetchMatches" class="p-button-outlined" />
    </div>

    <div v-else-if="matches.length === 0" class="empty-state">
      <i class="pi pi-users empty-icon"></i>
      <h3>No matches yet</h3>
      <p>Start swiping to find your perfect match!</p>
      <Button label="Start Discovering" @click="goToDiscover" icon="pi pi-heart" />
    </div>

    <div v-else class="matches-grid">
      <MatchCard
        v-for="match in matches"
        :key="match.id"
        :match="match"
        @click="openChat(match.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMatchStore } from '@/stores/match'
import MatchCard from '@/components/features/MatchCard.vue'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Button from 'primevue/button'
import Badge from 'primevue/badge'

const router = useRouter()
const matchStore = useMatchStore()
const { matches, isLoading, error } = storeToRefs(matchStore)

const fetchMatches = () => {
  matchStore.fetchMatches()
}

const goToDiscover = () => {
  router.push({ name: 'Home' })
}

const openChat = (matchId: string) => {
  router.push({ name: 'Chat', params: { matchId } })
}

onMounted(() => {
  fetchMatches()
})
</script>

<style scoped>
.matches-view {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.matches-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.matches-header h2 {
  margin: 0;
  color: var(--text-color);
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  gap: 1rem;
  min-height: 40vh;
}

.empty-icon {
  font-size: 4rem;
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>
