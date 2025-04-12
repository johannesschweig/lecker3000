<template>
  <div v-if="recipe.id !== '123'">
    <div class="animate-pulse">
      <div class="w-96 h-12 bg-slate-200 rounded-sm mb-2"></div>
      <div class="w-5xl h-3xl bg-slate-200 rounded-sm mb-8"></div>
      <div class="w-96 h-12 bg-slate-200 rounded-sm mb-2"></div>
    </div>
  </div>
  <div v-else>
    <Header :title="recipe.name" :back="true" :add="false"></Header>
    <img v-if='recipe.thumbnail' :key="recipe.id" :src="recipe.thumbnail" :alt="recipe.name"
      class="rounded-2xl border border-black mb-8">
    <!-- Ingredients -->
    <Content :recipeId='recipe.id' :initialContent='recipe.ingredients' :contentType='ContentType.INGREDIENTS' />
    <!-- Instruction -->
    <Content :recipeId='recipe.id' :initialContent='recipe.instruction' :contentType='ContentType.INSTRUCTION' />
    <!-- Tags -->
    <div class="mb-8">
      <div class="text-2xl opacity-90 mb-2">Tags</div>
      <div>
        <Pill v-for="pill in recipe.tags" class="mr-2" :name='pill' :recipeId='recipe.id' :removable='true' />
        <AddPill :recipeId='recipe.id' />
      </div>
    </div>
    <div>
    </div>
    <div>
      <RouterLink to="/home" class="btn btn-delete" @click="deleteRecipe()">Delete recipe</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore, ContentType } from '@/stores/index'
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { computed, onMounted } from 'vue';
import Header from '@/components/Header.vue'
import Pill from '@/components/Pill.vue'
import AddPill from '@/components/AddPill.vue'
import Content from '@/components/Content.vue'

const store = useStore()

const route = useRoute();
const router = useRouter();
const recipe = computed(() => {
  const r = store.recipes.find(r => r.id === route.params.id)
  return r ? r : { id: '123', name: 'Loading...', extension: 'Loading...', ingredients: 'Loading...', instruction: 'Loading...', tags: [] }
})
const deleteRecipe = async () => {
  store.deleteRecipe(recipe.value)
  router.push({ name: 'home' })
}

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