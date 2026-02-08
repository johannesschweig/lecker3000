<template>
  <div class="pb-10">
    <Header title="Add recipe" :back="true" :add="false"></Header>
    
    <div class="flex gap-4 mb-2">
      <div class="text-xl inline-block self-center">Name</div>
      <input v-model="name" placeholder="Name" class="text-lg mb-2 rounded-sm px-4 py-4 border border-black grow">
    </div>

    <div class="text-2xl mb-2">Image</div>
    <div class="flex items-center justify-center w-full mb-4">
      <label for="dropzone-file"
        class="flex flex-col items-center justify-center w-full h-64 border-2 border-black border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 relative overflow-hidden">
        
        <div v-if="previewUrl" class="absolute inset-0 w-full h-full">
            <img :src="previewUrl" class="w-full h-full object-cover opacity-40" />
            <div @click.stop.prevent="removeFile" class="absolute top-2 right-2 bg-black text-white rounded-full p-2 text-xs">✕ Remove</div>
        </div>

        <div v-if="!file" class="flex flex-col items-center justify-center pt-5 pb-6">
          <svg class="w-8 h-8 mb-4 opacity-90" fill="none" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
          </svg>
          <p class="mb-2 text-sm opacity-90"><span class="font-semibold">Click to upload</span></p>
          <p class="text-xs opacity-90">PNG, JPG or GIF</p>
        </div>
        
        <div v-else-if="!previewUrl" class="text-center p-4">
            <p class="font-bold">{{ file.name }}</p>
        </div>

        <input id="dropzone-file" type="file" class="hidden" accept="image/*" @change="handleFileUpload" />
      </label>
    </div>

    <div class="text-2xl mb-2">Ingredients</div>
    <textarea v-model="ingredients" placeholder="100g butter&#10;1kg flour" rows="5" class="w-full mb-4 rounded-sm px-4 py-4 border border-black"></textarea>
    
    <div class="text-2xl mb-2">Instruction</div>
    <textarea v-model="instruction" placeholder="Crack the eggs open&#10;Boil the water" rows="5" class="w-full mb-4 rounded-sm px-4 py-4 border border-black"></textarea>

    <PillContent :onSave="setTags" class="mb-4" />

    <button 
      :disabled="loading || !file || !name"
      :class='["btn", "btn-primary", "block", "w-full", "py-4", "text-center", { "opacity-50": !file || loading }]'
      @click="saveRecipe"
    >
      {{ loading ? 'Uploading...' : 'Upload Recipe' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/stores/index';
import { supabase } from '@/supabase';
import Header from '@/components/Header.vue';
import PillContent from '@/components/PillContent.vue';
import { resizeImage } from '@/utils';

const name = ref('')
const ingredients = ref('')
const instruction = ref('')
const tags = ref<string[]>([])
const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const loading = ref(false)

const store = useStore()
const router = useRouter()

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
    previewUrl.value = URL.createObjectURL(file.value);
  }
}

const removeFile = () => {
  file.value = null
  previewUrl.value = null
}

const setTags = (newTags: string[]) => {
  tags.value = newTags
}

const saveRecipe = async () => {
  if (!file.value || !name.value) return;
  loading.value = true;

  try {
    // 1. Generate unique ID
    const recipeId = Math.random().toString(36).substring(2, 10);
    const extension = file.value.name.split('.').pop()
    const fileName = `${recipeId}.${extension}`;

    // 2. Resize local file
    const resizedBlob = await resizeImage(file.value);

    // 3. Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, resizedBlob, { contentType: file.value.type });

    if (storageError) throw storageError;

    // 4. Get Public URL
    const { data: urlData } = supabase.storage.from('recipe-images').getPublicUrl(fileName);

    // 5. Save to Database via Store
    await store.addRecipe({
      id: recipeId,
      name: name.value,
      ingredients: ingredients.value,
      instruction: instruction.value,
      tags: tags.value,
      image_url: urlData.publicUrl,
      extension: extension
    });
    store.fetchRecipes()

    router.push({ name: 'home' });
  } catch (error: any) {
    console.error('Error saving recipe:', error);
    alert(error.message || 'Error occurred');
  } finally {
    loading.value = false;
  }
}
</script>
