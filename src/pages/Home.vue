<script setup>
  import { FirebaseHandler } from '@/helpers/firebase.js'
  import { exampleCharacter } from '@/models/Examples.js'
  import { onBeforeMount, reactive, ref } from 'vue'
  import { newCharacterId } from '@/models/CharacterHelperClasses.js'
  import { ICONS } from '../helpers/icons.js'
  import CharacterCard from '@/components/CharacterCard.vue'

  let clicked = ref(false)
  const firebaseHandler = new FirebaseHandler()
  let characterData = undefined
  let characters = ref([])
  let demoCharacter = undefined
  let newCharacter = undefined
  const loading = ref(true)

  onBeforeMount(async () => {
    await firebaseHandler.setup()
    await loadCharacters()
  })

  async function loadCharacters() {
    try {
      characterData = reactive(await firebaseHandler.getCharactersData())
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
    await firebaseHandler.setup()
    await firebaseHandler.setCharacterData(character.objectData)
  }

  function navigateToCharacter(id) {
    window.location.href = `/character/${id}`
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

    <router-link class="item" :to="{ path: '/character/' + newCharacter }">
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
