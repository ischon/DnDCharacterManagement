<script setup>
  import { computed, ref, watch } from 'vue'
  import { FirebaseHandler } from '@/helpers/firebase.js'

  const validToken = computed(() => {
    let token = localStorage.getItem('Token')

    return !!token
  })

  const uid = ref(undefined)
  const firebaseHandler = new FirebaseHandler()

  // Only setup Firebase when there's a valid token
  watch(validToken, async (hasToken) => {
    if (hasToken) {
      try {
        await firebaseHandler.setup()
        uid.value = firebaseHandler.firebaseUser.uid.slice(0, 8)
      } catch (error) {
        console.error('Failed to setup Firebase:', error)
        // If setup fails, clear the token and redirect to login
        localStorage.removeItem('Token')
        localStorage.removeItem('UserData')
      }
    } else {
      // Reset uid when no token
      uid.value = undefined
    }
  }, { immediate: true })
</script>

<template>
  <nav>
    <RouterLink v-if="validToken" to="/">Go to Home</RouterLink>
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
