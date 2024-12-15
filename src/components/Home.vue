<template>
  <div>
    <Header
      title="Recipes"
      :back="false"
      :add="true"
    />
    <!-- Filter -->
    <div class='mb-4'>
      <span class='text-2xl mr-2'>Show:</span>
      <Pill v-for='tag in store.getTags' :name='tag' :filterable='true' />
    </div>
    <!-- List -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      <RouterLink v-for="recipe in store.sortedRecipes" :to="`/recipe/${recipe.id}`"
        class="bg-white border border-black rounded-2xl p-2 shadow">
        <img :key="recipe.id" :src="recipe.thumbnail" :alt="recipe.name" class="rounded-xl border border-black mb-2">
        <p lang="de" class="text-2xl ml-1 mb-1 opacity-90 hyphens-auto">{{ recipe.name }}</p>
        <Pill v-for='tag in recipe.tags' :name='tag' :recipeId='recipe.id' />
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/stores/index'
import { RouterLink } from 'vue-router';
import { onMounted } from 'vue';
import Header from '@/components/Header.vue'
import Pill from '@/components/Pill.vue'

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
