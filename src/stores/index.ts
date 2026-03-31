import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import type { User } from '@supabase/supabase-js'
import type { Recipe } from '@/constants'
import { ContentType } from '@/constants'
import { resizeImage } from '@/utils'

export const useStore = defineStore('store', () => {
  const recipes = ref<Recipe[]>([])
  const currentUser = ref<User | null>(null)
  const dataLoaded = ref<boolean>(false)
  const filterTag = ref<string>('')

  // COMPUTED
  const mySortedRecipes = computed(() => {
    let list = [...recipes.value]
    if (filterTag.value) {
      list = list.filter(recipe => recipe.tags.includes(filterTag.value))
    }
    return list.filter(r => isOwner(r.user_id)).sort((a, b) => a.name.localeCompare(b.name))
  })

  const getTags = computed(() => {
    return [...new Set(recipes.value.filter(r => isOwner(r.user_id)).flatMap(recipe => recipe.tags))]
  })

  const isOwner = (recipeUserId: string) => {
    return currentUser.value?.id === recipeUserId
  }

  // ACTIONS
  async function initializeAuth() {
    // 1. Get the initial session
    const { data: { session } } = await supabase.auth.getSession()
    currentUser.value = session?.user ?? null

    // 2. Listen for changes (Login, Logout, Token Refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      currentUser.value = session?.user ?? null

      // If user logs out, clear the local recipes so the next person 
      // doesn't see "stale" data from the previous session
      if (!session) {
        recipes.value = []
        dataLoaded.value = false
      }
    })
  }
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
    if (!currentUser.value) throw new Error('You must be logged in')

    const payload = {
      ...recipe,
      user_id: currentUser.value.id
    }

    // 3. Upsert and return the new data
    const { data, error } = await supabase
      .from('recipes')
      .upsert(payload)
      .select() // Get the row back from the DB
      .single()

    if (!error && data) {
      // 4. Update Local State with the DB-verified data
      const index = recipes.value.findIndex(r => r.id === data.id)
      if (index !== -1) {
        recipes.value[index] = data
      } else {
        recipes.value.push(data)
      }
    } else {
      console.error('Error adding/updating recipe:', error)
      throw error
    }
  }

  async function changeRecipe(id: string, contentType: ContentType, value: string | string[]) {
    if (!currentUser.value) throw new Error('You must be logged in')

    const recipe = recipes.value.find(r => r.id === id)
    if (!recipe) return

    const updateData: any = { [contentType]: value }

    const { error } = await supabase
      .from('recipes')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', currentUser.value.id) // Security: Only update if I own it

    if (!error) {
      (recipe as any)[contentType] = value
      console.log(`Updated ${contentType} for ${recipe.name}`)
    } else {
      console.error(`Error updating ${contentType}:`, error)
    }
  }

  // Delete recipe from DB and its image from Storage
  async function deleteRecipe(recipe: Recipe) {
    if (!currentUser.value) throw new Error('You must be logged in')

    // 1. Delete from Database first (RLS will check user_id)
    const { error: dbError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipe.id)
      .eq('user_id', currentUser.value.id)

    if (dbError) return console.error('DB Delete failed:', dbError)

    // 2. Delete Image from Storage (Subquery RLS handles permission)
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
    if (!currentUser.value) throw new Error('You must be logged in')
    const recipe = recipes.value.find(r => r.id === id)
    if (!recipe) return

    // Standardize extension (remove dot if present, then add it back consistently)
    const rawExt = file.name.split('.').pop()
    const extension = rawExt ? rawExt : 'jpg'
    const fileName = `${id}.${extension}`

    const resizedBlob = await resizeImage(file)

    // 1. Upload/Overwrite in Storage
    // 'upsert: true' handles the "delete old/upload new" in one go safely
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
      .update({
        image_url: publicUrl,
        extension: extension
      })
      .eq('id', id)
      .eq('user_id', currentUser.value?.id) // Security: Only update my own recipe row

    if (!updateError) {
      recipe.image_url = publicUrl
      recipe.extension = extension
      console.log('Image updated successfully')
    } else {
      console.error('Database update failed after image upload:', updateError)
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
    currentUser,
    filterTag,
    dataLoaded,
    mySortedRecipes,
    getTags,
    isOwner,
    initializeAuth,
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
