import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import RecipeView from '@/components/RecipeView.vue'
import DropboxRedirect from '@/components/DropboxRedirect.vue'
import DropboxAuth from '@/components/DropboxAuth.vue'
import FileUpload from '@/components/FileUpload.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: DropboxAuth,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/redirect',
      name: 'DropboxRedirect',
      component: DropboxRedirect,
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

export default router
