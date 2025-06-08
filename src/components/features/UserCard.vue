<template>
  <div
    class="user-card"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="card-image">
      <img v-if="user.avatar" :src="user.avatar" :alt="`${user.firstName} ${user.lastName}`" />
      <div v-else class="avatar-placeholder">
        <i class="pi pi-user"></i>
      </div>
      <div class="card-gradient"></div>
    </div>

    <div class="card-content">
      <div class="user-info">
        <h3>{{ user.firstName }} {{ user.lastName }}, {{ user.age }}</h3>
        <p v-if="user.bio" class="bio">{{ user.bio }}</p>
        <div class="interests">
          <Tag
            v-for="interest in user.interests.slice(0, 3)"
            :key="interest"
            :value="interest"
            class="interest-tag"
          />
        </div>
      </div>

      <div class="card-actions">
        <Button
          icon="pi pi-times"
          class="p-button-rounded p-button-outlined reject-btn"
          @click="() => handleSwipe('reject')"
          aria-label="Reject"
          size="large"
        />
        <Button
          icon="pi pi-heart"
          class="p-button-rounded like-btn"
          @click="() => handleSwipe('like')"
          aria-label="Like"
          size="large"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MatchUser } from '@/types'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { ref } from 'vue'

interface Props {
  user: MatchUser
}

interface Emits {
  (event: 'swipe', userId: string, isLike: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Touch handling for swipe gestures
const startX = ref(0)
const currentX = ref(0)
const isDragging = ref(false)

const handleTouchStart = (e: TouchEvent) => {
  startX.value = e.touches[0].clientX
  isDragging.value = true
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  currentX.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  if (!isDragging.value) return

  const deltaX = currentX.value - startX.value
  const threshold = 100

  if (Math.abs(deltaX) > threshold) {
    const isLike = deltaX > 0
    handleSwipe(isLike ? 'like' : 'reject')
  }

  isDragging.value = false
}

const handleSwipe = (action: 'like' | 'reject') => {
  const isLike = action === 'like'

  // Add visual feedback to the card
  const card = document.querySelector('.user-card') as HTMLElement
  if (card) {
    card.style.transform = isLike
      ? 'translateX(100px) rotate(15deg)'
      : 'translateX(-100px) rotate(-15deg)'
    card.style.opacity = '0.5'

    // Reset after animation
    setTimeout(() => {
      emit('swipe', props.user.id, isLike)
    }, 300)
  } else {
    emit('swipe', props.user.id, isLike)
  }
}
</script>

<style scoped>
.user-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  height: 500px;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: grab;
  transition: all 0.3s ease;
  z-index: 1;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 60%;
  background: var(--surface-100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 4rem;
  color: var(--text-color-secondary);
}

.card-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}

.card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  color: white;
}

.user-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.bio {
  margin: 0 0 1rem 0;
  opacity: 0.9;
  font-size: 0.9rem;
  line-height: 1.4;
}

.interests {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.interest-tag {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  padding: 0 1rem;
  margin-top: 1rem;
}

.reject-btn {
  width: 3.5rem;
  height: 3.5rem;
  color: var(--red-500);
  border: 3px solid var(--red-500);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.reject-btn .pi {
  font-size: 1.2rem;
}

.like-btn {
  width: 3.5rem;
  height: 3.5rem;
  background: var(--pink-500);
  color: white;
  border: 3px solid var(--pink-500);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.like-btn .pi {
  font-size: 1.2rem;
}

.reject-btn:hover {
  background: var(--red-50);
  transform: scale(1.1);
  transition: all 0.2s ease;
}

.like-btn:hover {
  background: var(--pink-600);
  transform: scale(1.1);
  transition: all 0.2s ease;
}
</style>
