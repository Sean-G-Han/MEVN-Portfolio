<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { Result } from './types/result'
import './form.css'
import type { ExperienceProps } from './types/experienceProps'

const companyNames = ref<string[]>([])
const selectedCompany = ref<string>('')

const originalCompany = ref('')
const company = ref('')
const role = ref('')
const type = ref('')
const from = ref('')
const to = ref('')
const description = ref('')

const _formatDate = (isoString?: string): string => {
  if (!isoString) return ''
  try {
    return new Date(isoString).toISOString().split('T')[0]
  } catch {
    return ''
  }
}


const getAllCompanies = async (): Promise<Result<string[]>> => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/experiences/get-all-companies`)
    return { success: true, data: res.data }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

const handleSelectCompany = async (szCompany: string): Promise<Result<ExperienceProps>> => {
  try {
    originalCompany.value = szCompany

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/experiences/get-experience`, {
      params: { company: szCompany },
    })

    company.value = res.data.company
    role.value = res.data.role
    type.value = res.data.type
    description.value = res.data.description
    from.value = _formatDate(res.data.from)
    to.value = _formatDate(res.data.to)

    return { success: true, data: res.data }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

const fetchCompanies = async () => {
  const res = await getAllCompanies()
  companyNames.value = res.success ? res.data : []
}

onMounted(async () => {
  console.log('ExperienceForm mounted, fetching companies...')
  await fetchCompanies()
})

const submitExperience = async () => {
  const payload = {
    company: company.value,
    role: role.value,
    type: type.value,
    description: description.value,
    from: from.value ? new Date(from.value) : undefined,
    to: to.value ? new Date(to.value) : undefined,
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/experiences/create-experience`, payload)
    await fetchCompanies()
    alert('Experience created successfully')
  } catch (err) {
    alert('Error creating experience: ' + (err as Error).message)
  }
}

const editExperience = async () => {
  if (!confirm(`Are you sure you want to update ${originalCompany.value}?`)) {
    return
  }
  const payload = {
    originalCompany: originalCompany.value,
    company: company.value,
    role: role.value,
    type: type.value,
    description: description.value,
    from: from.value ? new Date(from.value) : undefined,
    to: to.value ? new Date(to.value) : undefined,
  }

  try {
    await axios.put(`${import.meta.env.VITE_API_URL}/experiences/edit-experience`, payload)
    await fetchCompanies()
    alert('Experience updated successfully')
  } catch (err) {
    alert('Error updating experience: ' + (err as Error).message)
  }
}

const deleteExperience = async () => {
  if (!confirm(`Are you sure you want to delete ${originalCompany.value}?`)) {
    return
  }
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/experiences/delete-experience`, {
      data: { company: originalCompany.value },
    })
    await fetchCompanies()
    alert('Experience deleted successfully')
  } catch (err) {
    alert('Error deleting experience: ' + (err as Error).message)
  }
}
</script>

<template>
  <form>
    <div>
      <label for="companySelect">Select Existing Company (Optional):</label>
      <select
        id="companySelect"
        v-model="selectedCompany"
        @change="handleSelectCompany(selectedCompany)"
      >
        <option value="" disabled selected>Select a company</option>
        <option v-for="c in companyNames" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div>
      <label for="company">Company:</label>
      <input id="company" v-model="company" type="text" required />
    </div>

    <div>
      <label for="role">Role:</label>
      <input id="role" v-model="role" type="text" required />
    </div>

    <div>
      <label for="type">Type:</label>
      <input id="type" v-model="type" type="text" required />
    </div>

    <div>
      <label for="from">From:</label>
      <input id="from" v-model="from" type="date" />
    </div>

    <div>
      <label for="to">To:</label>
      <input id="to" v-model="to" type="date" />
    </div>

    <div>
      <label for="description">Description:</label>
      <textarea id="description" v-model="description" rows="3"></textarea>
    </div>

    <div class="button-row">
      <button type="button" @click="submitExperience">Create Experience</button>
      <button type="button" @click="editExperience">Edit Experience</button>
      <button type="button" @click="deleteExperience">Delete Experience</button>
    </div>
  </form>
</template>
