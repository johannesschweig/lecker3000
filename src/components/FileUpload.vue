<template>
  <div class="">
    <div class="text-xl mb-2">New Recipe</div>
    <input v-model="name" placeholder="Name" class="text-lg mb-2 rounded px-4 py-4 border border-slate-500 w-full">

    <div class="flex items-center justify-center w-full mb-2">
      <label for="dropzone-file"
        class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ">
        <div>
          <div v-if="file" @click="removeFile">
            <p class="text-md text-gray-500 ">x{{ file.name }}</p>
          </div>
          <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p class="mb-2 text-sm text-gray-500 "><span class="font-semibold">Click to upload</span> or
              drag and drop</p>
            <p class="text-xs text-gray-500 ">PNG, JPG or GIF</p>
          </div>
        </div>
        <input id="dropzone-file" type="file" class="hidden" @change="handleFileUpload" />
      </label>
    </div>

    <button :class='["btn-primary", "block", "w-full", "py-4", "text-center", { "bg-slate-300" : !file }]' @click="uploadFile">Upload</button>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { getRandomIdAndExtension } from '@/utils'
import { ref } from 'vue';
import { useStore } from '@/stores/index';
import { useRouter } from 'vue-router';

const name = ref('')
const store = useStore()
const file = ref<File | null>(null)

const router = useRouter()
let uploadedImageUrl = '';

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

  try {
    const headers = {
      'Authorization': `Bearer ${store.accessToken}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path: `/recipes/${fileId}${fileExtension}`,
        mode: 'add',
        autorename: true,
        mute: false
      })
    };
    const response = await axios.post('https://content.dropboxapi.com/2/files/upload', file.value, { headers });
    store.addRecipe({ id: fileId, name: name.value, extension: fileExtension })

    // Extracting the link to the uploaded file from the response
    uploadedImageUrl = response.data.path_display;
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Error uploading file to Dropbox:', error);
    alert('An error occurred while uploading the file. Please try again.');
  }
}
</script>
