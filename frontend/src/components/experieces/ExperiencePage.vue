<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import type { Result } from '@/types/result'
import type { ExperienceProps } from '@/types/experienceProps';

const emit = defineEmits<{
  (e: 'loaded'): void
  (e: 'error'): void
}>()

const experience = ref<ExperienceProps[]>([])

const getAllExperience = async (): Promise<Result<ExperienceProps[]>> => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/experiences/get-all-experiences`)
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: (err as Error).message }
    }
}
onMounted(async () => {
    const res = await getAllExperience()
    if (res.success) {
        experience.value = res.data
        emit('loaded')
    } else {
        emit('error')
    }
})
</script>


<template>
    <div class="space-y-4 mt-20 md:overflow-y-auto h-full">
        <ExperienceCard
            v-for="experience in experience"
            :key="experience.company"
            v-bind="experience"
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