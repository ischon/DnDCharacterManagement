<script setup>
import {computed} from "vue";

const validToken = computed(() => {
  let token = localStorage.getItem('Token')

  if (token){
    // console.log("token found")
    return true
  }
  else {
    // console.log("no token found")
    return false
  }
})

const email = localStorage.getItem("UserData") ? JSON.parse(localStorage.getItem("UserData")).email : undefined

</script>

<template>
  <nav>
    <RouterLink v-if="validToken" to="/">Go to Home</RouterLink>
    <RouterLink v-if="validToken" to="/character/lzrh8rb4">Go to default</RouterLink>
    <RouterLink v-if="validToken && email === 'ian@schon.dev'" to="/character/lz825uz4">Go to owin</RouterLink>
    <RouterLink v-if="!validToken" style="align-self: end" to="/login">Go to login</RouterLink>
    <RouterLink v-else style="align-self: end" to="/logout">logout</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: left;
  margin: 1rem 0;

  * {
    padding: 1rem;
    margin: 0 1rem;
    background-color: var(--color-background-mute);

    &:hover {
      background-color: var(--color-background-soft);
    }

    &.exact-active {
      background-color: var(--color-background-soft);
      color: var(--color-text);
    }

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
