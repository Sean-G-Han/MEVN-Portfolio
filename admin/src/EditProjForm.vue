<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { ProjectProps } from './types/projectProps'
import { projectDefaults } from './types/projectProps'
import type { Result } from './types/result'
import './form.css'

const projectTitles = ref<string[]>([])
const selectedTitle = ref<string>('')

const props = withDefaults(defineProps<ProjectProps>(), projectDefaults)
const originalTitle = ref('')
const title = ref(props.title)
const description = ref(props.description)
const techStack = ref(props.techStack)
const link = ref(props.link)
const date = ref(props.date)
const type = ref(props.type)

const _formatDate = (isoString: string): string => {
    if (!isoString) return ''
    try {
        return new Date(isoString).toISOString().split('T')[0]
    } catch {
        return ''
    }
}

const _filterIrregularInputs = (str: string) => {
    return str.split(',').map(t => t.trim()).filter(t => t)
}

const getAllTitles = async (): Promise<Result<string[]>> => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects/get-all-titles`)
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: (err as Error).message }
    }
}

const handleSelectTitle = async (szTitle: string): Promise<Result<ProjectProps>> => {
    try {

        originalTitle.value = szTitle

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects/get-project`, {
            params: { title: szTitle }
        })

        title.value = res.data.title
        description.value = res.data.description
        techStack.value = res.data.techStack
        link.value = res.data.link
        type.value = res.data.type
        date.value = _formatDate(res.data.date)

        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: (err as Error).message }
    }
}

const fetchProjectTitles = async () => {
    const res = await getAllTitles()
    projectTitles.value = res.success ? res.data : []
}

onMounted(async () => {
    console.log('Component mounted, fetching projects...')
    await fetchProjectTitles()
})

const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

const submitProject = async () => {
    const formattedDate = date.value ? new Date(date.value) : undefined
    try {
        const payload = {
            title: title.value,
            description: description.value,
            techStack: _filterIrregularInputs(techStack.value.toString()),
            link: link.value,
            date: formattedDate,
            type: type.value
        }
        await axios.post(`${import.meta.env.VITE_API_URL}/projects/create-project`, payload)
        await fetchProjectTitles()
        alert('Project created successfully')
    } catch (err) {
        alert('Error creating project: ' + (err as Error).message)
    }
}

const editProject = async () => {
    if (!confirm(`Are you sure you want to update ${originalTitle.value} this project?`)) {
        return
    }
    const formattedDate = date.value ? new Date(date.value) : undefined
    try {
        const payload = {
            originalTitle: originalTitle.value,
            title: title.value,
            description: description.value,
            techStack: _filterIrregularInputs(techStack.value.toString()),
            link: link.value,
            date: formattedDate,
            type: type.value
        }
        await axios.put(`${import.meta.env.VITE_API_URL}/projects/edit-project`, payload)
        await fetchProjectTitles()
        alert('Project updated successfully')
    } catch (err) {
        alert('Error updating project: ' + (err as Error).message)
    }
}

const deleteProject = async () => {
    if (!confirm(`Are you sure you want to delete ${originalTitle.value} this project?`)) {
        return
    }
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/projects/delete-project`, { data: { title: originalTitle.value } })
        await fetchProjectTitles()
        alert('Project deleted successfully')
    } catch (err) {
        alert('Error deleting project: ' + (err as Error).message)
    }
}

</script>

<template>
    <form>
        <div>
            <label for="title">Select Existing Form (Optional):</label>
            <select id="title" v-model="selectedTitle" @change="handleSelectTitle(selectedTitle)" required>
                <option value="" disabled selected>Select a title</option>
                <option v-for="title in projectTitles" :key="title" :value="title">
                    {{ title }}
            </option>
            </select>
        </div>

        <div>
            <label for="title">Title:</label>
            <input id="title" v-model="title" type="text" required />
        </div>

        <div>
            <label for="type">Type:</label>
            <input id="type" v-model="type" type="text" required />
        </div>

        <div>
            <label for="description">Description:</label>
            <textarea 
                id="description" 
                v-model="description" 
                @input="autoResize"
                :style="{ resize: 'none', overflow: 'hidden' }"
                rows="3"
                required
            ></textarea>
        </div>

        <div>
            <label for="techStack">Tech Stack (comma-separated):</label>
            <input id="techStack" v-model="techStack" type="text" required />
        </div>

        <div>
            <label for="link">Link (optional):</label>
            <input id="link" v-model="link" type="url" />
        </div>

        <div>
            <label for="date">Date (optional):</label>
            <input id="date" v-model="date" type="date" />
        </div>
        <div class="button-row">
            <button type="button" @click="submitProject">Create Project</button>
            <button type="button" @click="editProject">Edit Project</button>
            <button type="button" @click="deleteProject">Delete Project</button>
        </div>
    </form>
</template>

<style scoped>

</style>