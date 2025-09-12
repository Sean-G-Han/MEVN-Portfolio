<script setup lang="ts">
const props = defineProps<{
  text: string
  type?: string
}>()

const text = props.text
const type = props.type || 'Default'

const colorClasses: Record<string, { bg: string; text: string }> = {
  Default: { bg: 'bg-blue-200', text: 'text-blue-800' },
  Personal: { bg: 'bg-green-200', text: 'text-green-800' },
  School: { bg: 'bg-indigo-200', text: 'text-indigo-800' },
  Intern: { bg: 'bg-pink-200', text: 'text-pink-800' },
}

const classes = colorClasses[type] || colorClasses.default
</script>

<template>
  <span :class="`${classes.bg} ${classes.text} px-2 py-1 m-1 inline-block rounded-full text-sm`">
    {{ text }}
  </span>
</template>
