<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="mb-2">
    <RouterLink class="text-3xl" to="/home">Lecker3000</RouterLink>
    <RouterLink to="/" class="btn-secondary inline-block mb-4 float-end">⏻</RouterLink>
  </div>
  <RouterView />
</template>
