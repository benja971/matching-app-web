<template>
  <div class="home-view">
    <div class="discover-container">
      <div v-if="isLoading && potentialMatches.length === 0" class="loading-state">
        <ProgressSpinner />
        <p>Finding potential matches...</p>
      </div>

      <div v-else-if="error && potentialMatches.length === 0" class="error-state">
        <Message severity="error" :closable="false">
          {{ error }}
        </Message>
        <Button label="Try Again" @click="fetchMatches" class="p-button-outlined" />
      </div>

      <div v-else-if="potentialMatches.length === 0" class="empty-state">
        <i class="pi pi-heart-fill empty-icon"></i>
        <h3>No more potential matches</h3>
        <p>Check back later for new people in your area!</p>
        <Button label="Refresh" @click="fetchMatches" class="p-button-outlined" />
      </div>

      <div v-else class="cards-container">
        <!-- Show only the first card with transition -->
        <Transition name="card-transition" mode="out-in">
          <UserCard
            v-if="currentUser"
            :key="currentUser.id"
            :user="currentUser"
            @swipe="handleSwipe"
            class="current-card"
          />
          <div v-else-if="!isLoading" class="no-card-placeholder">
            <i class="pi pi-heart-fill empty-icon"></i>
            <p>No more cards available</p>
          </div>
        </Transition>

        <!-- Loading indicator when fetching more cards -->
        <div v-if="isLoading && potentialMatches.length > 0" class="loading-overlay">
          <ProgressSpinner />
          <p>Loading next match...</p>
        </div>

        <!-- Manual load more button (only show if no current card and more available) -->
        <div v-if="!currentUser && hasMore && !isLoading" class="load-more-section">
          <Button label="Load More Matches" @click="loadMore" class="p-button-outlined" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserCard from '@/components/features/UserCard.vue'
import { useMatchStore } from '@/stores/match'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import { computed, onMounted } from 'vue'

const matchStore = useMatchStore()
const { potentialMatches, isLoading, error, hasMore } = storeToRefs(matchStore)

// Show only the first card in the queue
const currentUser = computed(() => potentialMatches.value[0] || null)

const fetchMatches = () => {
  matchStore.fetchPotentialMatches(1, true) // Reset and fetch first page
}

const loadMore = () => {
  matchStore.loadMoreMatches()
}

const handleSwipe = (userId: string, isLike: boolean) => {
  matchStore.swipeUser(userId, isLike)
}

onMounted(() => {
  fetchMatches()
})
</script>

<style scoped>
.home-view {
  padding: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.discover-container {
  position: relative;
  min-height: 60vh;
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
}

.empty-icon {
  font-size: 4rem;
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
}

.cards-container {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-card {
  width: 100%;
  max-width: 350px;
}

.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 1rem;
  backdrop-filter: blur(5px);
}

.load-more-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.no-more-text {
  color: var(--text-color-secondary);
  text-align: center;
  font-style: italic;
}

/* Card transition effects */
.card-transition-enter-active,
.card-transition-leave-active {
  transition: all 0.3s ease;
}

.card-transition-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.8);
}

.card-transition-leave-to {
  opacity: 0;
  transform: translateX(-100px) scale(0.8);
}

.no-card-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: var(--text-color-secondary);
  min-height: 300px;
}

.no-card-placeholder .empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}
</style>
