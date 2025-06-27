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
import { generatePKCECodes } from '@/utils';

export default defineComponent({
  name: 'DropboxAuth',
  methods: {
    async authenticateWithDropbox() {
      const clientId = import.meta.env.VITE_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_REDIRECT_URL

      const { codeVerifier, codeChallenge } = await generatePKCECodes();

      const authUrl = `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&code_challenge_method=S256&token_access_type=offline`;

      localStorage.setItem('dropbox_code_verifier', codeVerifier);

      window.location.href = authUrl;
    }
  }
});
</script>