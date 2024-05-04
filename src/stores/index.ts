import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
  // const count = ref(0)
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }

  // function getRecipeName(id: string) {
  //   const r = recipes.filter(r => r.id === id)[0]
  //   console.log('r', r)
  //   return r.name
  // }

  const recipes = ref([
    { id: "wireframe", name: 'Wireframe' },
    { id: "screenshot", name: 'Screenshot' },
    { id: "ngo", name: 'NGO' },
    { id: "laundry", name: 'Laundry' },
    { id: "camera1", name: 'Camera 1' },
  ])

  return { recipes }
})
