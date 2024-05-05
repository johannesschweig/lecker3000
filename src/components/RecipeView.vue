<template>
  <div>
    <div class="text-2xl mb-4">{{ recipe.name }}</div>
    <img :key="recipe.id" :src="recipe.thumbnail" :alt="recipe.name" class="rounded-lg mb-8">
    <button class="btn-delete" @click="store.deleteRecipe(recipe.id)">Delete recipe</button>
  </div>
</template>

<script setup>
import { useStore } from '@/stores/index.ts'
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const store = useStore()

const route = useRoute();
const recipe = computed(() => {
  const r = store.recipes.find(r => r.id === route.params.id)
  return r ? r : { id: '123', name: 'ERROR' }
})

</script>