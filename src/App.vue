<script setup>
  import { computed, ref, onMounted } from 'vue'
  import { FirebaseHandler } from '@/helpers/firebase.js'
  import { onAuthStateChanged } from 'firebase/auth'
  import { auth } from '@/services/firebase/app.js'

  const uid = ref(undefined)
  const firebaseHandler = new FirebaseHandler()
  const isAuthenticated = ref(false)
  const isLoading = ref(true)
  const isFirebaseReady = ref(false)

  // Watch for authentication state changes
  onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User signed in' : 'User signed out')

      if (user) {
        // User is signed in
        isAuthenticated.value = true
        uid.value = user.uid.slice(0, 8)

        // Setup Firebase services
        try {
          await firebaseHandler.setup()
          isFirebaseReady.value = true
          console.log('Firebase setup completed successfully')
        } catch (error) {
          console.error('Failed to setup Firebase services:', error)
          isFirebaseReady.value = false
        }
      } else {
        // User is signed out
        isAuthenticated.value = false
        uid.value = undefined
        isFirebaseReady.value = false
        console.log('User signed out')
      }
      isLoading.value = false
    })
  })

  // Computed property for navigation
  const validToken = computed(() => isAuthenticated.value && isFirebaseReady.value)

  const handleLogout = async () => {
    try {
      await firebaseHandler.signOut()
      // Redirect to login page
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
</script>

<template>
  <nav>
    <div class="nav-left">
      <RouterLink v-if="isAuthenticated" to="/">Home</RouterLink>
    </div>
    <div class="nav-right">
      <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
      <button v-else @click="handleLogout" class="logout-btn">Logout</button>
    </div>
  </nav>
  <main>
    <div v-if="isLoading" class="loading">
      Loading...
    </div>
    <RouterView v-else />
  </main>
</template>

<style scoped>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
    padding: 0 1rem;

    .nav-left, .nav-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    a {
      padding: 1rem;
      background-color: var(--color-background-soft);
      border-radius: 0.5rem;
      text-decoration: none;
      color: var(--color-text);
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--color-background-mute);
      }

      &.exact-active {
        background-color: var(--color-background-mute);
        color: var(--color-text);
      }
    }

    .logout-btn {
      border: none;
      cursor: pointer;
      color: var(--color-text);
      font-size: inherit;
      font-family: inherit;
      border-radius: 0.5rem;
      background-color: var(--color-background-soft);
      transition: background-color 0.2s;
      padding: 1rem;
      text-decoration: none;

      &:hover {
        background-color: var(--color-background-mute);
      }

      &:active {
        background-color: var(--color-background);
      }
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    font-size: 1.2rem;
  }
</style>
