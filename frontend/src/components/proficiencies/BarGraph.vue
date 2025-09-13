<script setup lang="ts">
const props = defineProps<{
    name: string,
    value: number
}>()

const barWidth = `${(props.value / 5) * 100}%`
</script>

<template>
    <div class="flex items-center gap-4 w-full px-5">
        <div class="w-25 text-right shrink-0 text-lg font-medium">
            {{ props.name }}
        </div>
        <div class="flex-1 bg-gray-200 rounded-full h-4">
            <div
                class="bg-blue-500 h-4 rounded-full"
                :style="{ width: barWidth }"
            ></div>
        </div>
    </div>
</template>