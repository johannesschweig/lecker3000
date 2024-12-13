<template>
  <div v-if='removable' class='text-lg inline-block mr-2'>
    <div class='inline-block bg-blue-200 border-t border-b border-l border-black rounded-l-2xl pl-4 pr-2 py-1'>
      {{ formattedName }}
    </div>
    <div @click='removePill()' class='inline-block bg-blue-200 border border-black rounded-r-2xl pl-2 pr-3 py-1 hover:bg-blue-300 active:bg-blue-300 hover:cursor-pointer'>
      X
    </div>
  </div>
  <div
    v-else-if='filterable'
    @click='filter()'
    class='inline-block text-lg border border-black hover:bg-blue-300 active:bg-blue-300 rounded-2xl px-4 py-1 mr-2 hover:cursor-pointer'
    :class='props.name === store.filterTag ? "bg-blue-300 border-2" : "bg-blue-200"'>
    {{ formattedName }}
  </div>
  <div v-else class='inline-block text-lg bg-blue-200 border border-black rounded-2xl px-4 py-1 mr-2'>
    {{ formattedName }}
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/stores/index'

const props = defineProps(["name", "recipeId", "removable", "filterable"]);
const store = useStore()

const formattedName = computed(() => {
  return props.name.charAt(0).toUpperCase() + props.name.slice(1)
})

const removePill = () => {
  store.removeTag(props.recipeId, props.name)
}

const filter = () => {
  store.setFilter(props.name.toLowerCase())
}
</script>