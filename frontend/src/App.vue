<script setup lang="ts">
import ProjectCard from './components/projects/ProjectCard.vue';
import type { ProjectProps } from './types/projectProps'
import axios from 'axios'
import type { Result } from './types/result'
import './style.css'
import { onMounted, ref } from 'vue'
import BarGraph from './components/proficiencies/BarGraph.vue';

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
      console.log('Fetched projects:', projects.value)
      projects.value.forEach(proj => {
        console.log(`Project: ${proj.title}, Date: ${proj.date}`)
      })
    }
})

</script>

<template>
  <div id="app" class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <h1 class="text-2xl font-bold">About Me</h1>
      <BarGraph />
    </div>

    <div>
      <ProjectCard
        v-for="project in projects"
        :key="project.title"
        v-bind="project"
      />
    </div>
  </div>
</template>

<style scoped>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
