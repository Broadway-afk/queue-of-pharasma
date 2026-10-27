<script setup lang="ts">
import type { Charsheet } from '@/types/charsheet'
import CharsheetSection from './CharsheetSection.vue'
import NumberField from './NumberField.vue'

const sheet = defineModel<Charsheet>({ required: true })
</script>

<template>
  <CharsheetSection title="Очки здоровья" icon="i-heroicons-heart">
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-3 gap-3">
        <NumberField v-model="sheet.hitPoints.max" label="Максимум" :min="0" />
        <NumberField v-model="sheet.hitPoints.current" label="Текущие" />
        <NumberField v-model="sheet.hitPoints.temporary" label="Временные" :min="0" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <NumberField
          v-model="sheet.hitPoints.dying"
          label="Умирание"
          :min="0"
          :max="4"
        />
        <NumberField v-model="sheet.hitPoints.wounded" label="Ранение" :min="0" />
      </div>

      <UFormField
        label="Сопротивления и иммунитеты"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
      >
        <UTextarea
          v-model="sheet.hitPoints.resistancesAndImmunities"
          :rows="2"
          autoresize
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Состояния"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
      >
        <UTextarea v-model="sheet.hitPoints.conditions" :rows="2" autoresize class="w-full" />
      </UFormField>
    </div>
  </CharsheetSection>
</template>
