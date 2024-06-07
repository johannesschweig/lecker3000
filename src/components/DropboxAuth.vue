<template>
  <div class="mt-32 grid justify-center justify-items-center">
    <div class="text-6xl font-semibold opacity-90 mb-2">Lecker</div>
    <div class="text-5xl font-semibold opacity-90 mb-4">3000</div>
    <div class="text-xl opacity-70 mb-8">A recipe app</div>
    <button class="btn-lg btn-primary" @click="authenticateWithDropbox">Login with Dropbox</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DropboxAuth',
  methods: {
    authenticateWithDropbox() {
      const clientId = 'llz2w9825o8y2it';
      const redirectUri = import.meta.env.VITE_ENVIRONMENT === 'dev' ? 'http://localhost:5173/redirect' : import.meta.env.VITE_REDIRECT_URL
      const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;

      window.location.href = authUrl;
    }
  }
});
</script>