<template>
  <div>
    <input type="file" @change="handleFileUpload">
    <button @click="uploadFile">Upload</button>
    <div v-if="uploadedImageUrl">
      <img :src="uploadedImageUrl" alt="Uploaded Image">
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { getRandomFileName } from '@/utils.ts'

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
  
  try {
    const accessToken: string = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path: `/recipes/${getRandomFileName(file.name)}`,
        mode: 'add',
        autorename: true,
        mute: false
      })
    };
    const response = await axios.post('https://content.dropboxapi.com/2/files/upload', file, { headers });
    
    // Extracting the link to the uploaded file from the response
    uploadedImageUrl = response.data.path_display;
  } catch (error) {
    console.error('Error uploading file to Dropbox:', error);
    alert('An error occurred while uploading the file. Please try again.');
  }
};
</script>

