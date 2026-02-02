<template>
  <div>
    <div class="flex justify-between items-center" :class="contentType !== ContentType.NAME ? 'mb-2' : ''">
      <div v-if="contentType !== ContentType.NAME" class="text-2xl opacity-90">
        {{ contentType === ContentType.INGREDIENTS ? "Ingredients" : "Instruction" }}
      </div>
      <span v-else-if="!editing && contentType === ContentType.NAME" lang="de"
        class="text-4xl md:text-5xl opacity-90 hyphens-auto">
        {{ content }}
      </span>
      <div v-else></div>
      <div v-if="editing" class="flex gap-2">
        <button class="btn btn-secondary" @click="cancel()">Cancel</button>
        <button class="btn btn-primary" :disabled="content === savedContent" @click="change()">Save</button>
      </div>
      <button v-else class="btn btn-secondary" @click="edit()">Edit</button>
    </div>
    <div class="opacity-90 text-lg" :class="contentType !== ContentType.NAME ? 'mb-4' : ''">
      <textarea v-if="editing && contentType !== ContentType.NAME" :rows="content?.split('\n').length + 1"
        v-model="content" :placeholder='placeholder'
        class="my-2 rounded-sm px-4 py-4 border border-black w-full"></textarea>
      <input v-else-if="editing && contentType === ContentType.NAME" v-model="content"
        class="text-3xl border-b border-black w-full outline-none" />
      <div v-else-if="contentType === ContentType.INGREDIENTS">
        <p v-for="ingredient in content?.split('\n')" class="min-h-6"> {{ ingredient }}</p>
      </div>
      <ul v-else-if="!editing && contentType === ContentType.INSTRUCTION" class="list-decimal list-inside">
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