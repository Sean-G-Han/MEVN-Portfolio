<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import type { ProficiencyProps } from '../../types/proficiencyProps'
  import type { Result } from '@/types/result'
  import ProficiencyCard from './ProficiencyCard.vue'
  import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
  import 'vue3-carousel/dist/carousel.css'

  const emit = defineEmits<{
    (e: 'loaded'): void
    (e: 'error'): void
  }>()

  const proficiencyCards = [
    {
      categories: [
        { name: 'Frontend Proficiency', types: ['Frontend', 'Software Development'] },
        { name: 'Backend Proficiency', types: ['Backend', 'Software Development'] }
      ]
    },
    { categories: [{ name: 'Language Proficiency', types: ['Language'] }] },
    { categories: [{ name: 'Game Dev Proficiency', types: ['Game Development'] }] }
  ]

  const proficiencyMap = ref<Map<string, ProficiencyProps[]>>(new Map())

  const getAllProficienciesByType = async (types: string[]): Promise<Result<ProficiencyProps[]>> => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/proficiencies/get-proficiencies-by-type`, {
        params: { type: types.join(',') }
      })
      return { success: true, data: res.data }
    } catch (err) {
      return { success: false, error: (err as Error).message }
    }
  }

  const loadProficiencies = async () => {
    try {
      const promises = proficiencyCards.flatMap(card =>
        card.categories.map(async category => {
          const result = await getAllProficienciesByType(category.types)
          if (result.success) {
            proficiencyMap.value.set(category.name, result.data)
          } else {
            throw new Error(result.error)
          }
        })
      )
      await Promise.all(promises)
      emit('loaded')
    } catch (err) {
      console.error(err)
      emit('error')
    }
  }

  onMounted(loadProficiencies)
</script>

<template>
  <Carousel
    :items-to-show="1"
    :wrap-around="true"
    :autoplay="3000"
    :pause-autoplay-on-hover="true"
    class="carousel-container"
  >
    <Slide v-for="(card, index) in proficiencyCards" :key="index" class="carousel-slide">
      <ProficiencyCard
        :categories="card.categories.map(c => ({ name: c.name, proficiencies: proficiencyMap.get(c.name) || [] }))"
      />
    </Slide>

    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>


<style scoped>
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