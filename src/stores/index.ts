import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

export interface Recipe {
  id: string,
  name: string,
  extension: string,
  thumbnail?: string,
}

export const useStore = defineStore('store', () => {
  const recipes = ref<Recipe[]>([])
  const accessToken = ref<String>('')

  function setAccessToken(t: string) {
    accessToken.value = t
  }

  function addRecipe(r: Recipe) {
    recipes.value.push(r)
    writeDataToDropbox()
  }

  function deleteRecipe(id: string) {
    recipes.value = recipes.value.filter(r => r.id !== id)
    writeDataToDropbox()
  }

  async function writeDataToDropbox() {
    try {
      // Convert the data to JSON
      const exportRecipes = recipes.value.map(r => {
        const newR = { ...r }; // Create a shallow copy of the original object
        delete newR['thumbnail']; // Remove the specified attribute from the new object
        return newR; // Return the modified object
      });
      const jsonData = JSON.stringify(exportRecipes);

      // Write the JSON data to Dropbox using the Dropbox API
      const headers = {
        'Authorization': `Bearer ${accessToken.value}`,
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
      const headers = {
        'Authorization': `Bearer ${accessToken.value}`,
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

  async function loadThumbnails() {
    try {
      const headers = {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      };

      const promises = recipes.value.map(async (recipe: Recipe) => {
        const downloadUrlResponse = await axios.post('https://api.dropboxapi.com/2/files/get_temporary_link', {
          // path: entry.path_display,
          path: `/recipes/${recipe.id}${recipe.extension}`
        }, { headers });
        const thumbnail = downloadUrlResponse.data.link
        const matchingRecipe = recipes.value.find(r => r.id === recipe.id)
        if (matchingRecipe) {
          matchingRecipe.thumbnail = thumbnail
        }
        return {
          thumbnail,
        };
      });
      await Promise.all(promises)
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
      alert('An error occurred while fetching uploaded files. Please try again.');
    }
  };



  return { recipes, addRecipe, deleteRecipe, loadDataFromDropbox, loadThumbnails, accessToken, setAccessToken }
})
