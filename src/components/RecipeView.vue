<template>
  <div>
    <Header :title="recipe.name" :back="true" :add="false"></Header>
    <img v-if='recipe.thumbnail' :key="recipe.id" :src="recipe.thumbnail" :alt="recipe.name"
      class="rounded-2xl border border-black mb-8">
    <!-- Ingredients -->
    <Ingredients :recipeId='recipe.id' :initialContent='recipe.ingredients'/>
    <!-- Instruction -->
    <Instruction :recipeId='recipe.id' :instruction='recipe.instruction'/>
    <!-- Tags -->
    <div class="mb-8">
      <div class="text-2xl opacity-90 mb-2">Tags</div>
      <div>
        <Pill v-for="pill in recipe.tags" class="mr-2" :name='pill' :recipeId='recipe.id' :removable='true'/>
        <AddPill :recipeId='recipe.id' />
      </div>
    </div>  
    <div>
      <RouterLink to="/home" class="btn btn-delete" @click="deleteRecipe()">Delete recipe</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/stores/index'
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { computed } from 'vue';
import Header from '@/components/Header.vue'
import Pill from '@/components/Pill.vue'
import AddPill from '@/components/AddPill.vue'
import Ingredients from '@/components/Ingredients.vue'
import Instruction from '@/components/Instruction.vue'

const store = useStore()

const route = useRoute();
const router = useRouter();
const recipe = computed(() => {
  const r = store.recipes.find(r => r.id === route.params.id)
  return r ? r : { id: '123', name: 'ERROR', extension: 'ERROR', ingredients: 'ERROR', instruction: 'ERRROR', tags: [] }
})
const deleteRecipe = async () => {
  store.deleteRecipe(recipe.value)
  router.push({ name: 'home' })
}
</script>