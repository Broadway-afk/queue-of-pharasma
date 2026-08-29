import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Charsheet, SkillEntry, Strike, WeaponProficiency } from '@/types/charsheet'
import {
  createEmptyCharsheet,
  createLoreEntry,
  createStrike,
  createWeaponProficiency
} from '@/utils/charsheetDefaults'
import {
  charsheetFileName,
  charsheetToJson,
  normalizeCharsheet,
  parseCharsheetJson
} from '@/utils/charsheetIo'

const STORAGE_KEY = 'charsheet-pf2e'

export const useCharsheetStore = defineStore('charsheet', () => {
  const sheet = ref<Charsheet>(createEmptyCharsheet())

  // Восстановление из localStorage: любые повреждённые данные приводятся к валидной форме.
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        sheet.value = normalizeCharsheet(JSON.parse(saved))
      } catch (e) {
        console.error('Не удалось прочитать сохранённый чарник', e)
      }
    }
  }

  // Автосохранение: отдельной кнопки «Сохранить» на странице нет.
  watch(
    sheet,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true }
  )

  function reset() {
    sheet.value = createEmptyCharsheet()
  }

  function addLore() {
    sheet.value.skills.lore.push(createLoreEntry())
  }

  function removeLore(id: string) {
    sheet.value.skills.lore = sheet.value.skills.lore.filter((lore: SkillEntry) => lore.id !== id)
  }

  function addMeleeStrike() {
    sheet.value.meleeStrikes.push(createStrike('str'))
  }

  function removeMeleeStrike(id: string) {
    sheet.value.meleeStrikes = sheet.value.meleeStrikes.filter((strike: Strike) => strike.id !== id)
  }

  function addRangedStrike() {
    sheet.value.rangedStrikes.push(createStrike('dex'))
  }

  function removeRangedStrike(id: string) {
    sheet.value.rangedStrikes = sheet.value.rangedStrikes.filter((strike: Strike) => strike.id !== id)
  }

  function addWeaponProficiency() {
    sheet.value.weaponProficiencies.push(createWeaponProficiency())
  }

  function removeWeaponProficiency(id: string) {
    sheet.value.weaponProficiencies = sheet.value.weaponProficiencies.filter(
      (entry: WeaponProficiency) => entry.id !== id || entry.fixed
    )
  }

  function exportToFile() {
    const blob = new Blob([charsheetToJson(sheet.value)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = charsheetFileName(sheet.value)
    link.click()
    URL.revokeObjectURL(url)
  }

  /** Читает файл и заменяет чарник. Бросает Error при некорректном JSON. */
  async function importFromFile(file: File) {
    const text = await file.text()
    sheet.value = parseCharsheetJson(text)
  }

  return {
    sheet,
    reset,
    addLore,
    removeLore,
    addMeleeStrike,
    removeMeleeStrike,
    addRangedStrike,
    removeRangedStrike,
    addWeaponProficiency,
    removeWeaponProficiency,
    exportToFile,
    importFromFile
  }
})
