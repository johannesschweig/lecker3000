<template>
  <div class="mt-32 grid justify-center justify-items-center">
    <div v-if="error">Error: {{ error }}</div>
    <div v-else-if="accessToken">Access Token received</div>
    <div v-else>Redirecting to lecker3000...</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/stores/index';
import router from '@/router';

const accessToken = ref<string>('');
const error = ref<string>('');
const store = useStore();

const getAccessToken = async (code: string, codeVerifier: string) => {
  try {
    const clientId = import.meta.env.VITE_CLIENT_ID
    const redirectUri = import.meta.env.VITE_REDIRECT_URL
    const tokenUrl = 'https://api.dropboxapi.com/oauth2/token';

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem('dropbox_access_token', data.access_token);
      localStorage.setItem('dropbox_refresh_token', data.refresh_token);
      localStorage.setItem('dropbox_token_expires', (Date.now() + data.expires_in * 1000).toString());

      router.push('/home');
    } else {
      throw new Error(data.error_description || 'Failed to retrieve access token.');
    }
  } catch (err) {
    error.value = (err as Error).message;
  }
};

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const codeVerifier = localStorage.getItem('dropbox_code_verifier');

  if (code && codeVerifier) {
    await getAccessToken(code, codeVerifier);
  } else {
    error.value = 'No authorization code or code verifier found.';
  }
});
</script>
