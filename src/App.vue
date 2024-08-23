<script setup>
import {computed} from "vue";

const validToken = computed(() => {
  let token = localStorage.getItem('Token')

  return !!token;
})

const email = localStorage.getItem("UserData") ? JSON.parse(localStorage.getItem("UserData")).email : undefined

</script>

<template>
  <nav>
    <RouterLink v-if="validToken" to="/">Go to Home</RouterLink>
    <RouterLink v-if="validToken" to="/character/lzrh8rb4">Go to default</RouterLink>
    <RouterLink v-if="validToken && email === 'ian@schon.dev'" to="/character/lz825uz4">Go to owin</RouterLink>
    <RouterLink v-if="!validToken" to="/login">Go to login</RouterLink>
    <RouterLink v-else to="/logout">logout</RouterLink>
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
    background-color: var(--color-background-soft);

    &:hover {
      background-color: var(--color-background-mute);
    }

    &.exact-active {
      background-color: var(--color-background-mute);
      color: var(--color-text);
    }

    &:last-child {
      margin-right: 0;
      margin-left: auto;
    }

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
