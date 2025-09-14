<script setup lang="ts">
import '../../style.css'
import type { ProjectProps } from '../../types/projectProps'
import RoundTag from '../RoundTag.vue'
import { ref, onMounted, nextTick, computed } from 'vue'

const currentHeight = ref(0)
const collapsedHeight = ref(0)
const descContainer = ref<HTMLElement | null>(null)

const props = defineProps<ProjectProps>()
const { title, description, techStack, date, type } = props

onMounted(() => {
  nextTick(() => {
    if (descContainer.value) {
      const el = descContainer.value
      const style = getComputedStyle(el)
      const lineHeight = parseFloat(style.lineHeight)
      const fullHeight = el.scrollHeight

      collapsedHeight.value = Math.min(fullHeight, lineHeight * 5)
      currentHeight.value = collapsedHeight.value
    }
  })
})

const onMouseEnter = () => {
  if (descContainer.value) {
    currentHeight.value = descContainer.value.scrollHeight
  }
}

const onMouseLeave = () => {
  currentHeight.value = collapsedHeight.value
}

const redirectToLink = () => {
  window.location.href = props.link || '#'
}

const isCollapsed = computed(() => currentHeight.value === collapsedHeight.value)
</script>

<template>
  <div class="card">

    <div class="flex items-center gap-1">
      <h2 class="text-xl font-bold">{{ title }}</h2>
      <RoundTag :text="type" :type="type" class="mt-0.5" />
    </div>
    <p>{{ date?.split('T')[0] ?? '' }}</p>

    <div
      ref="descContainer"
      class="description-container relative overflow-hidden transition-[max-height] duration-500 ease-in-out"
      :style="{ maxHeight: currentHeight + 'px' }"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @mousedown="redirectToLink"
    >
      <p class="whitespace-pre-line">
        {{ description }}
      </p>

      <div v-if="isCollapsed" class="fade-overlay absolute bottom-0 left-0 w-full h-8 pointer-events-none"></div>
    </div>

    <div class="mt-4 flex flex-wrap">
      <RoundTag v-for="tech in techStack" :key="tech" :text="tech" />
    </div>
  </div>
</template>
