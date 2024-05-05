<template>
  <div class="mb-8">
    <div class="text-2xl mb-4">Recipes</div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      <RouterLink v-for="recipe in store.recipes" :to="`/recipe/${recipe.id}`">
        <img :key="recipe.id" :src="recipe.thumbnail" :alt="recipe.name" class="rounded-lg">
        <div class="text-md">{{ recipe.name }}</div>
      </RouterLink>
      <FileUpload class="col-span-2 md:col-span-1"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import FileUpload from '@/components/FileUpload.vue';
import { useStore } from '@/stores/index'
import { RouterLink } from 'vue-router';

const t = '1'
const store = useStore()
</script>
