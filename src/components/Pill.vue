<template>
  <div class='text-lg inline-block'>
    <div class='inline-block bg-blue-200 border-t border-b border-l border-black rounded-l-2xl pl-4 pr-2 py-1'>
      {{ formattedName }}
    </div>
    <div @click='removePill()' class='inline-block bg-blue-200 border border-black rounded-r-2xl pl-2 pr-3 py-1 hover:bg-blue-300 active:bg-blue-300 hover:cursor-pointer'>
      X
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/stores/index'

const props = defineProps(["name", "recipeId"]);
const store = useStore()

const formattedName = computed(() => {
  return props.name.charAt(0).toUpperCase() + props.name.slice(1)
})

const removePill = () => {
  store.removeTag(props.recipeId, props.name)
}
</script>