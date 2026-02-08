import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import type { Recipe } from '@/constants'
import { ContentType } from '@/constants'
import { resizeImage } from '@/utils'

export const useStore = defineStore('store', () => {
  const recipes = ref<Recipe[]>([])
  const dataLoaded = ref<boolean>(false)
  const filterTag = ref<string>('')

  // COMPUTED
  const sortedRecipes = computed(() => {
    let list = [...recipes.value]
    if (filterTag.value) {
      list = list.filter(recipe => recipe.tags.includes(filterTag.value))
    }
    return list.sort((a, b) => a.name.localeCompare(b.name))
  })

  const getTags = computed(() => {
    return [...new Set(recipes.value.flatMap(recipe => recipe.tags))]
  })

  // ACTIONS

  // Fetch all recipes from Supabase
  async function fetchRecipes() {
    if (dataLoaded.value) return
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('name')

    if (!error && data) {
      recipes.value = data
      dataLoaded.value = true
    } else {
      console.error('Error fetching recipes:', error)
    }
  }

  // Add or Update a recipe in Supabase
  async function addRecipe(recipe: Recipe) {
    const { error } = await supabase
      .from('recipes')
      .upsert(recipe)

    if (!error) {
      // Local update
      const index = recipes.value.findIndex(r => r.id === recipe.id)
      if (index !== -1) recipes.value[index] = recipe
      else recipes.value.push(recipe)
    } else {
      console.error('Error adding/updating recipe:', error)
    }
  }

  // Update a single field (ingredients, tags, etc)
  async function changeRecipe(id: string, contentType: ContentType, value: string | string[]) {
    const recipe = recipes.value.find(r => r.id === id)
    if (!recipe) return

    const updateData: any = {}
    updateData[contentType] = value

    const { error } = await supabase
      .from('recipes')
      .update(updateData)
      .eq('id', id)

    if (!error) {
      // Update local state
      (recipe as any)[contentType] = value
      console.log(`Updated ${contentType} for ${recipe.name}`)
    }
  }

  // Delete recipe from DB and its image from Storage
  async function deleteRecipe(recipe: Recipe) {
    // 1. Delete from Database
    const { error: dbError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipe.id)

    if (dbError) return console.error(dbError)

    // 2. Delete Image from Storage
    if (recipe.image_url) {
      const fileName = `${recipe.id}.${recipe.extension}`
      await supabase.storage
        .from('recipe-images')
        .remove([fileName])
    }

    // 3. Update local state
    recipes.value = recipes.value.filter(r => r.id !== recipe.id)
  }

  // Handle Image Upload and Update URL
  async function updateRecipeImage(id: string, file: File) {
    const recipe = recipes.value.find(r => r.id === id)
    if (!recipe) return

    const extension = file.name.substring(file.name.lastIndexOf('.'))
    const fileName = `${id}${extension}`
    const resizedBlob = await resizeImage(file)

    // 1. delete old image
    if (recipe.image_url) {
      const oldFileName = `${id}.${recipe.extension}`
      await supabase.storage
        .from('recipe-images')
        .remove([oldFileName])
    }

    // 2. Upload to Storage (overwrite existing)
    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, resizedBlob, {
        upsert: true,
        contentType: file.type
      })

    if (uploadError) return console.error('Upload failed:', uploadError)

    // 2. Get Public URL
    const { data: urlData } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(fileName)

    const publicUrl = urlData.publicUrl

    // 3. Update DB with new URL and extension
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ image_url: publicUrl, extension: extension })
      .eq('id', id)

    if (!updateError) {
      recipe.image_url = publicUrl
      recipe.extension = extension
    }
    

  }

  // UTILS
  function setFilter(str: string) {
    filterTag.value = filterTag.value === str ? '' : str
  }

  function addTag(id: string, newTag: string) {
    const recipe = recipes.value.find(r => r.id === id)
    if (recipe) {
      const newTags = [...recipe.tags, newTag]
      changeRecipe(id, ContentType.TAGS, newTags)
    }
  }

  function removeTag(id: string, oldTag: string) {
    const recipe = recipes.value.find(r => r.id === id)
    if (recipe) {
      const newTags = recipe.tags.filter(tag => tag !== oldTag)
      changeRecipe(id, ContentType.TAGS, newTags)
    }
  }



  return {
    recipes,
    filterTag,
    dataLoaded,
    sortedRecipes,
    getTags,
    fetchRecipes,
    addRecipe,
    deleteRecipe,
    changeRecipe,
    addTag,
    removeTag,
    setFilter,
    updateRecipeImage,
  }
})
