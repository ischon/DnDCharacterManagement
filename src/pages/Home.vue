<script setup>
  import { exampleCharacter } from '@/models/Examples.js'
  import { onBeforeMount, reactive, ref } from 'vue'
  import { newCharacterId } from '@/models/CharacterHelperClasses.js'
  import { ICONS } from '../helpers/icons.js'
  import CharacterCard from '@/components/CharacterCard.vue'
  import { onAuthStateChanged } from 'firebase/auth'
  import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore'
  import { auth } from '@/services/firebase/app.js'
  import { Character } from '@/models/Character.js'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  let clicked = ref(false)
  let characterData = undefined
  let characters = ref([])
  let demoCharacter = undefined
  let newCharacter = undefined
  const loading = ref(true)

  onBeforeMount(async () => {
    try {
      loading.value = true

      // Wait for authentication state to be determined
      await new Promise(resolve => {
        const unsubscribe = onAuthStateChanged(auth, user => {
          unsubscribe()
          resolve(user)
        })

        // Timeout after 3 seconds
        setTimeout(() => {
          unsubscribe()
          resolve(null)
        }, 3000)
      })

      // Check if user is authenticated
      const user = auth.currentUser
      if (!user) {
        console.log('No authenticated user found in Home component')
        loading.value = false
        return
      }

      console.log('User authenticated in Home component, loading characters')
      await loadCharacters()
    } catch (error) {
      console.error('Failed to load characters:', error)
      characters.value = []
    } finally {
      loading.value = false
    }
  })

  async function loadCharacters() {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('No authenticated user found')
      }

      const db = getFirestore()
      const charactersPath = `users/${user.uid}/characters`
      const charactersRef = collection(db, charactersPath)
      const charactersSnapshot = await getDocs(charactersRef)

      characterData = reactive(
        charactersSnapshot.docs.map(doc => new Character(doc.data(), doc.id))
      )

      demoCharacter = characterData.find(item => item.id === exampleCharacter.id)
      if (!demoCharacter) {
        demoCharacter = exampleCharacter
        console.log('uploading example character')
        await uploadToFirebase(demoCharacter)
        characterData.push(demoCharacter)
      }

      characters.value = characterData
        .filter(item => item.id !== exampleCharacter.id)
        .sort((a, b) => a.detailName.localeCompare(b.detailName))
      newCharacter = ref(newCharacterId())
    } catch (error) {
      console.error('Error loading characters:', error)
      characters.value = []
    } finally {
      loading.value = false
    }
  }

  async function uploadToFirebase(character) {
    clicked.value = true
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('No authenticated user found')
      }

      const db = getFirestore()
      const characterPath = `users/${user.uid}/characters/${character.id}`
      const characterRef = doc(db, characterPath)
      await setDoc(characterRef, character.objectData)
    } catch (error) {
      console.error('Failed to upload character to Firebase:', error)
    }
  }

  function navigateToCharacter(id) {
    router.push(`/character/${id}`)
  }
</script>

<template>
  <h1>Your Characters</h1>

  <div v-if="loading">Loading...</div>
  <div v-else class="list">
    <template v-if="characters.length > 0">
      <character-card
        v-for="character in characters"
        :key="character.id"
        :character="character"
        @click="navigateToCharacter(character.id)"
      />
    </template>

    <hr />

    <character-card
      v-if="demoCharacter"
      :character="demoCharacter"
      class="example-character"
      @click="navigateToCharacter(demoCharacter.id)"
    >
      <template #prefix>
        <span class="example-label">Example character</span>
      </template>
    </character-card>

    <hr />

    <router-link class="item" :to="`/character/${newCharacter}`">
      <span v-html="ICONS.ADD.XXLARGE"></span> Add new character
    </router-link>
  </div>
</template>

<style scoped>
  h1 {
    margin: 1rem 0;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .item {
      padding: 1rem;
      background-color: var(--color-background-soft);
      border-radius: 0.5rem;
      transition: background-color 0.2s;
      display: flex;
      align-items: center; /* Aligns text vertically */
      gap: 0.5rem; /* Add gap between icon and text */

      &:hover {
        background-color: var(--color-background-mute);
      }

      :deep(svg) {
        display: inline-block;
        vertical-align: middle;
      }
    }

    .example-character {
      position: relative;
      border: 2px solid var(--color-border);
    }

    .example-label {
      position: absolute;
      top: -0.5rem;
      left: 1rem;
      background-color: var(--color-background);
      padding: 0 0.5rem;
      font-size: 0.8rem;
      color: var(--color-text-light);
    }

    hr {
      border: none;
      border-top: 2px solid #333;
      width: 80%; /* Adjust the width */
      margin: 0.5rem auto; /* Center it */
    }
  }
</style>
