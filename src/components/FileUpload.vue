<template>
  <div>
    <input type="file" @change="handleFileUpload">
    <button @click="uploadFile">Upload</button>
    <div v-if="uploadedImageUrl">
      <img :src="uploadedImageUrl" alt="Uploaded Image">
    </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      file: null,
      uploadedImageUrl: ''
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async uploadFile() {
      if (!this.file) {
        alert('Please select a file to upload');
        return;
      }
      
      try {
        const accessToken = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            path: `/lecker3000/${this.file.name}`,
            mode: 'add',
            autorename: true,
            mute: false
          })
        };
        const response = await axios.post('https://content.dropboxapi.com/2/files/upload', this.file, { headers });
        
        // Extracting the link to the uploaded file from the response
        this.uploadedImageUrl = response.data.path_display;
      } catch (error) {
        console.error('Error uploading file to Dropbox:', error);
        alert('An error occurred while uploading the file. Please try again.');
      }
    }
  }
}
</script>
