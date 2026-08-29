<script setup lang="ts">
// Текстовое поле с подписью в стиле блоков чарника.
const value = defineModel<string>({ required: true })

const props = defineProps<{
  label?: string
  ariaLabel?: string
  placeholder?: string
}>()
</script>

<template>
  <UFormField
    :label="props.label"
    size="sm"
    :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
  >
    <UInput
      v-model="value"
      :placeholder="props.placeholder"
      :aria-label="props.ariaLabel ?? props.label"
      class="w-full"
    />
  </UFormField>
</template>
