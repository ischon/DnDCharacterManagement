<script setup>
import router from "@/router.js";

import { onBeforeMount } from 'vue'
// import {exampleCharacter} from "@/models/Examples.js";
import {FirebaseHandler} from "@/helpers/firebase.js";

const data = {
  characterId: router.currentRoute.value.params.id,
  characterData: {}
}

const firebaseHandler = new FirebaseHandler()
await firebaseHandler.setup()
data.characterData = await firebaseHandler.getCharacterData(data.characterId)
// firebaseHandler.setCharacterData(exampleCharacter.objectData)
console.log(data.characterId)
console.log(JSON.stringify(data.characterData))

onBeforeMount(async ()=> {
  console.log(data.characterId)
})




</script>

<template>
  character
  <br>

  {{ data.characterId }}
  <br>
  {{ JSON.stringify(data.characterData) }}

</template>

<style scoped>

</style>