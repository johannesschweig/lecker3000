<template>
  <div>
    <p v-if="error">Error: {{ error }}</p>
    <div v-else-if="accessToken">Access Token from store: {{ store.accessToken }}
      <RouterLink class="text-xl block" to="/home">Go home</RouterLink>
    </div>
    <p v-else>Loading...</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useStore } from '@/stores/index';
import { RouterLink } from 'vue-router'

const accessToken = ref<string>('');
const error = ref<string>('');
const store = useStore();

const getAccessToken = async (code: string) => {
  try {
    const clientId = 'llz2w9825o8y2it';
    const clientSecret = import.meta.env.VITE_CLIENT_SECRET
    const redirectUri = import.meta.env.VITE_ENVIRONMENT === 'dev' ? 'http://localhost:5173/redirect' : 'https://savory-cuisine.surge.sh/';
    const tokenUrl = 'https://api.dropboxapi.com/oauth2/token';

    const response = await axios.post(tokenUrl, null, {
      params: {
        code: code,
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    accessToken.value = response.data.access_token;
    store.setAccessToken(response.data.access_token);
  } catch (err) {
    error.value = (err as Error).message;
  }
};

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    await getAccessToken(code);
  } else {
    error.value = 'No authorization code found.';
  }
});
</script>
