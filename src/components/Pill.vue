<template>
  <div v-if='removable' class='text-lg inline-block mr-2 select-none'>
    <div class='inline-block border-t border-b border-l border-black rounded-l-2xl pl-4 pr-2 py-1' :class='`bg-${bgColor}-200`'>
      {{ formattedName }}
    </div>
    <div @click='removePill()' class='inline-block border border-black rounded-r-2xl pl-2 pr-3 py-1 hover:cursor-pointer'  :class='`bg-${bgColor}-200 hover:bg-${bgColor}-300 active:bg-${bgColor}-300`'>
      X
    </div>
  </div>
  <div
    v-else-if='filterable'
    @click='filter()'
    class='inline-block text-lg border border-black rounded-2xl px-4 py-1 mr-2 hover:cursor-pointer select-none'
    :class="props.name === store.filterTag 
        ? [`bg-${bgColor}-300`, 'border-2', `hover:bg-${bgColor}-300`, `active:bg-${bgColor}-300`] 
        : [`bg-${bgColor}-200`, `hover:bg-${bgColor}-300`, `active:bg-${bgColor}-300`]">
    {{ formattedName }}
  </div>
  <div v-else class='inline-block text-lg border border-black rounded-2xl px-4 py-1 mr-2 select-none' :class='`bg-${bgColor}-200`'>
    {{ formattedName }}
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/stores/index'
import { getTagColor } from '@/utils'

const props = defineProps(["name", "recipeId", "removable", "filterable"]);
const store = useStore()

const formattedName = computed(() => {
  return props.name.charAt(0).toUpperCase() + props.name.slice(1)
})

const bgColor = computed(() => {
  return getTagColor(props.name)
})

const removePill = () => {
  store.removeTag(props.recipeId, props.name)
}

const filter = () => {
  store.setFilter(props.name.toLowerCase())
}
</script>