<template>
  <div v-if='editing'>
    <input type="text" placeholder="tag" v-model="newTag" class="text-lg my-2 rounded-2xl px-4 py-2 border border-black mr-2" @keydown.enter='addTag()'>
    <button class="btn btn-secondary mr-2" @click='editing = false'>Cancel</button>
    <button class="btn btn-add" @click='addTag()'>Add</button>
  </div>
  <button v-else class="btn btn-secondary" @click='editing = true'>Add tag</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from '@/stores/index'

const editing = ref<Boolean>(false)
const newTag = ref<string>('')
const store = useStore()
const props = defineProps(
  {
    recipeId: {
      type: String,
    },
    click: {
      type: Function,
    }
  }
);

const addTag = async () => {
  if (newTag.value) {
    if (props.recipeId) {
      store.addTag(props.recipeId, newTag.value.toLowerCase())
    } else if (props.click) {
      props.click(newTag.value.toLowerCase())
    }
    newTag.value = ''
  }
}
</script>