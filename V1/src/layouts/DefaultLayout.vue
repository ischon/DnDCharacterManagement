<template>
  <div class="default-layout">
    <header class="header">
      <nav>
        <!-- Add your navigation here -->
      </nav>
    </header>

    <main class="main-content">
      <router-view></router-view>
    </main>

    <footer class="footer">
      <!-- Add your footer content here -->
    </footer>
  </div>
</template>

<script setup>
  // Layout component logic here
</script>

<style scoped lang="scss">
  .default-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    padding: 1rem;
  }

  .header {
    padding: 1rem;
    background-color: #f8f9fa;
  }

  .footer {
    padding: 1rem;
    background-color: #f8f9fa;
  }
</style>
