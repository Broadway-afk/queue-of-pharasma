<script setup lang="ts">
import { computed } from 'vue'
import type { Charsheet } from '@/types/charsheet'
import {
  ABILITY_SHORT_LABELS,
  SAVING_THROW_ABILITIES,
  SAVING_THROW_KEYS,
  SAVING_THROW_LABELS
} from '@/data/charsheetMeta'
import { savingThrowTotal } from '@/utils/pf2e'
import CharsheetSection from './CharsheetSection.vue'
import TotalValue from './TotalValue.vue'
import ProficiencyPicker from './ProficiencyPicker.vue'

const sheet = defineModel<Charsheet>({ required: true })

const saves = computed(() =>
  SAVING_THROW_KEYS.map((key) => ({
    key,
    label: SAVING_THROW_LABELS[key],
    ability: ABILITY_SHORT_LABELS[SAVING_THROW_ABILITIES[key]],
    total: savingThrowTotal(sheet.value, key)
  }))
)
</script>

<template>
  <CharsheetSection title="Спасброски" icon="i-heroicons-shield-exclamation">
    <ul class="flex flex-col gap-3">
      <li
        v-for="save in saves"
        :key="save.key"
        class="flex flex-wrap items-center gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-3"
      >
        <TotalValue :value="save.total" signed />
        <div class="flex-1 min-w-24">
          <p class="text-sm font-semibold">{{ save.label }}</p>
          <p class="text-[0.65rem] uppercase tracking-wide text-neutral-500">{{ save.ability }}</p>
        </div>
        <ProficiencyPicker
          v-model="sheet.savingThrows[save.key].rank"
          :label="`Владение: ${save.label}`"
        />
        <UInput
          v-model.number="sheet.savingThrows[save.key].item"
          type="number"
          size="sm"
          :aria-label="`${save.label}: бонус предмета`"
          :ui="{ base: 'text-center tabular-nums' }"
          class="w-16"
        />
      </li>
    </ul>
    <p class="mt-2 text-[0.65rem] uppercase tracking-wide text-neutral-500">
      Правое поле — бонус предмета
    </p>
  </CharsheetSection>
</template>
