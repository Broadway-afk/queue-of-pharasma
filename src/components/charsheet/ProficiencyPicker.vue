<script setup lang="ts">
import type { ProficiencyRank } from '@/types/charsheet'
import { PROFICIENCY_LABELS, PROFICIENCY_LETTERS, TEML_RANKS } from '@/data/charsheetMeta'

const rank = defineModel<ProficiencyRank>({ required: true })

const props = defineProps<{
  /** Доступное описание группы, например «Владение: Акробатика». */
  label?: string
}>()

// Ранг один: отметка переносится на выбранную клетку.
// Повторный клик по активной клетке возвращает «неопытного».
function toggle(value: Exclude<ProficiencyRank, 'untrained'>) {
  rank.value = rank.value === value ? 'untrained' : value
}
</script>

<template>
  <fieldset class="flex items-center gap-1 sm:gap-1.5">
    <legend class="sr-only">{{ props.label ?? 'Ранг владения' }}</legend>
    <UCheckbox
      v-for="value in TEML_RANKS"
      :key="value"
      :model-value="rank === value"
      :label="PROFICIENCY_LETTERS[value]"
      :aria-label="PROFICIENCY_LABELS[value]"
      :title="PROFICIENCY_LABELS[value]"
      size="md"
      :ui="{
        root: 'items-center gap-1',
        label: 'py-1.5 pe-1 text-xs font-semibold text-neutral-500 cursor-pointer select-none'
      }"
      @update:model-value="toggle(value)"
    />
  </fieldset>
</template>
