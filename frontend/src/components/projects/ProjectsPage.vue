<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProjectCard from '../../components/projects/ProjectCard.vue'
import axios from 'axios'
import type { Result } from '@/types/result'
import type { ProjectProps } from '@/types/projectProps'

const props = defineProps<{
  visible: boolean
}>();

const emit = defineEmits<{
  (e: 'loaded'): void
  (e: 'error'): void
}>()

const projects = ref<ProjectProps[]>([])

const getAllProjects = async (): Promise<Result<ProjectProps[]>> => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects/get-all-projects`)
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: (err as Error).message }
    }
}
onMounted(async () => {
    const res = await getAllProjects()
    if (res.success) {
        projects.value = res.data
        emit('loaded')
    } else {
        emit('error')
    }
})
</script>


<template>
    <div class="space-y-4 mt-20 md:overflow-y-auto h-full">
        <ProjectCard
            v-for="project in projects"
            :key="project.title"
            v-bind="project"
            :visible="props.visible"
        />
    </div>
</template>

<style scoped>
.md\:overflow-y-auto {
    margin-top: 5rem;
    max-height: calc(100vh - 5rem);
}

.md\:overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.md\:overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.md\:overflow-y-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.md\:overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>