<script setup>
  import { FirebaseHandler } from '@/helpers/firebase.js'
  import { exampleCharacter } from '@/models/Examples.js'
  import { onBeforeMount, reactive, ref } from 'vue'
  import { newCharacterId } from '@/models/CharacterHelperClasses.js'
  import { ICONS } from '../helpers/icons.js'

  let clicked = ref(false)
  const firebaseHandler = new FirebaseHandler()
  let characterData = undefined
  let characters = ref(undefined)
  let demoCharacter = undefined
  let newCharacter = undefined
  const loading = ref(false)

  onBeforeMount(async () => {
    await firebaseHandler.setup()
    await loadCharacters()
  })

  async function loadCharacters() {
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
    // console.log(characters);
    loading.value = false
  }

  async function uploadToFirebase(character) {
    clicked.value = true
    await firebaseHandler.setup()
    await firebaseHandler.setCharacterData(character.objectData)
  }
</script>

<template>
  <h1>Your Characters</h1>

  <div v-if="loading">Loading...</div>
  <div class="list" v-else>
    <router-link
      v-if="characters"
      v-for="character in characters"
      class="item"
      :to="{ path: '/character/' + character.id }"
    >
      {{ character.detailName }}
    </router-link>

    <hr />

    <router-link v-if="demoCharacter" class="item" :to="{ path: '/character/' + demoCharacter.id }">
      Example character: {{ demoCharacter.detailName }}
    </router-link>

    <hr />

    <router-link
      class="item"
      :to="{ path: '/character/' + newCharacter }"
      v-html="ICONS.ADD.XXLARGE + 'Add new character'"
    >
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

      &:hover {
        background-color: var(--color-background-mute);
      }
    }

    hr {
      border: none;
      border-top: 2px solid #333;
      width: 80%; /* Adjust the width */
      margin: 0.5rem auto; /* Center it */
    }
  }
</style>
