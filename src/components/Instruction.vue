<template>
  <div class="mb-2">
    <div class="text-2xl opacity-90 inline-block">Instruction</div>
    <div v-if='editInstruction' class="float-right">
      <button class="btn btn-secondary mr-2" @click="editInstruction = false">Cancel</button>
      <button class="btn btn-primary" @click="changeRecipe(ContentType.INSTRUCTION)">Save</button>
    </div>
    <button v-else class="btn btn-secondary float-right"
      @click="editInstruction = true">Edit</button>
  </div>
  <textarea v-if="editInstruction" rows="10" v-model="instruction" placeholder="Crack the eggs open
Boil the water" class="text-lg my-2 rounded px-4 py-4 border border-black w-full"></textarea>
  <ul v-else class="list-decimal list-inside opacity-90 mb-4 text-lg">
    <li v-for="instruc in instruction?.split('\n')"> {{ instruc }}</li>
  </ul>
</template>


<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useStore, ContentType } from '@/stores/index'

const ingredients = ref<string>('')
const instruction = ref<string>('')
const editIngredients = ref<Boolean>(false)
const editInstruction = ref<Boolean>(false)

const changeRecipe = async (contentType: ContentType) => {
  switch (contentType) {
    case ContentType.INGREDIENTS:
      editIngredients.value = false
      store.changeRecipe(recipe.value.id, contentType, ingredients.value)
      break
    case ContentType.INSTRUCTION:
      editInstruction.value = false
      store.changeRecipe(recipe.value.id, contentType, instruction.value)
      break
  }
}

const cancelChanges = (contentType: ContentType) => {
  switch (contentType) {
    case ContentType.INGREDIENTS:
      // editIngredients.value = false
      // store.changeRecipe(recipe.value.id, contentType, ingredients.value)
      break
    case ContentType.INSTRUCTION:
      // editInstruction.value = false
      // store.changeRecipe(recipe.value.id, contentType, instruction.value)
      break
  }
}

</script>