<script setup lang="ts">
import { computed } from 'vue'
import type { Charsheet, Strike } from '@/types/charsheet'
import {
  ABILITY_KEYS,
  ABILITY_LABELS,
  DAMAGE_TYPES,
  DAMAGE_TYPE_LABELS
} from '@/data/charsheetMeta'
import { strikeAttackTotal } from '@/utils/pf2e'
import TotalValue from './TotalValue.vue'
import ProficiencyPicker from './ProficiencyPicker.vue'

const strike = defineModel<Strike>({ required: true })

const props = defineProps<{
  sheet: Charsheet
  index: number
}>()

const emit = defineEmits<{ remove: [] }>()

const attackTotal = computed(() => strikeAttackTotal(props.sheet, strike.value))

const abilityOptions = ABILITY_KEYS.map((value) => ({ value, label: ABILITY_LABELS[value] }))

const damageTypeOptions = DAMAGE_TYPES.map((value) => ({
  value,
  label: DAMAGE_TYPE_LABELS[value]
}))
</script>

<template>
  <li class="flex flex-col gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-3">
    <div class="flex flex-wrap items-end gap-3">
      <TotalValue :value="attackTotal" signed label="Атака" />

      <UFormField
        label="Оружие"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
        class="flex-1 min-w-40"
      >
        <UInput
          v-model="strike.weapon"
          :aria-label="`Атака ${props.index + 1}: оружие`"
          class="w-full"
        />
      </UFormField>

      <UButton
        icon="i-heroicons-trash"
        size="xs"
        color="error"
        variant="ghost"
        :aria-label="`Удалить атаку ${props.index + 1}`"
        @click="emit('remove')"
      />
    </div>

    <div class="flex flex-wrap items-end gap-3">
      <UFormField
        label="Характеристика атаки"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
        class="min-w-36"
      >
        <USelect
          v-model="strike.attackAbility"
          :items="abilityOptions"
          value-key="value"
          class="w-full"
        />
      </UFormField>

      <div class="flex flex-col gap-1">
        <span class="text-[0.65rem] uppercase tracking-wide text-neutral-500">Владение</span>
        <ProficiencyPicker
          v-model="strike.rank"
          :label="`Владение оружием: атака ${props.index + 1}`"
        />
      </div>

      <UFormField
        label="Предмет"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
        class="w-20"
      >
        <UInput
          v-model.number="strike.item"
          type="number"
          :aria-label="`Атака ${props.index + 1}: бонус предмета`"
          :ui="{ base: 'text-center tabular-nums' }"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <UFormField
        label="Кубик урона"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
      >
        <UInput
          v-model="strike.damageDice"
          placeholder="1d8"
          :aria-label="`Атака ${props.index + 1}: кубик урона`"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Бонус характеристики"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
      >
        <UInput
          v-model.number="strike.damageAbilityBonus"
          type="number"
          :aria-label="`Атака ${props.index + 1}: бонус урона от характеристики`"
          :ui="{ base: 'text-center tabular-nums' }"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Специализация"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
      >
        <UInput
          v-model="strike.weaponSpecialization"
          :aria-label="`Атака ${props.index + 1}: специализация оружия`"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Прочий урон"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
      >
        <UInput
          v-model="strike.otherDamage"
          :aria-label="`Атака ${props.index + 1}: прочий урон`"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="flex flex-wrap items-start gap-x-6 gap-y-3">
      <!-- Типов урона может быть несколько: versatile-оружие. -->
      <UCheckboxGroup
        v-model="strike.damageTypes"
        :items="damageTypeOptions"
        value-key="value"
        orientation="horizontal"
        size="md"
        :legend="`Тип урона (атака ${props.index + 1})`"
        :ui="{
          fieldset: 'flex flex-wrap gap-x-4 gap-y-1',
          legend: 'text-[0.65rem] uppercase tracking-wide text-neutral-500',
          item: 'items-center'
        }"
      />

      <UFormField
        label="Черты"
        size="sm"
        :ui="{ label: 'text-[0.65rem] uppercase tracking-wide text-neutral-500' }"
        class="flex-1 min-w-40"
      >
        <UInput
          v-model="strike.traits"
          :aria-label="`Атака ${props.index + 1}: черты`"
          class="w-full"
        />
      </UFormField>
    </div>
  </li>
</template>
