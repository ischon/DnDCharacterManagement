<script setup>
  import { ref, onMounted } from 'vue'
  import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage'
  import { auth } from '@/services/firebase/app.js'

  const props = defineProps({
    character: {
      type: Object,
      required: true
    }
  })

  const profileImage = ref(null)
  const isLoading = ref(true)

  onMounted(async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        console.log('No authenticated user for character image')
        isLoading.value = false
        return
      }

      const storage = getStorage()
      const imagePath = `users/${user.uid}/characters/${props.character.id}`
      const imageRef = storageRef(storage, imagePath)

      const imageUrl = await getDownloadURL(imageRef)
      if (imageUrl) {
        profileImage.value = imageUrl
      }
    } catch (error) {
      console.error('Error loading character image:', error)
      // Handle specific storage errors
      if (error.code === 'storage/object-not-found') {
        console.log('Character image not found, using placeholder')
      } else {
        console.error('Storage error:', error.code)
      }
    } finally {
      isLoading.value = false
    }
  })
</script>

<template>
  <div class="character-card">
    <slot name="prefix"></slot>
    <div class="character-image">
      <img v-if="profileImage" :src="profileImage" alt="Character portrait" />
      <div v-else class="placeholder-image">
        {{ character.detailName?.charAt(0) || '?' }}
      </div>
    </div>
    <div class="character-info">
      <h3>{{ character.detailName }}</h3>
      <p v-if="character.detailClass">{{ character.detailClass }}</p>
      <p v-if="character.detailRace">{{ character.detailRace }}</p>
    </div>
  </div>
</template>

<style scoped>
  .character-card {
    padding: 1rem;
    background-color: var(--color-background-soft);
    border-radius: 0.5rem;
    transition: background-color 0.2s;
    cursor: pointer;
    display: flex;
    gap: 1rem;
    align-items: center;
    position: relative;
  }

  .character-card:hover {
    background-color: var(--color-background-mute);
  }

  .character-image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background-color: var(--color-background-mute);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .character-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text-light);
  }

  .character-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-grow: 1;
  }

  h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    color: var(--color-text-light);
  }
</style>
