<script setup lang="ts">
import { useToast } from '@nuxt/ui/composables/useToast'
import { useCharsheetStore } from '@/stores/charsheet'
import CharsheetToolbar from '@/components/charsheet/CharsheetToolbar.vue'
import CharsheetGeneral from '@/components/charsheet/CharsheetGeneral.vue'
import AbilityScoresBlock from '@/components/charsheet/AbilityScoresBlock.vue'
import ArmorClassBlock from '@/components/charsheet/ArmorClassBlock.vue'
import HitPointsBlock from '@/components/charsheet/HitPointsBlock.vue'
import SavingThrowsBlock from '@/components/charsheet/SavingThrowsBlock.vue'
import PerceptionBlock from '@/components/charsheet/PerceptionBlock.vue'
import ClassDcBlock from '@/components/charsheet/ClassDcBlock.vue'
import SpeedBlock from '@/components/charsheet/SpeedBlock.vue'
import SkillsBlock from '@/components/charsheet/SkillsBlock.vue'
import StrikesBlock from '@/components/charsheet/StrikesBlock.vue'
import WeaponProficienciesBlock from '@/components/charsheet/WeaponProficienciesBlock.vue'
import LanguagesBlock from '@/components/charsheet/LanguagesBlock.vue'

const store = useCharsheetStore()
const toast = useToast()

async function onImport(file: File) {
  try {
    await store.importFromFile(file)
    toast.add({ title: 'Чарник загружен', color: 'success' })
  } catch (e) {
    toast.add({
      title: 'Не удалось загрузить чарник',
      description: e instanceof Error ? e.message : undefined,
      color: 'error'
    })
  }
}

function onExport() {
  store.exportToFile()
}

function onReset() {
  store.reset()
  toast.add({ title: 'Чарник очищен', color: 'neutral' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <CharsheetToolbar @export="onExport" @import="onImport" @reset="onReset" />

    <CharsheetGeneral v-model="store.sheet" />

    <AbilityScoresBlock v-model="store.sheet" />

    <div class="charsheet-grid">
      <div class="flex flex-col gap-6">
        <ArmorClassBlock v-model="store.sheet" />
        <PerceptionBlock v-model="store.sheet" />
      </div>
      <div class="flex flex-col gap-6">
        <HitPointsBlock v-model="store.sheet" />
        <SavingThrowsBlock v-model="store.sheet" />
      </div>
      <div class="flex flex-col gap-6">
        <PerceptionBlock v-model="store.sheet" />
        <ClassDcBlock v-model="store.sheet" />
        <SpeedBlock v-model="store.sheet" />
        <LanguagesBlock v-model="store.sheet.languages" />
      </div>
    </div>
    <div class="charsheet-grid">
      <div class="flex flex-col gap-6">
        <StrikesBlock
            v-model="store.sheet.meleeStrikes"
            title="Ближние атаки"
            icon="i-heroicons-hand-raised"
            add-label="Атака"
            :sheet="store.sheet"
            @add="store.addMeleeStrike"
            @remove="store.removeMeleeStrike"
        />

        <StrikesBlock
            v-model="store.sheet.rangedStrikes"
            title="Дальние атаки"
            icon="i-heroicons-viewfinder-circle"
            add-label="Атака"
            :sheet="store.sheet"
            @add="store.addRangedStrike"
            @remove="store.removeRangedStrike"
        />

        <WeaponProficienciesBlock
            v-model="store.sheet.weaponProficiencies"
            @add="store.addWeaponProficiency"
            @remove="store.removeWeaponProficiency"
        />
      </div>

      <SkillsBlock
          v-model="store.sheet"
          @add-lore="store.addLore"
          @remove-lore="store.removeLore"
      />
    </div>
  </div>
</template>

<style scoped>
/* Блоки выстраиваются в колонки только когда для них хватает ширины,
   поэтому один брейкпоинт вместо набора магических значений. */
.charsheet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr));
  gap: 1.5rem;
  align-items: start;
}
</style>
