<script setup lang="ts">
import '../../style.css'
import type { ExperienceProps } from '../../types/experienceProps'
import RoundTag from '../RoundTag.vue'
import { ref, onMounted, nextTick, computed, watch } from 'vue'

const currentHeight = ref(0)
const collapsedHeight = ref(0)
const descContainer = ref<HTMLElement | null>(null)

const props = defineProps<ExperienceProps & { visible: boolean }>()
const { company, role, type, from, to, description, visible} = props

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

const isCollapsed = computed(() => currentHeight.value === collapsedHeight.value)

watch(() => props.visible, async (val) => {
  if (val) {
    await nextTick()
    if (descContainer.value) {
      const el = descContainer.value
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
      const fullHeight = el.scrollHeight
      collapsedHeight.value = Math.min(fullHeight, lineHeight * 5)
      currentHeight.value = collapsedHeight.value
    }
  }
})

</script>

<template>
  <div class="card">

    <div class="flex items-center gap-1">
      <h2 class="text-xl font-bold">{{ company }}</h2>
      <RoundTag :text="role" :type="type" class="mt-0.5" />
    </div>
    <p>{{ from?.split('T')[0] ?? '' }} - {{ to?.split('T')[0] ?? '' }}</p>

    <div
      ref="descContainer"
      class="description-container relative overflow-hidden transition-[max-height] duration-500 ease-in-out"
      :style="{ maxHeight: currentHeight + 'px' }"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <p class="whitespace-pre-line">
        {{ description }}
      </p>

      <div v-if="isCollapsed" class="fade-overlay absolute bottom-0 left-0 w-full h-8 pointer-events-none"></div>
    </div>
    
  </div>
</template>
