<template>
  <div class="mb-8">
    <div class="text-2xl mb-4">Recipes</div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      <RouterLink v-for="file in uploadedFiles" :to="`/recipe/${file.id}`">
        <img :key="file.id" :src="file.thumbnailLink" :alt="file.name" class="rounded-lg">
        <div class="text-md">{{ getRecipeName(file.name) }}</div>
      </RouterLink>
      <FileUpload />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import FileUpload from '@/components/FileUpload.vue';
import { useStore } from '@/stores/index.ts'
import { RouterLink } from 'vue-router';

const store = useStore()
const uploadedFiles = ref([]);

const getRecipeName = (fileName: string) => {
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex !== -1) {
    const id = dotIndex !== -1 ? fileName.substring(0, dotIndex) : '.ERROR'
    const recipe = store.recipes.find((r) => r.id === id)
    if (recipe) {
      return recipe.name
    } else {
      return 'ERROR'
    }
  } else {
    return 'ERROR'
  }
}

const fetchUploadedFiles = async () => {
  try {
    const accessToken: string = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    const response = await axios.post('https://api.dropboxapi.com/2/files/list_folder', {
      path: '/recipes',
      recursive: false,
      include_media_info: false,
      include_deleted: false,
      include_has_explicit_shared_members: false
    }, { headers });

    const promises = response.data.entries.map(async (entry: any) => {
      if (entry['.tag'] === 'file') {
        const downloadUrlResponse = await axios.post('https://api.dropboxapi.com/2/files/get_temporary_link', {
          path: entry.path_display,
        }, { headers });
        return {
          id: entry.id,
          name: entry.name,
          thumbnailLink: downloadUrlResponse.data.link // Use the temporary link to the image
        };
      }
      return null;
    });

    uploadedFiles.value = (await Promise.all(promises)).filter(file => file !== null);
  } catch (error) {
    console.error('Error fetching uploaded files:', error);
    alert('An error occurred while fetching uploaded files. Please try again.');
  }
};

onMounted(fetchUploadedFiles);
</script>
