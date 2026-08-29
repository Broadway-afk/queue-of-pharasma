<script setup lang="ts">
import { computed } from 'vue'
import type { Charsheet } from '@/types/charsheet'
import { ABILITY_KEYS, ABILITY_LABELS } from '@/data/charsheetMeta'
import { classDcTotal } from '@/utils/pf2e'
import CharsheetSection from './CharsheetSection.vue'
import TotalValue from './TotalValue.vue'
import NumberField from './NumberField.vue'
import ProficiencyPicker from './ProficiencyPicker.vue'

const sheet = defineModel<Charsheet>({ required: true })

const total = computed(() => classDcTotal(sheet.value))

const abilityOptions = ABILITY_KEYS.map((value) => ({ value, label: ABILITY_LABELS[value] }))
</script>

<template>
  <CharsheetSection
    title="Сложность класса"
    icon="i-heroicons-academic-cap"
    hint="10 + ключевая характеристика + владение + предмет"
  >
    <div class="flex flex-wrap items-end gap-3">
      <TotalValue :value="total" label="СЛ" />
      <UFormField
        label="Ключевая характеристика"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
        class="flex-1 min-w-40"
      >
        <USelect
          v-model="sheet.classDc.keyAbility"
          :items="abilityOptions"
          value-key="value"
          class="w-full"
        />
      </UFormField>
      <ProficiencyPicker v-model="sheet.classDc.rank" label="Владение: сложность класса" />
      <div class="w-20">
        <NumberField v-model="sheet.classDc.item" label="Предмет" />
      </div>
    </div>
  </CharsheetSection>
</template>
