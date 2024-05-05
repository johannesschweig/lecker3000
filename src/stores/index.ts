import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

export interface Recipe {
  id: string,
  name: string,
}

export const useStore = defineStore('store', () => {
  const recipes = ref<Recipe[]>([])

  function addRecipe(r: Recipe) {
    recipes.value.push(r)
    writeDataToDropbox()
  }

  async function writeDataToDropbox() {
    try {
      // Convert the data to JSON
      const jsonData = JSON.stringify(recipes.value);

      // Write the JSON data to Dropbox using the Dropbox API
      const accessToken: string = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: '/recipes.json',
          mode: 'overwrite', // Overwrite the existing file
        })
      };
      await axios.post('https://content.dropboxapi.com/2/files/upload', jsonData, { headers });

      console.log('Data successfully written to Dropbox');
    } catch (error) {
      console.error('Error writing data to Dropbox:', error);
    }
  }

  async function loadDataFromDropbox() {
    try {
      // Fetch the JSON data from Dropbox using the Dropbox API
      const accessToken: string = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;

      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Dropbox-API-Arg': JSON.stringify({
          path: '/recipes.json',
        })
      };
      const response = await axios.post('https://content.dropboxapi.com/2/files/download', undefined, { headers });

      // Parse the JSON data and update the store
      recipes.value = response.data

      console.log('Data loaded from Dropbox:', recipes.value);
    } catch (error) {
      console.error('Error loading data from Dropbox:', error);
    }
  }

  
  onMounted(loadDataFromDropbox)

  return { recipes, addRecipe }
})
