<template>
  <div>
    <h2>Uploaded Files</h2>
    <div class="image-gallery">
      <img v-for="file in uploadedFiles" :key="file.id" :src="file.thumbnailLink" :alt="file.name">
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      uploadedFiles: []
    };
  },
  mounted() {
    this.fetchUploadedFiles();
  },
  methods: {
    async fetchUploadedFiles() {
      try {
        // Use import.meta.env to access environment variables
        const accessToken = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        };
        const response = await axios.post('https://api.dropboxapi.com/2/files/list_folder', {
          path: '/lecker3000', // Adjust the path to your uploaded files
          recursive: false,
          include_media_info: false,
          include_deleted: false,
          include_has_explicit_shared_members: false
        }, { headers });

        // Extract image URLs from the response
        const promises = response.data.entries.map(async entry => {
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

        // Filter out null entries
        this.uploadedFiles = (await Promise.all(promises)).filter(file => file !== null);
      } catch (error) {
        console.error('Error fetching uploaded files:', error);
        alert('An error occurred while fetching uploaded files. Please try again.');
      }
    }
  }
}
</script>

<style scoped>
.image-gallery {
  display: flex;
  flex-wrap: wrap;
}

.image-gallery img {
  width: 300px;
  height: auto;
  margin: 5px;
}
</style>

