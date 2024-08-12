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
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink v-if="!validToken" to="/login">Go to login</RouterLink>
    <RouterLink v-else to="/logout">Go to logout</RouterLink>
    <RouterLink to="/character/lzrh8rb4">Go to default</RouterLink>
    <RouterLink v-if="email === 'ian@schon.dev'" to="/character/lz825uz4">Go to owin</RouterLink>

  </nav>
  <br>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
