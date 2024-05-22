<template>
  <div class="mb-8">
    <button class="btn-primary" @click="authenticateWithDropbox">Login with Dropbox</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DropboxAuth',
  methods: {
    authenticateWithDropbox() {
      const clientId = 'llz2w9825o8y2it';
      const redirectUri = import.meta.env.VITE_ENVIRONMENT === 'dev' ? 'http://localhost:5173/redirect' : 'https://savory-cuisine.surge.sh/'
      const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;

      window.location.href = authUrl;
    }
  }
});
</script>