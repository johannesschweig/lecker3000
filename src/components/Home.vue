<template>
  <div>
    <Header title="Recipes" :back="false" :add="true" />
    <!-- TODO: this is basically useless as data loads fast, but images slow. make skeleton react ot image load (<img @load="onImageLoad") -->
    <div v-if="!store.dataLoaded" class="animate-pulse">
      <div class="w-full md:w-96 h-12 bg-slate-200 rounded-sm mb-2"></div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="i in 4" class="bg-slate-200 h-48 rounded-2xl p-2 brutalist-drop-1" />
      </div>
    </div>
    <div v-else>
      <!-- Filter -->
      <div class='mb-4'>
        <span class='text-xl md:text-2xl mr-2'>Show:</span>
        <Pill v-for='tag in store.getTags' :name='tag' :filterable='true' />
      </div>
      <!-- List -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <RouterLink v-for="recipe in store.sortedRecipes" :to="`/recipe/${recipe.id}`"
          class="bg-white border border-black rounded-2xl p-1 brutalist-drop-1 transition hover:-translate-[1px] hover:brutalist-drop-2 active:translate-[2px] active:brutalist-drop-none">
          <img :key="recipe.id" :src="getThumbnail(recipe)" :alt="recipe.name"
            class="rounded-xl border-black mb-2 aspect-square object-cover">
          <p lang="de" class="text-xl md:text-2xl ml-1 mb-1 opacity-90 hyphens-auto">{{ recipe.name }}</p>
          <div class="mb-2">
            <Pill v-for='tag in recipe.tags' :name='tag' :recipeId='recipe.id' />
          </div>
        </RouterLink>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/stores/index'
import { RouterLink } from 'vue-router';
import Header from '@/components/Header.vue'
import Pill from '@/components/Pill.vue'
import { getThumbnailUrl } from '@/utils'

const store = useStore()

function getThumbnail(recipe: any) {
  return getThumbnailUrl(recipe)
}
</script>
