<template>
  <div class="login-container">
    <div class="login-card">
      <h1>D&D Character Management V2</h1>
      <p>Log in to manage your characters and parties</p>
      
      <div class="login-actions">
        <!-- Official Google Login Button via vue3-google-login -->
        <GoogleLogin :callback="handleLogin" />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { GoogleLogin, type CallbackTypes } from 'vue3-google-login';
import { auth } from '../services/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const router = useRouter();
const error = ref<string | null>(null);

const handleLogin: CallbackTypes.CredentialCallback = async (response) => {
  try {
    // 1. Get the Google Credential from the response
    const credential = GoogleAuthProvider.credential(response.credential);
    
    // 2. Sign in to Firebase with the Google Credential
    await signInWithCredential(auth, credential);
    
    // 3. Navigate to Dashboard
    router.push('/');
  } catch (e: any) {
    console.error('Login Error:', e);
    error.value = 'Failed to sign in with Google. Please try again.';
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #121212;
  color: white;
}

.login-card {
  background: #1e1e1e;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

h1 {
  margin-bottom: 1rem;
  color: #42b983;
  line-height: 1.2;
}

p {
  color: #aaa;
  margin-bottom: 2rem;
}

.login-actions {
  display: flex;
  justify-content: center;
}

.error-message {
  margin-top: 1rem;
  color: #ff5252;
  font-size: 0.9rem;
}
</style>
