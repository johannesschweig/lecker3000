import {
  ref,
  computed
} from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import { getValidAccessToken } from '@/utils'

export interface Recipe {
  id: string, // id of recipe, random 8 char string
  name: string, // display name
  extension: string, // either jpg or png
  thumbnail?: string,
  ingredients: string,
  instruction: string,
  tags: Array<string>
}

export enum ContentType {
  INSTRUCTION = 'instruction',
  INGREDIENTS = 'ingredients',
  TAGS = 'tags',
}

export const useStore = defineStore('store',
  () => {
    const recipes = ref<Recipe[]>([])
    const dataLoaded = ref<boolean>(false)
    const thumbnailsLoaded = ref<boolean>(false)
    const filterTag = ref<string>('')

    const sortedRecipes = computed(() => {
      if (filterTag.value) {
        return [...recipes.value].filter(recipe => recipe.tags.includes(filterTag.value)).sort((a,
          b) => a.name.localeCompare(b.name));
      } else {
        return [...recipes.value].sort((a,
          b) => a.name.localeCompare(b.name));
      }
    })

    const getTags = computed(() => {
      return [...new Set([...recipes.value].map(recipe => recipe.tags).flat(Infinity))]
    })

    // set filter for tags on home view
    function setFilter(str: string) {
      if (filterTag.value === str) {
        console.log('Showing all recipes')
        filterTag.value = ''
      } else {
        console.log('Showing only', str, 'recipes')
        filterTag.value = str
      }
    }

    function addRecipe(r: Recipe) {
      recipes.value.push(r)
      writeDataToDropbox()
      loadThumbnail(r)
    }

    function addTag(id: string, newTag: string) {
      var newTags: Array<string> = recipes.value.filter(recipe => recipe.id === id)[0].tags.slice()
      newTags.push(newTag)
      changeRecipe(id, ContentType.TAGS, newTags)
    }

    function removeTag(id: string, oldTag: string) {
      var newTags: Array<string> = recipes.value.filter(recipe => recipe.id === id)[0].tags.slice()
      newTags = newTags.filter(tag => tag != oldTag)
      changeRecipe(id, ContentType.TAGS, newTags)
    }

    function changeRecipe(id: string, contentType: ContentType, str: string | Array<string>) {
      const recipe = recipes.value.find(r => r.id == id)
      let changed = false
      if (recipe) {
        switch (contentType) {
          case ContentType.INGREDIENTS:
            if (recipe.ingredients != str) {
              changed = true
              if (typeof str === 'string')
                recipe.ingredients = str
              console.log("Changed ingredients to", str)
            }
            break
          case ContentType.INSTRUCTION:
            if (recipe.instruction != str) {
              changed = true
              if (typeof str === 'string')
                recipe.instruction = str
              console.log("Changed instruction to", str)
            }
            break
          case ContentType.TAGS:
            if (recipe.tags != str) {
              changed = true
              if (typeof str != 'string')
                recipe.tags = str
              console.log("Changed tags to", str)
            }
        }
      }
      if (changed) {
        writeDataToDropbox()
      }
    }

    async function deleteRecipe(recipe: Recipe) {
      recipes.value = recipes.value.filter(r => r.id !== recipe.id)
      writeDataToDropbox()
      const accessToken = await getValidAccessToken();

      try {
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }

        const data = {
          path: `/recipes/${recipe.id}${recipe.extension}`,
        }

        await axios.post('https://api.dropboxapi.com/2/files/delete_v2', data, { headers });
        console.log(`File successfully deleted${recipe.id}${recipe.extension}`)
      } catch (error) {
        console.error('Error uploading file to Dropbox:', error);
        alert('An error occurred while uploading the file. Please try again.');
      }
    }

    async function updateRecipeImage(id: string, file: File) {
      const accessToken = await getValidAccessToken();
      const extension = file.name.substring(file.name.lastIndexOf('.'));
      const recipe = recipes.value.find(r => r.id === id);

      if (!recipe) return;

      try {
        // 1. Upload to Dropbox
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            path: `/recipes/${id}${extension}`,
            mode: 'overwrite',
          })
        };

        await axios.post('https://content.dropboxapi.com/2/files/upload', file, { headers });

        // 2. Update local store state
        recipe.extension = extension;
        recipe.thumbnail = window.URL.createObjectURL(file);

        // 3. Update the JSON database file so the extension change is saved
        await writeDataToDropbox();

        console.log('Image updated successfully');
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    async function writeDataToDropbox() {
      const accessToken = await getValidAccessToken();

      try {
        // Convert the data to JSON
        const exportRecipes = recipes.value.map(r => {
          const newR = { ...r }; // Create a shallow copy of the original object
          delete newR['thumbnail']; // Remove the specified attribute from the new object
          return newR; // Return the modified object
        })
        const jsonData = JSON.stringify(exportRecipes)

        // Write the JSON data to Dropbox using the Dropbox API
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            path: '/recipes.json',
            mode: 'overwrite',
            // Overwrite the existing file
          })
        }
        await axios.post('https://content.dropboxapi.com/2/files/upload',
          jsonData,
          { headers });

        console.log('Data successfully written to Dropbox');
      } catch (error) {
        console.error('Error writing data to Dropbox:',
          error);
      }
    }

    async function loadDataFromDropbox() {
      const accessToken = await getValidAccessToken();

      try {
        // Fetch the JSON data from Dropbox using the Dropbox API
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Dropbox-API-Arg': JSON.stringify({
            path: '/recipes.json',
          })
        };
        const response = await axios.post('https://content.dropboxapi.com/2/files/download',
          undefined,
          { headers });

        // Parse the JSON data and update the store
        recipes.value = response.data
        dataLoaded.value = true

        console.log('Data loaded from Dropbox:',
          recipes.value.length,
          'entries');
      } catch (error) {
        console.error('Error loading data from Dropbox:',
          error);
      }
    }

    async function loadThumbnail(recipe: Recipe) {
      const accessToken = await getValidAccessToken();

      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Dropbox-API-Arg': JSON.stringify({
          resource: {
            '.tag': 'path',
            path: `/recipes/${recipe.id}${recipe.extension}`,
          },
          format: recipe.extension === '.png' ? 'png' : 'jpeg',
          size: 'w1024h768',
          mode: 'strict',
        }),
      };

      try {
        const response = await axios.post(
          'https://content.dropboxapi.com/2/files/get_thumbnail_v2',
          undefined,
          {
            headers,
            responseType: 'arraybuffer'
          }
        );

        const thumbnail = window.URL.createObjectURL(new Blob([response.data], { type: "image/jpeg" }));

        const matchingRecipe = recipes.value.find((r) => r.id === recipe.id);
        if (matchingRecipe) {
          matchingRecipe.thumbnail = thumbnail
        }

        return {
          thumbnail,
        };
      } catch (error) {
        console.error('Error fetching thumbnail:', error);
        return { thumbnail: '' }; // Return a default or empty value on error
      }
    }

    async function loadThumbnails() {
      const accessToken = await getValidAccessToken();

      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };

      const batchSize = 25; // Dropbox API limit
      const totalRecipes = recipes.value.length;

      try {
        for (let start = 0; start < totalRecipes; start += batchSize) {
          const batch = recipes.value.slice(start, start + batchSize).map((recipe) => ({
            format: recipe.extension === '.png' ? 'png' : 'jpeg',
            mode: "strict",
            path: `/recipes/${recipe.id}${recipe.extension}`,
            quality: "quality_80",
            size: 'w1024h768',
          }));

          const data = { entries: batch };

          const response = await axios.post(
            'https://content.dropboxapi.com/2/files/get_thumbnail_batch',
            data,
            { headers }
          );

          for (let i = 0; i < response.data.entries.length; i++) {
            const fileName = response.data.entries[i].metadata.name;
            // Extract id from fileName
            const id =
              fileName.lastIndexOf('.') === -1
                ? fileName
                : fileName.substring(0, fileName.lastIndexOf('.'));
            const matchingRecipe = recipes.value.find((r) => r.id === id);
            if (matchingRecipe) {
              matchingRecipe.thumbnail = `data:image/jpeg;base64,${response.data.entries[i].thumbnail}`;
            }
          }
        }
        thumbnailsLoaded.value = true
        console.log('Thumbnails loaded successfully');
        return { thumbnail: 'success' };
      } catch (error) {
        console.error('Error fetching thumbnails:', error);
        return { thumbnail: '' };
      }
    }

    return {
      recipes,
      filterTag,
      sortedRecipes,
      addRecipe,
      deleteRecipe,
      loadDataFromDropbox,
      dataLoaded,
      loadThumbnails,
      thumbnailsLoaded,
      changeRecipe,
      addTag,
      removeTag,
      setFilter,
      getTags,
      updateRecipeImage,
    }
  })
