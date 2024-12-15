<template>
  <div>
    <div class="mb-2">
      <div class="text-2xl opacity-90 inline-block">{{ contentType === ContentType.INGREDIENTS ? "Ingredients" : "Instruction"}}</div>
      <div v-if='editing' class="float-right">
        <button class="btn btn-secondary mr-2" @click="cancel()">Cancel</button>
        <button class="btn btn-primary" @click="change()">Save</button>
      </div>
      <button v-else class="btn btn-secondary float-right"
        @click="edit()">Edit</button>
    </div>
    <div class="opacity-90 mb-4 text-lg">
      <textarea v-if="editing" rows="10" v-model="content" :placeholder='placeholder' class="my-2 rounded px-4 py-4 border border-black w-full"></textarea>
      <div v-else-if="contentType === ContentType.INGREDIENTS">
        <p v-for="ingredient in content?.split('\n')"> {{ ingredient }}</p>
      </div>
      <ul v-else class="list-decimal list-inside">
        <li v-for="instruc in content?.split('\n')"> {{ instruc }}</li>
      </ul>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { PropType } from 'vue'
import { ContentType } from '@/stores/index'
import { useStore } from '@/stores/index'

const editing = ref<Boolean>(false)
const content = ref<string>('')
const savedContent = ref<string>('')
const store = useStore()

const props = defineProps({
  recipeId: {
    type: String,
    required: true,
  },
  initialContent: {
    type: String,
    required: true,
  },
  contentType: {
    type: String as PropType<ContentType>,
    required: true
  }
})

const placeholder = computed(() => {
  return props.contentType === ContentType.INGREDIENTS ?
    "100g butter\n1kg flour" :
    "Crack the eggs open\nBoil the water"
})

const edit = () => {
  savedContent.value = content.value
  editing.value = true
}

const change = async () => {
  editing.value = false
  store.changeRecipe(props.recipeId, props.contentType, content.value)
}

const cancel = () => {
  editing.value = false
  content.value = savedContent.value
}

onMounted(async () => {
  content.value = props.initialContent
})
</script>