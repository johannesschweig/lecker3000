<template>
  <div class="">
    <Header title="Add recipe" :back="true" :add="false"></Header>
    <div class="flex gap-4 mb-2">
      <div class="text-xl inline-block self-center">Name</div>
      <input v-model="name" placeholder="Name" class="text-lg mb-2 rounded-sm px-4 py-4 border border-black grow">
    </div>
    <div class="text-xl mb-2">Image</div>
    <div class="flex items-center justify-center w-full mb-4">
      <label for="dropzone-file"
        class="flex flex-col items-center justify-center w-full h-64 border-2 border-black border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 ">
        <div>
          <div v-if="file" @click="removeFile">
            <p class="text-md opacity-90">x{{ file.name }}</p>
          </div>
          <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 opacity-90 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p class="mb-2 text-sm opacity-90"><span class="font-semibold">Click to upload</span> or
              drag and drop</p>
            <p class="text-xs opacity-90">PNG, JPG or GIF</p>
          </div>
        </div>
        <input id="dropzone-file" type="file" class="hidden" @change="handleFileUpload" />
      </label>
    </div>

    <!-- Ingredients & Instruction -->
    <div class="text-xl mb-2">Ingredients</div>
    <textarea v-model="ingredients" placeholder="100g butter
1kg flour" rows="5" class="w-full mb-4 rounded-sm px-4 py-4 border border-black grow"></textarea>
    <div class="text-xl mb-2">Instruction</div>
    <textarea v-model="instruction" placeholder="Crack the eggs open
Boil the water" rows="5" class="w-full mb-4 rounded-sm px-4 py-4 border border-black grow"></textarea>

    <!-- Tags -->
    <div class="text-xl mb-2">Tags</div>
    <AddPill class="mb-2" :click="addTag" />
    <div class="flex flex-wrap gap-1 mb-4">
      <Pill v-for="tag in tags" :name="tag" :removable="true" :click="removeTag"/>
    </div>

    <button :class='["btn", "btn-primary", "block", "w-full", "py-4", "text-center", { "opacity-50": !file }]'
      @click="uploadFile">Upload</button>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { getRandomIdAndExtension, getValidAccessToken } from '@/utils'
import { ref } from 'vue';
import { useStore } from '@/stores/index';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue'
import Pill from '@/components/Pill.vue';
import AddPill from '@/components/AddPill.vue';

const name = ref('')
const ingredients = ref('')
const instruction = ref('')
const tags = ref<string[]>([])
const store = useStore()
const file = ref<File | null>(null)

const router = useRouter()
let uploadedImageUrl = '';

const addTag = (tag: string) => {
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag.toLowerCase());
  }
}

const removeTag = (tag: string) => {
  tags.value = tags.value.filter(t => t !== tag)
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
  }
}

const removeFile = () => {
  file.value = null
}

const uploadFile = async () => {
  if (!file.value) {
    alert('Please select a file to upload');
    return;
  }
  const { id: fileId, extension: fileExtension } = getRandomIdAndExtension(file.value.name)
  const accessToken = await getValidAccessToken();

  try {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path: `/recipes/${fileId}${fileExtension}`,
        mode: 'add',
        autorename: true,
        mute: false
      })
    };
    const response = await axios.post('https://content.dropboxapi.com/2/files/upload', file.value, { headers });
    store.addRecipe({ id: fileId, name: name.value, extension: fileExtension, ingredients: ingredients.value, instruction: instruction.value, tags: tags.value })

    // Extracting the link to the uploaded file from the response
    uploadedImageUrl = response.data.path_display;
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Error uploading file to Dropbox:', error);
    alert('An error occurred while uploading the file. Please try again.');
  }
}
</script>
