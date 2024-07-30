<script setup>
import router from "@/router.js";

import { onBeforeMount, watch, computed, ref } from 'vue'
// import {exampleCharacter} from "@/models/Examples.js";
import {FirebaseHandler} from "@/helpers/firebase.js";

// setup() {
const characterId = router.currentRoute.value.params.id
const firebaseHandler = new FirebaseHandler()
const characterData = ref(0)
console.log(characterId)

onBeforeMount(async ()=>{
  console.log("before mount")
  await firebaseHandler.setup()
  characterData.value = await firebaseHandler.getCharacterData(characterId)
  console.log(characterId)
  console.log(characterData.value)
})
</script>

<template>
  character
  <br>

  {{ characterId }}
  <br>
  {{ characterData.value }}

</template>

<style scoped>

</style>