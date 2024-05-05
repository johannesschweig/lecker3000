<template>
  <div>
    <div class="text-2xl">Recipe {{ recipe.name }}</div>
  </div>
</template>

<script setup>
import { useStore } from '@/stores/index.ts'
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const store = useStore()
const recipe = ref({});

const route = useRoute();
const currentParams = route.params;
// TODO this is ugly
setTimeout(() => {
  const r = store.recipes.find(r => r.id === currentParams.id)
  recipe.value = r ? r : { id: '123', name: 'ERROR' }
  console.log('ERROR', 'Could not find recipe with id', currentParams.id)
}, 2500)
// console.log(currentParams, currentPath, currentQuery)

</script>