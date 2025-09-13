<script setup lang="ts">
import ProjectCard from './components/projects/ProjectCard.vue';
import type { ProjectProps } from './types/projectProps'
import axios from 'axios'
import type { Result } from './types/result'
import './style.css'
import { onMounted, ref } from 'vue'
import ProficiencyCard from './components/proficiencies/ProficiencyCard.vue';
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

const proficiencyCards = [
  {
    categories: [
      { name: 'Frontend Proficiency', types: ['Frontend', 'Software Development'] },
      { name: 'Backend Proficiency', types: ['Backend', 'Software Development'] }
    ]
  },
  {
    categories: [
      { name: 'Language Proficiency', types: ['Language'] },
    ]
  },
  {
    categories: [
      { name: 'Game Dev Proficiency', types: ['Game Development'] },
    ]
  }
]

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
    }
})
</script>

<template>
  <div id="app" class="flex flex-col md:flex-row min-h-screen gap-6">
    <div class="md:w-1/2 md:overflow-y-auto relative">
      <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl-Y3sIpyoFofDDn0l4xJzG8tQSQ9cOXhvkQ&s" 
        alt="Portrait" 
        class="cropped-image"
      >
      
      <div class="absolute bottom-0 left-0 w-full bg-white z-10">
        <Carousel 
          :items-to-show="1" 
          :wrap-around="true" 
          :autoplay="3000" 
          :pause-autoplay-on-hover="true" 
          class="carousel-container"
        >
          <Slide v-for="(card, index) in proficiencyCards" :key="index" class="carousel-slide">
            <div class="slide-content">
              <ProficiencyCard :categories="card.categories" />
            </div>
          </Slide>

          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>
      </div>
    </div>

    <div class="md:w-1/2 md:h-screen md:overflow-y-auto py-5">
      <div class="space-y-4">
        <ProjectCard
          v-for="project in projects"
          :key="project.title"
          v-bind="project"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
#app {
  max-width: 1500px;
  margin: 0 auto;
}

.cropped-image {
  width: 100%;
  height: 100vh; 
  object-fit: cover;
  object-position: center;
}

.carousel-container {
  width: 100%;
  position: relative;
}

.carousel-slide {
  width: 100%;
}

.slide-content {
  width: 100%;
  padding: 0 10px;
}

/* Custom scrollbar styling */
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

/* Custom carousel navigation styles */
:deep(.carousel__container) {
  padding-bottom: 30px;
  background: red;
}
:deep(.carousel__prev),
:deep(.carousel__next) {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
}

:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
  background-color: white;
}

:deep(.carousel__pagination-button) {
  background-color: #cbd5e1;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin: 0 4px;
}

:deep(.carousel__pagination-button--active) {
  background-color: #3b82f6;
}
</style>