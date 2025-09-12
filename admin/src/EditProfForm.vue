<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

type ProficiencyProps = {
  language: string
  level: number
  type: string[]
}

const proficiencyList = ref<string[]>([])
const selectedLanguage = ref('')

const language = ref('')
const level = ref(1)
const types = ref('')

const _filterIrregularInputs = (str: string) => {
  return str.split(',').map(t => t.trim()).filter(t => t)
}

const getAllLanguages = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/proficiencies/get-all-languages`)
    proficiencyList.value = res.data
  } catch (err) {
    console.error(err)
    proficiencyList.value = []
  }
}

const handleSelectLanguage = async (lang: string) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/proficiencies/get-proficiency`, {
      params: { language: lang }
    })
    language.value = res.data.language
    level.value = res.data.level
    types.value = res.data.type.join(', ')
  } catch (err) {
    console.error(err)
  }
}

const submitProficiency = async () => {
  try {
    const payload: ProficiencyProps = {
      language: language.value,
      level: level.value,
      type: _filterIrregularInputs(types.value)
    }
    await axios.post(`${import.meta.env.VITE_API_URL}/proficiencies/create-proficiency`, payload)
    await getAllLanguages()
    alert('Proficiency created successfully')
  } catch (err) {
    alert('Error creating proficiency: ' + (err as Error).message)
  }
}

const editProficiency = async () => {
  if (!selectedLanguage.value) return alert('Select a language first!')
  try {
    const payload = {
      originalLanguage: selectedLanguage.value,
      language: language.value,
      level: level.value,
      type: _filterIrregularInputs(types.value)
    }
    await axios.put(`${import.meta.env.VITE_API_URL}/proficiencies/edit-proficiency`, payload)
    await getAllLanguages()
    alert('Proficiency updated successfully')
  } catch (err) {
    alert('Error updating proficiency: ' + (err as Error).message)
  }
}

const deleteProficiency = async () => {
  if (!selectedLanguage.value) return alert('Select a language first!')
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/proficiencies/delete-proficiency`, {
      data: { language: selectedLanguage.value }
    })
    await getAllLanguages()
    alert('Proficiency deleted successfully')
    language.value = ''
    level.value = 1
    types.value = ''
    selectedLanguage.value = ''
  } catch (err) {
    alert('Error deleting proficiency: ' + (err as Error).message)
  }
}

onMounted(async () => {
  await getAllLanguages()
})
</script>

<template>
  <form class="space-y-4">

    <div>
      <label for="existing">Select Existing Proficiency (Optional):</label>
      <select id="existing" v-model="selectedLanguage" @change="handleSelectLanguage(selectedLanguage)">
        <option value="" disabled selected>Select a language</option>
        <option v-for="lang in proficiencyList" :key="lang" :value="lang">{{ lang }}</option>
      </select>
    </div>

    <div>
      <label for="language">Language:</label>
      <input id="language" v-model="language" type="text" required />
    </div>

    <div>
      <label for="level">Level (1-5):</label>
      <input id="level" v-model.number="level" type="number" min="1" max="5" required />
    </div>

    <div>
      <label for="types">Type(s) (comma-separated):</label>
      <input id="types" v-model="types" type="text" />
    </div>

    <div class="button-row">
      <button type="button" @click="submitProficiency" class="bg-blue-500 text-white px-3 py-1 rounded">Create</button>
      <button type="button" @click="editProficiency" class="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
      <button type="button" @click="deleteProficiency" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
    </div>
  </form>
</template>
