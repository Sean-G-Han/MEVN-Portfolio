<script setup lang="ts">
import { ref, watch } from "vue"

const value = ref(3)

const barWidth = ref("60%")

watch(value, (newVal) => {
  barWidth.value = `${(newVal / 5) * 100}%`
})
</script>

<template>
  <div class="p-4 w-64">
    <input type="range" min="1" max="5" v-model="value" class="w-full mb-3" />

    <div class="flex justify-between mb-1">
      <span class="text-sm font-medium text-gray-700">Value: {{ value }}</span>
    </div>

    <div class="w-full bg-gray-200 rounded-full h-6">
      <div
        class="bg-blue-500 h-6 rounded-full transition-all duration-300"
        :style="{ width: barWidth }"
      ></div>
    </div>
  </div>
</template>
