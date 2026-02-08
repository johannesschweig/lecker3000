<script setup lang="ts">
import Pill from '@/components/Pill.vue'
import { ref } from 'vue';
import { useStore } from '@/stores/index'

const props = defineProps(
  {
    initialTags: {
      type: Array as () => string[],
      default: () => []
    },
    onSave: {
      type: Function,
      required: true
    }
  }
)

const store = useStore()
const editing = ref<boolean>(false)
const creating = ref<boolean>(false)
const newTag = ref<string>('')
const tags = ref<string[]>([...props.initialTags])

const edit = () => {
  editing.value = true
}

const change = async () => {
  editing.value = false
  props.onSave(tags.value)
}

const cancel = () => {
  editing.value = false
  tags.value = props.initialTags
}

function createTag() {
  if (newTag.value.trim() !== '') {
    tags.value.push(newTag.value.trim())
    newTag.value = ''
  }
}

function addTag(tag: string) {
  if (!tags.value.includes(tag)) {
    tags.value.push(tag)
  }
}

function removeTag(tag: string) {
  tags.value = tags.value.filter(t => t !== tag)
}
</script>

<template>
  <div>
    <!-- tags header -->
    <div class="flex justify-between items-center">
      <div class="text-2xl opacity-90 mb-2">Tags</div>
      <div v-if="editing" class="flex gap-2">
        <button class="btn btn-secondary" @click="cancel()">Cancel</button>
        <button class="btn btn-primary" :disabled="tags === props.initialTags" @click="change()">Save</button>
      </div>
      <button v-else class="btn btn-secondary" @click="edit()">Edit</button>
    </div>

    <div :class="editing ? 'border border-black p-2 rounded-2xl mt-2' : ''">
      <div class="flex flex-wrap gap-1 mb-2">
        <Pill v-for="pill in tags" class="mr-2" :name='pill' :removable='editing' :click="() => removeTag(pill)" />
      </div>
      <div v-if="editing" class="flex flex-wrap gap-1 mb-4">
        <Pill v-for="pill in store.getTags.filter(t => !tags.includes(t))" class="mr-2" :name='pill' :addable="true"
          :click="() => addTag(pill)" />
      </div>
      <!-- create tag -->
      <button v-if="editing && !creating" class="btn btn-add" @click='creating = true'>Create</button>
      <div v-else-if="editing && creating">
        <input type="text" placeholder="tag" v-model="newTag"
          class="text-lg my-2 rounded-2xl px-4 py-2 border border-black mr-2" @keydown.enter='createTag()'>
        <button class="btn btn-secondary mr-2" @click='creating = false'>Cancel</button>
        <button class="btn btn-add" @click='createTag()'>Create</button>
      </div>
    </div>
  </div>
</template>