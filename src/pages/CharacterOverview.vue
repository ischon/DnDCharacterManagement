<script setup>
import router from "@/router.js";

import {onBeforeMount, ref} from 'vue'
import {FirebaseHandler} from "@/helpers/firebase.js";

// setup() {
const characterId = router.currentRoute.value.params.id
const firebaseHandler = new FirebaseHandler()
const character = ref({})
console.log(characterId)

onBeforeMount(async () => {
  console.log("before mount")
  await firebaseHandler.setup()
  character.value = await firebaseHandler.getCharacterData(characterId)
  console.log(characterId)
  console.log(character.value)
})
</script>

<template>
  <div class="page container">
    <div class="header container row">
      <div class="col with-1">
        <div class="col with-1">
          <h1 class="content">{{ character.name }}</h1>
          <div class="label">Character Name</div>
        </div>
      </div>
      <div class="col with-2 container">
        <div class="row container">
          <div class="col with-1">
            <div class="content">{{ character.class }} {{ character.level }}</div>
            <div class="label">Class & Level</div>
          </div>
          <div class="col with-1">
            <div class="content">{{ character.background }}</div>
            <div class="label">Background</div>
          </div>
          <div class="col with-1">
            <div class="content">{{ firebaseHandler.firebaseUser.displayName }}</div>
            <div class="label">Player Name</div>
          </div>
        </div>
        <div class="row container">
          <div class="col with-1">
            <div class="content">{{ character.race }}</div>
            <div class="label">Race</div>
          </div>
          <div class="col with-1">
            <div class="content">{{ character.alignment }}</div>
            <div class="label">Alignment</div>
          </div>
          <div class="col with-1">
            <div class="content">{{ character.experiencePoints }}</div>
            <div class="label">Experience Points</div>
          </div>
        </div>
      </div>
    </div>
    <div class="body container row">

      <div class="col with-1">
        <div class="col with-1">

        </div>
        <div class="col with-2">

        </div>
      </div>
      <div class="col with-1">

      </div>
      <div class="col with-1">

      </div>
    </div>
  </div>
  <div class="page">
    <div class="header container row">
      <div class="col with-1">
        <div class="col with-1">
          <h1 class="content">{{ character.name }}</h1>
          <div class="label">Character Name</div>
        </div>
      </div>
      <div class="col with-2 container">
        <div class="row container">
          <div class="col with-1">
            <div class="content">{{ character.age }}</div>
            <div class="label">Age</div>
          </div>
          <div class="col with-1">
            <div class="content">{{ character.height }}</div>
            <div class="label">Height</div>
          </div>
          <div class="col with-1">
            <div class="content">{{ character.weight }}</div>
            <div class="label">Weight</div>
          </div>
        </div>
        <div class="row container">
          <div class="col with-1">
            <div class="content">{{ character.eyeColor }}</div>
            <div class="label">Eyes</div>
          </div>
          <div class="col with-1">
            <div class="content">{{ character.skinColor }}</div>
            <div class="label">Skin</div>
          </div>
          <div class="col with-1">
            <div class="content">{{ character.hairColor }}</div>
            <div class="label">Hair</div>
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="header container row">
        <div class="col with-1">
          <h1 class="content">{{ }}</h1>
          <div class="label">Spellcasting Class</div>
        </div>
        <div class="col with-2 container">
          <div class="row container">
            <div class="col with-1">
              <div class="content">{{ }}</div>
              <div class="label">Spellcasting Ability</div>
            </div>
            <div class="col with-1">
              <div class="content">{{ }}</div>
              <div class="label">Spell Save DC</div>
            </div>
            <div class="col with-1">
              <div class="content">{{ }}</div>
              <div class="label">Spell Attack Bonus</div>
            </div>
          </div>
        </div>
      </div>

      <div class="page">
        <div class="header">

        </div>
        <div class="body">

        </div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="sass">

</style>