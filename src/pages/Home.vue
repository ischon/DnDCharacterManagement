<script setup>
import {FirebaseHandler} from "@/helpers/firebase.js"
import { exampleCharacter } from "@/models/Examples.js";
import { ref } from "vue";

let clicked = ref(false)

async function uploadToFirebase() {
  clicked.value = true
  const firebaseHandler = new FirebaseHandler()
  await firebaseHandler.setup()
  await firebaseHandler.setCharacterData(exampleCharacter.objectData)
}
</script>

<template>
  <button v-if="!clicked" @click="uploadToFirebase" >Upload to firebase</button>
  home
</template>

<style scoped>

</style>