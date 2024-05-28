<template>
  <div>
    <div class="mb-4">
      <div class="text-5xl font-semibold opacity-90 inline-block">Recipes</div>
      <RouterLink to="/upload" class="btn btn-add inline-block float-right mt-1">Add</RouterLink>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      <RouterLink v-for="recipe in store.sortedRecipes" :to="`/recipe/${recipe.id}`" class="bg-white border border-black rounded-2xl p-2 shadow">
        <img :key="recipe.id" :src="recipe.thumbnail" :alt="recipe.name" class="rounded-2xl border border-black mb-2">
        <p lang="de" class="text-2xl ml-1 opacity-90 hyphens-auto">{{ recipe.name }}</p>
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
