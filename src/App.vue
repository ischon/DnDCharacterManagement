<script setup>
import {computed} from "vue";

const validToken = computed(() => {
  let token = localStorage.getItem('Token')

  if (token){
    console.log("token found")
    return true
  }
  else {
    console.log("no token found")
    return false
  }
})

</script>

<template>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink v-if="!validToken" to="/login">Go to login</RouterLink>
    <RouterLink v-else to="/logout">Go to logout</RouterLink>
    <RouterLink to="/character/lz825uz4">Go to character</RouterLink>

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
