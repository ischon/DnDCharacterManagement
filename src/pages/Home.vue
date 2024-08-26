<script setup>
import {FirebaseHandler} from "@/helpers/firebase.js"
import { exampleCharacter } from "@/models/Examples.js";
import { ref } from "vue";

let clicked = ref(false)

async function uploadToFirebase(character) {
  clicked.value = true
  const firebaseHandler = new FirebaseHandler()
  await firebaseHandler.setup()
  await firebaseHandler.setCharacterData(character.objectData)
}

const email = localStorage.getItem("UserData") ? JSON.parse(localStorage.getItem("UserData")).email : undefined
</script>

<template>
  <button v-if="!clicked" @click="uploadToFirebase(exampleCharacter)" >Upload default to firebase </button>
  <br v-if="!clicked">
<!--  <button v-if="!clicked && email === 'ian@schon.dev'" @click="uploadToFirebase(owin)">Upload owin to firebase</button>-->
  <br v-if="!clicked && email === 'ian@schon.dev'">
  home
</template>

<style scoped>

</style>