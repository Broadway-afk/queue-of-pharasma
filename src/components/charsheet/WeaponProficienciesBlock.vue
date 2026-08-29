<script setup lang="ts">
import type { WeaponProficiency } from '@/types/charsheet'
import CharsheetSection from './CharsheetSection.vue'
import ProficiencyPicker from './ProficiencyPicker.vue'

const proficiencies = defineModel<WeaponProficiency[]>({ required: true })

const emit = defineEmits<{
  add: []
  remove: [id: string]
}>()
</script>

<template>
  <CharsheetSection title="Владение оружием" icon="i-heroicons-wrench-screwdriver">
    <template #actions>
      <UButton
        icon="i-heroicons-plus"
        size="xs"
        color="neutral"
        variant="subtle"
        @click="emit('add')"
      >
        Категория
      </UButton>
    </template>

    <ul class="flex flex-col gap-2">
      <li
        v-for="(entry, index) in proficiencies"
        :key="entry.id"
        class="flex flex-wrap items-center gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-2"
      >
        <span v-if="entry.fixed" class="flex-1 min-w-32 text-sm font-medium">
          {{ entry.name }}
        </span>
        <UInput
          v-else
          v-model="proficiencies[index]!.name"
          size="sm"
          placeholder="Своя категория"
          :aria-label="`Категория оружия ${index + 1}: название`"
          class="flex-1 min-w-32"
        />

        <ProficiencyPicker
          v-model="proficiencies[index]!.rank"
          :label="`Владение оружием: ${entry.name || 'своя категория'}`"
        />

        <UButton
          v-if="!entry.fixed"
          icon="i-heroicons-trash"
          size="xs"
          color="error"
          variant="ghost"
          :aria-label="`Удалить категорию ${index + 1}`"
          @click="emit('remove', entry.id)"
        />
      </li>
    </ul>
  </CharsheetSection>
</template>
