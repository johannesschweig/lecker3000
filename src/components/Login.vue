<template>
  <div class="mt-32 grid justify-center justify-items-center">
    <div class="text-6xl font-semibold opacity-90 mb-2">Lecker</div>
    <div class="text-5xl font-semibold opacity-90 mb-4">3000</div>
    <div class="text-xl opacity-70 mb-8">A recipe app</div>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-4 w-64">
      <input v-model="email" type="email" placeholder="Email" required
        class="input-field" />
      <input v-model="password" type="password" placeholder="Password" required
        class="input-field" />
      <button type="submit" :disabled="loading"
        class="btn btn-primary ">
        {{ loading ? 'Signing in...' : 'Login' }}
      </button>
      <p v-if="errorMsg" class="text-red-500 text-sm mt-2 text-center">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error

    // Redirect to /home on success
    router.push('/home')
  } catch (error: any) {
    errorMsg.value = error.message || 'An error occurred during login'
  } finally {
    loading.value = false
  }
}
</script>