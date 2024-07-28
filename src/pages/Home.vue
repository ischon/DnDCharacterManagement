<script setup>
// import {FirebaseHandler} from "@/helpers/firebase.js"
// import {CharacterAbilities} from "@/models/CharacterAbilities.js";

// const stats = new CharacterAbilities()
// stats.strength = 8
// stats.dexterity = 14
// stats.constitution = 16
// stats.intelligence = 16
// stats.wisdom = 10
// stats.charisma = 10
// stats.proficiencyBonus = 2
//
// stats.proficiencies.dexterity.push("Sleight of Hand")
// stats.proficiencies.constitution.push("Saving Throws")
// stats.proficiencies.intelligence.push("Saving Throws")
// stats.proficiencies.intelligence.push("Arcana")
// stats.proficiencies.intelligence.push("History")
// stats.proficiencies.intelligence.push("Investigation")
// stats.proficiencies.intelligence.push("Nature")
//
// console.log(stats.proficiencies)
//
// console.log(stats.abilities)


// const firebaseHandler = new FirebaseHandler()

// function uploadToFirebase() {
//   const user_data = JSON.parse(localStorage.getItem("UserData"))
//
//   firebaseHandler.setUserData(user_data['uid'])
// }
</script>

<template>
  <button @click="uploadToFirebase" content="hello world">Upload to firebase</button>
</template>

<style scoped>

</style>