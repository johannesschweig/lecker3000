<template>
  <div>
    <div class="text-2xl mb-4">{{ recipe.name }}</div>
    <img v-if='recipe.thumbnail' :key="recipe.id" :src="recipe.thumbnail" :alt="recipe.name"
      class="rounded-lg mb-8 max-w-screen-md ">
    <RouterLink to="/home" class="btn-delete" @click="deleteRecipe()">Delete recipe</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/stores/index'
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { computed } from 'vue';

const store = useStore()

const route = useRoute();
const router = useRouter();
const recipe = computed(() => {
  const r = store.recipes.find(r => r.id === route.params.id)
  return r ? r : { id: '123', name: 'ERROR', extension: 'ERROR' }
})

const deleteRecipe = async () => {
  store.deleteRecipe(recipe.value)
  router.push({ name: 'home' })
}
</script>