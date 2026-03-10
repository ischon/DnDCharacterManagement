<script setup>
  import router from '@/router.js'
  import { onMounted } from 'vue'

  onMounted(() => {
    router.replace('/login')
  })
</script>

<template>
  <h1>You have been logged out</h1>
</template>

<style scoped></style>
