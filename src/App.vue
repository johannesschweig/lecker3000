<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useStore } from '@/stores/index'
import { onMounted } from 'vue'

const store = useStore()

onMounted(() => {
  store.initializeAuth()
})
</script>

<template>
  <RouterView />
</template>
