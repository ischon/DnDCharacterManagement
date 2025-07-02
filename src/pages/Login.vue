<script setup>
  import { ref, onMounted } from 'vue'
  import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
  import { auth } from '@/services/firebase/app.js'

  const isSigningIn = ref(false)
  const errorMessage = ref('')

  const handleGoogleSignIn = async () => {
    isSigningIn.value = true
    errorMessage.value = ''

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      if (result.user) {
        console.log('Successfully signed in:', result.user.email)
        // Redirect to home page
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Sign-in error:', error)

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage.value = 'Sign-in was cancelled. Please try again.'
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage.value = 'Pop-up was blocked. Please allow pop-ups for this site and try again.'
      } else {
        errorMessage.value = 'Sign-in failed. Please try again.'
      }
    } finally {
      isSigningIn.value = false
    }
  }

  onMounted(() => {
    // Let the router handle redirects
    console.log('Login page mounted')
  })
</script>

<template>
  <div class="login-container">
    <h1>Welcome to D&D App</h1>
    <p>Please sign in to continue</p>

    <button
      @click="handleGoogleSignIn"
      :disabled="isSigningIn"
      class="google-signin-btn"
    >
      {{ isSigningIn ? 'Signing in...' : 'Sign in with Google' }}
    </button>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    gap: 1rem;
  }

  .google-signin-btn {
    padding: 1rem 2rem;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .google-signin-btn:hover:not(:disabled) {
    background-color: #357abd;
  }

  .google-signin-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .error {
    color: #d32f2f;
    margin-top: 1rem;
  }
</style>
