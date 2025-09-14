<script setup lang="ts">
import type { ProficiencyProps } from '../../types/proficiencyProps'
import BarGraph from './BarGraph.vue'

type CategoryData = { name: string; proficiencies: ProficiencyProps[] }

const props = defineProps<{
  categories: CategoryData[]
}>()
</script>

<template>
  <div class="card">
    <div v-for="category in props.categories" :key="category.name">
      <h2 class="text-xl font-bold mb-2">{{ category.name }}</h2>
      <BarGraph
        v-for="proficiency in category.proficiencies"
        :key="proficiency.language"
        :name="proficiency.language"
        :value="proficiency.level"
      />
    </div>
  </div>
</template>