<template>
  <div v-if='removable' class='text-base md:text-lg inline-block mr-2 select-none'>
    <div class='inline-block border-t border-b border-l border-black rounded-l-2xl pl-4 pr-2 py-1'
      :class='`bg-${bgColor}-200`'>
      {{ formattedName }}
    </div>
    <div @click='removePill()' class='inline-block border border-black rounded-r-2xl pl-2 pr-3 py-1 cursor-pointer'
      :class='`bg-${bgColor}-200 hover:bg-${bgColor}-300 active:bg-${bgColor}-300`'>
      X
    </div>
  </div>
  <div v-else-if='filterable' @click='filter()'
    class='inline-block text-base md:text-lg border border-black rounded-2xl px-3 py-[2px] md:px-4 md:py-1 mr-2 cursor-pointer select-none transition hover:-translate-[1px] hover:brutalist-drop-1 active:-translate-[2px] active:brutalist-drop-2'
    :class="props.name === store.filterTag
      ? [`bg-${bgColor}-300`, `hover:bg-${bgColor}-300`, `active:bg-${bgColor}-300`, 'brutalist-drop-2 -translate-[1px]']
      : [`bg-${bgColor}-200`, `hover:bg-${bgColor}-300`, `active:bg-${bgColor}-300`]">
    {{ formattedName }}
  </div>
  <div v-else-if='addable' class='text-base md:text-lg inline-block mr-2 select-none'>
    <div class='inline-block border-t border-b border-l border-black rounded-l-2xl pl-4 pr-2 py-1 bg-white'>
      {{ formattedName }}
    </div>
    <div @click='addTag()'
      class='inline-block border border-black rounded-r-2xl pl-2 pr-3 py-1 cursor-pointer bg-white hover:bg-slate-100 active:bg-slate-200'>
      +
    </div>
  </div>
  <div v-else
    class='inline-block text-base md:text-lg border border-black rounded-2xl px-3 py-[2px] md:px-4 md:py-1 mr-2 select-none'
    :class='`bg-${bgColor}-200`'>
    {{ formattedName }}
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/stores/index'
import { getTagColor } from '@/utils'

const props = defineProps(
  {
    name: {
      type: String,
      required: true,
    },
    recipeId: {
      type: String,
    },
    removable: {
      type: Boolean,
      default: false,
    },
    addable: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    click: {
      type: Function,
    }
  }
)
const store = useStore()

const formattedName = computed(() => {
  return props.name.charAt(0).toUpperCase() + props.name.slice(1)
})

const bgColor = computed(() => {
  return getTagColor(props.name)
})

const removePill = () => {
  if (props.click) {
    props.click(props.name)
  } else if (props.recipeId) {
    store.removeTag(props.recipeId, props.name)
  }
}

const filter = () => {
  store.setFilter(props.name.toLowerCase())
}

const addTag = () => {
  if (props.click) {
    props.click(props.name)
  }
}
</script>