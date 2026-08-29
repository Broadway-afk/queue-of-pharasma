<script setup lang="ts">
import { computed } from 'vue'
import type { Charsheet } from '@/types/charsheet'
import { ABILITY_SHORT_LABELS, LORE_ABILITY, SKILL_DEFINITIONS } from '@/data/charsheetMeta'
import { loreSkillTotal, standardSkillTotal } from '@/utils/pf2e'
import CharsheetSection from './CharsheetSection.vue'
import TotalValue from './TotalValue.vue'
import ProficiencyPicker from './ProficiencyPicker.vue'

const sheet = defineModel<Charsheet>({ required: true })

const emit = defineEmits<{
  addLore: []
  removeLore: [id: string]
}>()

const standardSkills = computed(() =>
  SKILL_DEFINITIONS.map((definition) => ({
    ...definition,
    abilityShort: ABILITY_SHORT_LABELS[definition.ability],
    total: standardSkillTotal(sheet.value, definition.id)
  }))
)

const loreSkills = computed(() =>
  sheet.value.skills.lore.map((lore) => ({
    id: lore.id,
    total: loreSkillTotal(sheet.value, lore.id)
  }))
)

const loreAbilityShort = ABILITY_SHORT_LABELS[LORE_ABILITY]
</script>

<template>
  <CharsheetSection
    title="Навыки"
    icon="i-heroicons-list-bullet"
    hint="Штраф брони применяется к отмеченным навыкам автоматически"
  >
    <template #actions>
      <UButton
        icon="i-heroicons-plus"
        size="xs"
        color="neutral"
        variant="subtle"
        @click="emit('addLore')"
      >
        Познание
      </UButton>
    </template>

    <ul class="skill-list">
      <li
        v-for="skill in standardSkills"
        :key="skill.id"
        class="skill-row rounded-lg border border-neutral-200 dark:border-neutral-800 p-2"
      >
        <div class="skill-row__total">
          <TotalValue :value="skill.total" signed size="sm" />
        </div>

        <div class="skill-row__name">
          <p class="text-sm font-medium">{{ skill.label }}</p>
          <p class="text-[0.65rem] uppercase tracking-wide text-neutral-500">
            {{ skill.abilityShort }}
            <template v-if="skill.armorPenalty"> · штраф брони</template>
          </p>
        </div>

        <div class="skill-row__controls">
          <ProficiencyPicker
            v-model="sheet.skills.standard[skill.id]!.rank"
            :label="`Владение: ${skill.label}`"
          />
          <UInput
            v-model.number="sheet.skills.standard[skill.id]!.item"
            type="number"
            size="sm"
            :aria-label="`${skill.label}: бонус предмета`"
            :ui="{ base: 'text-center tabular-nums' }"
            class="skill-row__item"
          />
          <span class="skill-row__spacer" />
        </div>
      </li>

      <li
        v-for="(lore, index) in loreSkills"
        :key="lore.id"
        class="skill-row rounded-lg border border-neutral-200 dark:border-neutral-800 p-2"
      >
        <div class="skill-row__total">
          <TotalValue :value="lore.total" signed size="sm" />
        </div>

        <div class="skill-row__name">
          <UInput
            v-model="sheet.skills.lore[index]!.name"
            size="sm"
            placeholder="Тема познания"
            :aria-label="`Познание ${index + 1}: тема`"
            class="w-full"
          />
          <p class="text-[0.65rem] uppercase tracking-wide text-neutral-500 mt-0.5">
            Познание · {{ loreAbilityShort }}
          </p>
        </div>

        <div class="skill-row__controls">
          <ProficiencyPicker
            v-model="sheet.skills.lore[index]!.rank"
            :label="`Владение: познание ${index + 1}`"
          />
          <UInput
            v-model.number="sheet.skills.lore[index]!.item"
            type="number"
            size="sm"
            :aria-label="`Познание ${index + 1}: бонус предмета`"
            :ui="{ base: 'text-center tabular-nums' }"
            class="skill-row__item"
          />
          <UButton
            icon="i-heroicons-trash"
            size="xs"
            color="error"
            variant="ghost"
            :aria-label="`Удалить познание ${index + 1}`"
            @click="emit('removeLore', lore.id)"
          />
        </div>
      </li>
    </ul>
  </CharsheetSection>
</template>

<style scoped>
.skill-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Итог и название в первой строке, элементы управления во второй на всю ширину.
   На широком экране всё выстраивается в одну линию. */
.skill-row {
  display: grid;
  grid-template-areas:
    'total name'
    'controls controls';
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  column-gap: 0.75rem;
  row-gap: 0.5rem;
}

.skill-row__total {
  grid-area: total;
}

.skill-row__name {
  grid-area: name;
  min-width: 0;
}

.skill-row__controls {
  grid-area: controls;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.skill-row__item {
  width: 4rem;
  flex: none;
}

/* Держит место кнопки удаления у неудаляемых навыков, чтобы поля были в одной колонке.
   На узкой раскладке в этом нет смысла — там элементы управления и так на своей строке. */
.skill-row__spacer {
  display: none;
  width: 1.75rem;
  flex: none;
}

@media (width >= 40rem) {
  .skill-row {
    grid-template-areas: 'total name controls';
    grid-template-columns: auto minmax(0, 1fr) auto;
    row-gap: 0;
  }

  .skill-row__controls {
    justify-content: flex-end;
    gap: 0.75rem;
  }

  .skill-row__spacer {
    display: block;
  }
}
</style>
