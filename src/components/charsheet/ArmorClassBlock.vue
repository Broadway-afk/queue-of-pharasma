<script setup lang="ts">
import { computed } from 'vue'
import type { ArmorCategory, Charsheet } from '@/types/charsheet'
import { ARMOR_CATEGORIES, ARMOR_CATEGORY_LABELS } from '@/data/charsheetMeta'
import { armorClassTotal, cappedDexBonus, formatModifier } from '@/utils/pf2e'
import CharsheetSection from './CharsheetSection.vue'
import TotalValue from './TotalValue.vue'
import NumberField from './NumberField.vue'
import ProficiencyPicker from './ProficiencyPicker.vue'

const sheet = defineModel<Charsheet>({ required: true })

const total = computed(() => armorClassTotal(sheet.value))
const dexBonus = computed(() => cappedDexBonus(sheet.value))

const categoryOptions = ARMOR_CATEGORIES.map((value) => ({
  value,
  label: ARMOR_CATEGORY_LABELS[value]
}))

// Пустое поле означает «ограничения нет», поэтому храним null.
const dexCapInput = computed<string>({
  get: () => (sheet.value.armorClass.dexCap === null ? '' : String(sheet.value.armorClass.dexCap)),
  set: (raw) => {
    const str = String(raw).trim()
    const parsed = Number(str)
    sheet.value.armorClass.dexCap =
      str === '' || !Number.isFinite(parsed) ? null : parsed
  }
})

function isActive(category: ArmorCategory): boolean {
  return sheet.value.armorClass.activeCategory === category
}
</script>

<template>
  <CharsheetSection
    title="Класс защиты"
    icon="i-heroicons-shield-check"
    hint="КЗ считается по владению надетой бронёй"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-4">
        <TotalValue :value="total" label="КЗ" size="lg" />
        <div class="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
          <NumberField v-model="sheet.armorClass.item" label="Бонус предмета" />
          <UFormField
            label="Предел Ловкости"
            size="sm"
            :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
          >
            <UInput
              v-model="dexCapInput"
              type="text"
              inputmode="numeric"
              placeholder="нет"
              aria-label="Предел бонуса Ловкости от брони"
              :ui="{ base: 'text-center tabular-nums' }"
              class="w-full"
            />
          </UFormField>
          <NumberField
            v-model="sheet.armorClass.armorPenalty"
            label="Штраф брони"
            aria-label="Штраф брони к навыкам"
          />
          <div class="flex flex-col justify-end">
            <span class="text-[0.65rem] uppercase tracking-wide text-neutral-500">
              Ловкость в КЗ
            </span>
            <span class="text-sm font-semibold tabular-nums">{{ formatModifier(dexBonus) }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Владение бронёй
        </span>
        <URadioGroup
          v-model="sheet.armorClass.activeCategory"
          :items="categoryOptions"
          value-key="value"
          orientation="horizontal"
          size="sm"
          legend="Надетая броня"
          :ui="{
            fieldset: 'flex flex-wrap gap-x-4 gap-y-2',
            legend: 'text-[0.65rem] uppercase tracking-wide text-neutral-500',
            label: 'cursor-pointer'
          }"
        />
        <ul class="flex flex-col gap-2">
          <li
            v-for="category in ARMOR_CATEGORIES"
            :key="category"
            class="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
            :class="
              isActive(category)
                ? 'border-primary-400 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/40'
                : 'border-neutral-200 dark:border-neutral-800'
            "
          >
            <span class="text-sm">{{ ARMOR_CATEGORY_LABELS[category] }}</span>
            <ProficiencyPicker
              v-model="sheet.armorClass.proficiencies[category]"
              :label="`Владение: ${ARMOR_CATEGORY_LABELS[category]}`"
            />
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-2 border-t border-neutral-200 dark:border-neutral-800 pt-3">
        <span class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Щит</span>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <NumberField v-model="sheet.armorClass.shieldBonus" label="Бонус" />
          <NumberField v-model="sheet.armorClass.shieldHardness" label="Прочность" />
          <NumberField v-model="sheet.armorClass.shieldMaxHp" label="Макс. ОЗ" />
          <NumberField v-model="sheet.armorClass.shieldBreakThreshold" label="Порог поломки" />
          <NumberField v-model="sheet.armorClass.shieldCurrentHp" label="Текущие ОЗ" />
        </div>
      </div>
    </div>
  </CharsheetSection>
</template>
