<script setup lang="ts">
// Компактное числовое поле: используется во всех блоках чарника,
// чтобы ширина и выравнивание были одинаковыми.
const value = defineModel<number>({ required: true })

const props = defineProps<{
  label?: string
  ariaLabel?: string
  min?: number
  max?: number
  placeholder?: string
}>()
</script>

<template>
  <UFormField
    :label="props.label"
    size="sm"
    :ui="{ root: 'flex flex-col justify-end', label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
  >
    <UInput
      v-model.number="value"
      type="number"
      :min="props.min"
      :max="props.max"
      :placeholder="props.placeholder"
      :aria-label="props.ariaLabel ?? props.label"
      :ui="{ base: 'text-center tabular-nums' }"
      class="w-full"
    />
  </UFormField>
</template>
