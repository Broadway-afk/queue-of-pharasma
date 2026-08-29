<script setup lang="ts">
import type { Charsheet } from '@/types/charsheet'
import CharsheetSection from './CharsheetSection.vue'
import NumberField from './NumberField.vue'

const sheet = defineModel<Charsheet>({ required: true })
</script>

<template>
  <CharsheetSection title="Скорость" icon="i-heroicons-bolt">
    <div class="flex flex-col gap-3">
      <div class="flex items-end gap-2">
        <div class="w-24">
          <NumberField v-model="sheet.speed.value" label="Скорость" :min="0" />
        </div>
        <span class="pb-2 text-sm text-neutral-500">футов</span>
      </div>

      <UFormField
        label="Другие виды перемещения и заметки"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
      >
        <UTextarea v-model="sheet.speed.notes" :rows="2" autoresize class="w-full" />
      </UFormField>
    </div>
  </CharsheetSection>
</template>
