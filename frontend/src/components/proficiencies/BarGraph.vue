<script setup lang="ts">
import { ref } from "vue"

const value = ref(3.5)

const barWidth = ref(`${(value.value / 5) * 100}%`)
</script>

<template>
  <div class="w-100">
    <div class="w-full bg-gray-200 rounded-full h-6">
      <div
        class="bg-blue-500 h-6 rounded-full"
        :style="{ width: barWidth }"
      ></div>
    </div>
  </div>
</template>
