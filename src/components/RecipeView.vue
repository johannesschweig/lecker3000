<template>
  <div>
    <Header :title="recipe.name" :back="true" :add="false"></Header>
    <img v-if='recipe.thumbnail' :key="recipe.id" :src="recipe.thumbnail" :alt="recipe.name"
      class="rounded-2xl border border-black mb-8">
    <!-- <div class="mb-2">
      <div class="text-2xl opacity-90 inline-block">Ingredients</div>
      <button class="btn btn-secondary float-right">Edit</button>
    </div>
    <div class="opacity-90 mb-4">
      <p>Lorem ipsum</p>
      <p>Lorem ipsum</p>
      <p>Lorem ipsum</p>
      <p>Lorem ipsum</p>
      <p>Lorem ipsum</p>
      <p>Lorem ipsum</p>
    </div>
    <div class="mb-2">
      <div class="text-2xl opacity-90 inline-block">Instructions</div>
      <button class="btn btn-secondary float-right">Edit</button>
    </div>
    <ul class="list-decimal list-inside opacity-90 mb-4">
      <li>Lorem ipsum</li>
      <li>Lorem ipsum</li>
      <li>Lorem ipsum</li>
      <li>Lorem ipsum</li>
      <li>Lorem ipsum</li>
      <li>Lorem ipsum</li>
    </ul> -->
    <RouterLink to="/home" class="btn btn-delete" @click="deleteRecipe()">Delete recipe</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/stores/index'
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { computed } from 'vue';
import Header from '@/components/Header.vue'

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