<template>
  <div>
    <Header :title="recipe.name" :back="true" :add="false"></Header>
    <img v-if='recipe.thumbnail' :key="recipe.id" :src="recipe.thumbnail" :alt="recipe.name"
      class="rounded-2xl border border-black mb-8">
    <!-- Ingredients -->
    <div class="mb-2">
      <div class="text-2xl opacity-90 inline-block">Ingredients</div>
      <button :class="['btn', editIngredients ? 'btn-primary' : 'btn-secondary', 'float-right']"
        @click="changeRecipe(ContentType.INGREDIENTS)">{{ editIngredients ? "Save" : "Edit" }}</button>
    </div>
    <div class="opacity-90 mb-4">
      <textarea v-if="editIngredients" rows="10" v-model="ingredients" placeholder="100g butter
1kg flour" class="text-lg my-2 rounded px-4 py-4 border border-black w-full"></textarea>
      <div v-else>
        <p v-for="ingredient in ingredients?.split('\n')"> {{ ingredient }}</p>
      </div>
    </div>
    <!-- Instruction -->
    <div class="mb-2">
      <div class="text-2xl opacity-90 inline-block">Instruction</div>
      <button :class="['btn', editInstruction ? 'btn-primary' : 'btn-secondary', 'float-right']"
        @click="changeRecipe(ContentType.INSTRUCTION)">{{ editInstruction ? "Save" : "Edit" }}</button>
    </div>
    <textarea v-if="editInstruction" rows="10" v-model="instruction" placeholder="Crack the eggs open
Boil the water" class="text-lg my-2 rounded px-4 py-4 border border-black w-full"></textarea>
    <ul v-else class="list-decimal list-inside opacity-90 mb-4">
      <li v-for="instruc in instruction?.split('\n')"> {{ instruc }}</li>
    </ul>
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
import { useStore, ContentType } from '@/stores/index'
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import Header from '@/components/Header.vue'
import Pill from '@/components/Pill.vue'
import AddPill from '@/components/AddPill.vue'

const store = useStore()
const ingredients = ref<string>('')
const instruction = ref<string>('')
const editIngredients = ref<Boolean>(false)
const editInstruction = ref<Boolean>(false)

const route = useRoute();
const router = useRouter();
const recipe = computed(() => {
  const r = store.recipes.find(r => r.id === route.params.id)
  return r ? r : { id: '123', name: 'ERROR', extension: 'ERROR', ingredients: 'ERROR', instruction: 'ERRROR', tags: [] }
})

const changeRecipe = async (contentType: ContentType) => {
  switch (contentType) {
    case ContentType.INGREDIENTS:
      editIngredients.value = !editIngredients.value
      if (!editIngredients.value) {
        store.changeRecipe(recipe.value.id, contentType, ingredients.value)
      }
      break
    case ContentType.INSTRUCTION:
      editInstruction.value = !editInstruction.value
      if (!editInstruction.value) {
        store.changeRecipe(recipe.value.id, contentType, instruction.value)
      }
      break
  }
}

const deleteRecipe = async () => {
  store.deleteRecipe(recipe.value)
  router.push({ name: 'home' })
}

onMounted(async () => {
  ingredients.value = recipe.value.ingredients
  instruction.value = recipe.value.instruction
})
</script>