<script setup lang="ts">
import type { Charsheet } from '@/types/charsheet'
import CharsheetSection from './CharsheetSection.vue'
import TextField from './TextField.vue'
import NumberField from './NumberField.vue'

const sheet = defineModel<Charsheet>({ required: true })
</script>

<template>
  <CharsheetSection title="Персонаж" icon="i-heroicons-identification">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      <TextField v-model="sheet.general.characterName" label="Имя персонажа" class="col-span-2" />
      <TextField v-model="sheet.general.playerName" label="Имя игрока" class="col-span-2" />
      <NumberField v-model="sheet.general.level" label="Уровень" :min="1" :max="20" />
      <NumberField v-model="sheet.general.experiencePoints" label="Опыт (XP)" :min="0" />

      <TextField
        v-model="sheet.general.ancestryAndHeritage"
        label="Происхождение и наследие"
        class="col-span-2"
      />
      <TextField v-model="sheet.general.background" label="Предыстория" class="col-span-2" />
      <TextField v-model="sheet.general.className" label="Класс" class="col-span-2" />

      <TextField v-model="sheet.general.size" label="Размер" />
      <TextField v-model="sheet.general.alignment" label="Мировоззрение" />
      <TextField v-model="sheet.general.deity" label="Божество" />
      <NumberField v-model="sheet.general.heroPoints" label="Очки героя" :min="0" />
      <TextField v-model="sheet.general.traits" label="Черты" class="col-span-2" />
    </div>
  </CharsheetSection>
</template>
