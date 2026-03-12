<template>
  <nav v-if="debugMode">
    <router-link to="/">Dashboard</router-link> |
    <router-link to="/dm">DM Console</router-link> |
    <span v-if="isLoggedIn">
      <a href="#" @click.prevent="handleLogout">Logout</a>
    </span>
    <router-link v-else to="/login">Login</router-link>
  </nav>
  <router-view />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const debugMode = true; // Temporary flag for development
const isLoggedIn = ref(false);
const router = useRouter();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

const handleLogout = async () => {
  try {
    await auth.signOut();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<style>
nav {
  padding: 1rem;
  background: #333;
  color: white;
}
nav a {
  color: #42b983;
  text-decoration: none;
  margin: 0 0.5rem;
}
</style>
