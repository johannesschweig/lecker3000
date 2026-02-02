<template>
  <div v-if="back" class="mb-4 grid grid-cols-[64px_1fr] gap-2 items-center">
    <RouterLink v-if="props.back" to="/home" class="btn btn-secondary place-self-center"> << </RouterLink>
    <Content :recipeId="props.recipeId" :initialContent="props.title" :contentType="ContentType.NAME" />
  </div>
  <div v-else class="mb-4">
    <span lang="de" class="text-4xl md:text-5xl opacity-90 hyphens-auto">{{ props.title }}</span>
    <RouterLink v-if="props.add" to="/upload" class="btn btn-add inline-block float-right mt-1">Add</RouterLink>
  </div>
</template>

<script setup lang="ts">
import Content from '@/components/Content.vue';
import { ContentType } from '@/stores/index';

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'New Recipe'
  },
  recipeId: {
    type: String,
    required: true,
    default: ''
  },
  back: Boolean,
  add: Boolean
})
</script>