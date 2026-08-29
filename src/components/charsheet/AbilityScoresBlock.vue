<script setup lang="ts">
import { computed } from 'vue'
import type { Charsheet } from '@/types/charsheet'
import { ABILITY_KEYS, ABILITY_LABELS, ABILITY_SHORT_LABELS } from '@/data/charsheetMeta'
import { abilityModifier } from '@/utils/pf2e'
import CharsheetSection from './CharsheetSection.vue'
import TotalValue from './TotalValue.vue'

const sheet = defineModel<Charsheet>({ required: true })

// Модификатор всегда производный от значения характеристики.
const abilities = computed(() =>
  ABILITY_KEYS.map((key) => ({
    key,
    label: ABILITY_LABELS[key],
    short: ABILITY_SHORT_LABELS[key],
    modifier: abilityModifier(sheet.value.abilities[key])
  }))
)
</script>

<template>
  <CharsheetSection
    title="Характеристики"
    icon="i-heroicons-sparkles"
    hint="Модификатор считается автоматически"
  >
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <div
        v-for="ability in abilities"
        :key="ability.key"
        class="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 p-3"
      >
        <span class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {{ ability.label }}
        </span>
        <TotalValue :value="ability.modifier" signed size="lg" label="Модификатор" />
        <UInput
          v-model.number="sheet.abilities[ability.key]"
          type="number"
          size="sm"
          :aria-label="`${ability.label}: значение`"
          :ui="{ base: 'text-center tabular-nums' }"
          class="w-20"
        />
        <span class="text-[0.65rem] uppercase tracking-wide text-neutral-500">
          Значение · {{ ability.short }}
        </span>
      </div>
    </div>
  </CharsheetSection>
</template>
