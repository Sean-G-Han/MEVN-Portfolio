<script setup lang="ts">
import '../../style.css'
import type { ProficiencyProps } from '../../types/proficiencyProps'
import { ref, onMounted } from 'vue'
import type { Result } from '@/types/result';
import axios from 'axios';
import BarGraph from './BarGraph.vue';

const emit = defineEmits<{
  (e: 'loaded'): void
  (e: 'error'): void
}>()

type Category = {
    name: string,
    types: string[]
}

const props = defineProps<{
    categories: Category[]
}>()

const proficiencyMap = ref<Map<string, ProficiencyProps[]>>(new Map());

const getAllProficienciesByType = async (types: string[]): Promise<Result<ProficiencyProps[]>> => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/proficiencies/get-proficiencies-by-type`, { 
            params: { 
                type: types.join(',')
            }
        })
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: (err as Error).message }
    }
}

onMounted(async () => {
    try {
        const promises = props.categories.map(async (category) => {
        const types = category.types
        const result = await getAllProficienciesByType(types)

        if (result.success) {
            const newMap = new Map(proficiencyMap.value)
            newMap.set(category.name, result.data)
            proficiencyMap.value = newMap
        } else {
            throw new Error(result.error)
        }
        })

        await Promise.all(promises)
        
        emit('loaded')
    } catch (err) {
        emit('error')
    }
})

</script>

<template>
    <div class="card">
        <div v-for="[category, profs] in proficiencyMap" :key="category" style="margin-bottom: 1.5rem;">
            <h2 class="text-xl font-bold mb-2">{{ category }}</h2>
            <BarGraph
                v-for="proficiency in profs"
                :key="proficiency.language"
                :name="proficiency.language"
                :value="proficiency.level"
            />
        </div>
    </div>
</template>