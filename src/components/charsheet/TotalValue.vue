<script setup lang="ts">
import { formatModifier } from '@/utils/pf2e'

const props = withDefaults(
  defineProps<{
    /** Итоговое значение. Всегда вычисляется, поле только для чтения. */
    value: number
    label?: string
    /** Показывать знак: для модификаторов и бонусов атаки — да, для КЗ и DC — нет. */
    signed?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { signed: false, size: 'md' }
)

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-lg min-w-11 py-1',
  md: 'text-2xl min-w-14 py-1.5',
  lg: 'text-3xl min-w-20 py-3'
}
</script>

<template>
  <div class="flex flex-col items-center gap-0.5">
    <output
      class="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-2 text-center font-bold tabular-nums leading-none"
      :class="sizeClasses[props.size]"
    >
      {{ props.signed ? formatModifier(props.value) : props.value }}
    </output>
    <span v-if="props.label" class="text-[0.65rem] uppercase tracking-wide text-neutral-500">
      {{ props.label }}
    </span>
  </div>
</template>
