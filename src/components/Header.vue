<template>
  <div v-if="back" class="mb-4 grid grid-cols-[64px_1fr] gap-2">
    <RouterLink v-if="props.back" to="/home" class="btn btn-secondary place-self-center"> << </RouterLink>
    <span lang="de" class="text-5xl opacity-90 hyphens-auto">{{ props.title }}</span>
  </div>
  <div v-else class="mb-4">
    <span lang="de" class="text-5xl opacity-90 hyphens-auto">{{ props.title }}</span>
    <RouterLink v-if="props.add" to="/upload" class="btn btn-add inline-block float-right mt-1">Add</RouterLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
  back: Boolean,
  add: Boolean,
})
</script>