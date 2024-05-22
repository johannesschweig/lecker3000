<template>
  <div class="bg-slate-200 rounded-lg p-4">
    <div class="text-lg mb-2">New Recipe</div>
    <input v-model="name" placeholder="Name" class="mb-2 rounded px-2">
    <input type="file" @change="handleFileUpload" class="mb-2">
    <button class="btn-primary" @click="uploadFile">Upload</button>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { getRandomIdAndExtension } from '@/utils'
import { ref } from 'vue';
import { useStore } from '@/stores/index';

const name = ref('')
const store = useStore()

let file: File | null = null;
let uploadedImageUrl = '';

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file = target.files[0];
  }
};

const uploadFile = async () => {
  if (!file) {
    alert('Please select a file to upload');
    return;
  }
  const {id: fileId, extension: fileExtension } = getRandomIdAndExtension(file.name)

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
    const response = await axios.post('https://content.dropboxapi.com/2/files/upload', file, { headers });
    store.addRecipe({ id: fileId, name: name.value, extension: fileExtension})

    // Extracting the link to the uploaded file from the response
    uploadedImageUrl = response.data.path_display;
  } catch (error) {
    console.error('Error uploading file to Dropbox:', error);
    alert('An error occurred while uploading the file. Please try again.');
  }
};
</script>
