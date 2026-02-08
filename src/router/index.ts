import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import RecipeView from '@/components/RecipeView.vue'
import Login from '@/components/Login.vue'
import FileUpload from '@/components/FileUpload.vue'
import { useStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/upload',
      name: 'fileupload',
      component: FileUpload,
    },
    {
      path: '/recipe/:id',
      name: 'recipe',
      component: RecipeView,
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // return { top: 10 }
    const element = document.getElementById('app')
    if (element) {
      // element.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo(0, 0);
    }

  }
})

router.beforeEach(async (to) => {
  // 1. Skip if going to login
  if (to.path === '/login') return true

  const store = useStore()

  // 2. Only fetch if we haven't loaded data yet
  if (!store.dataLoaded) {
    await store.fetchRecipes()
  }

  return true
})

export default router
