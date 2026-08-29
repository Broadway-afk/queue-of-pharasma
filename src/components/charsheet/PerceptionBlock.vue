<script setup lang="ts">
import { computed } from 'vue'
import type { Charsheet } from '@/types/charsheet'
import { perceptionTotal } from '@/utils/pf2e'
import CharsheetSection from './CharsheetSection.vue'
import TotalValue from './TotalValue.vue'
import NumberField from './NumberField.vue'
import ProficiencyPicker from './ProficiencyPicker.vue'

const sheet = defineModel<Charsheet>({ required: true })

const total = computed(() => perceptionTotal(sheet.value))
</script>

<template>
  <CharsheetSection title="Внимательность" icon="i-heroicons-eye" hint="Мудрость + владение + предмет">
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <TotalValue :value="total" signed />
        <ProficiencyPicker v-model="sheet.perception.rank" label="Владение: Внимательность" />
        <div class="w-20">
          <NumberField v-model="sheet.perception.item" label="Предмет" />
        </div>
      </div>

      <UFormField
        label="Чувства"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
      >
        <UTextarea v-model="sheet.perception.senses" :rows="2" autoresize class="w-full" />
      </UFormField>
    </div>
  </CharsheetSection>
</template>
