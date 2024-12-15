<template>
  <div>
    <Header :title="recipe.name" :back="true" :add="false"></Header>
    <img v-if='recipe.thumbnail' :key="recipe.id" :src="recipe.thumbnail" :alt="recipe.name"
      class="rounded-2xl border border-black mb-8">
    <!-- Ingredients -->
    <Content :recipeId='recipe.id' :initialContent='recipe.ingredients' :contentType='ContentType.INGREDIENTS'/>
    <!-- Instruction -->
    <Content :recipeId='recipe.id' :initialContent='recipe.instruction' :contentType='ContentType.INSTRUCTION'/>
    <!-- Tags -->
    <div class="mb-8">
      <div class="text-2xl opacity-90 mb-2">Tags</div>
      <div>
        <Pill v-for="pill in recipe.tags" class="mr-2" :name='pill' :recipeId='recipe.id' :removable='true'/>
        <AddPill :recipeId='recipe.id' />
      </div>
    </div>  
    <div>
      <!-- <RouterLink to="/home" class="btn btn-delete" @click="deleteRecipe()" @mousedown="pressing()">Delete recipe</RouterLink> -->
      <button id='delete' class="btn" @mousedown="pressing()">Delete recipe</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore, ContentType  } from '@/stores/index'
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { computed } from 'vue';
import Header from '@/components/Header.vue'
import Pill from '@/components/Pill.vue'
import AddPill from '@/components/AddPill.vue'
import Content from '@/components/Content.vue'

const store = useStore()

const route = useRoute();
const router = useRouter();
const recipe = computed(() => {
  const r = store.recipes.find(r => r.id === route.params.id)
  return r ? r : { id: '123', name: 'ERROR', extension: 'ERROR', ingredients: 'ERROR', instruction: 'ERRROR', tags: [] }
})
const deleteRecipe = async () => {
  // store.deleteRecipe(recipe.value)
  // router.push({ name: 'home' })
}

const pressing = () => {
  console.log('pressing')
}
</script>

<style scoped>
#delete {
  transition: all ease 4s;
  /* background: linear-gradient(to left, red 50%, blue 50%) right; */
  /* background-size: 200% 100%; */
  background-color: #ffe0e0;
  box-shadow: inset 0 0 0 0 #31302B;
  user-select: none;
}

#delete:active {
  /* background-color: #ff0000; */
  /* background-position: left; */
  box-shadow: inset 100px 0 0 0 #ff0000;
}
</style>