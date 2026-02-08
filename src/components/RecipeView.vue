<template>
  <!-- skeleton loading -->
  <div v-if="recipe.id === '123'">
    <div class="animate-pulse">
      <div class="w-full md:w-96 h-12 bg-slate-200 rounded-sm mb-2"></div>
      <div class="w-full md:w-[1000px] h-48 md:h-[800px] bg-slate-200 rounded-sm mb-8"></div>
      <div class="w-24 h-8 bg-slate-200 rounded-sm mb-2"></div>
      <div class="w-32 h-6 bg-slate-200 rounded-sm mb-2"></div>
      <div class="w-32 h-6 bg-slate-200 rounded-sm mb-2"></div>
      <div class="w-32 h-6 bg-slate-200 rounded-sm mb-4"></div>

      <div class="w-24 h-8 bg-slate-200 rounded-sm mb-2"></div>
      <div class="w-32 h-6 bg-slate-200 rounded-sm mb-2"></div>
      <div class="w-32 h-6 bg-slate-200 rounded-sm mb-2"></div>
      <div class="w-32 h-6 bg-slate-200 rounded-sm mb-4"></div>

      <div class="w-24 h-8 bg-slate-200 rounded-sm mb-2"></div>
      <div class="flex gap-2 mb-8">
        <div class="w-24 h-9 bg-slate-200 rounded-sm mb-2"></div>
        <div class="w-24 h-9 bg-slate-200 rounded-sm mb-2"></div>
      </div>
      <div class="w-36 h-9 bg-slate-200 rounded-sm mb-2"></div>
    </div>
  </div>
  <div v-else>
    <Header :title="recipe.name" :back="true" :add="false" :recipeId="String(route.params.id)"></Header>
    <!-- Image -->
    <img v-if='recipe.thumbnail' :key="recipe.id" :src="recipe.thumbnail" :alt="recipe.name"
      class="rounded-2xl border border-black mb-2">
    <div class="flex justify-end mb-8">
      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileChanged" />
      <button class="btn btn-secondary" @click='fileInput?.click()'>Change image</button>
    </div>
    <!-- Ingredients -->
    <Content :recipeId='recipe.id' :initialContent='recipe.ingredients' :contentType='ContentType.INGREDIENTS' />
    <!-- Instruction -->
    <Content :recipeId='recipe.id' :initialContent='recipe.instruction' :contentType='ContentType.INSTRUCTION' />
    <!-- Tags -->
    <PillContent :initialTags="recipe.tags" :onSave="updateTags" class="mb-8"/>
    
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
import Content from '@/components/Content.vue'
import { ref } from 'vue';
import PillContent from '@/components/PillContent.vue';

const store = useStore()

const route = useRoute();
const router = useRouter();
const fileInput = ref<HTMLInputElement | null>(null);
const recipe = computed(() => {
  const r = store.recipes.find(r => r.id === route.params.id)
  return r ? r : { id: '123', name: 'Loading...', extension: 'Loading...', ingredients: 'Loading...', instruction: 'Loading...', tags: [] }
})

const onFileChanged = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    await store.updateRecipeImage(recipe.value.id, file);
  }
};
const deleteRecipe = async () => {
  store.deleteRecipe(recipe.value)
  router.push({ name: 'home' })
}

const updateTags = async (newTags: string[]) => {
  store.updateRecipeTags(recipe.value.id, newTags)
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