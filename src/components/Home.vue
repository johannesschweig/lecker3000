<template>
  <div class="mb-8">
    <RouterLink to="/upload" class="btn-primary inline-block mb-4">+</RouterLink>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      <RouterLink v-for="recipe in store.sortedRecipes" :to="`/recipe/${recipe.id}`" class="bg-slate-200 rounded-md">
        <img :key="recipe.id" :src="recipe.thumbnail" :alt="recipe.name" class="rounded-t-md">
        <div class="text-lg mx-3 mb-2 mt-2">{{ recipe.name }}</div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/stores/index'
import { RouterLink } from 'vue-router';
import { onMounted } from 'vue';

const store = useStore()

onMounted(async () => {
  const store = useStore()
  // only load data if necessary
  if (!store.thumbnailsLoaded && !store.dataLoaded) {
    try {
      await store.loadDataFromDropbox()
      await store.loadThumbnails()
      console.log('Loaded dropbox data and thumbnails successfully');
    } catch (error) {
      console.error('Error:', error);
    }
  }
})
</script>
