import type { AbilityKey, Charsheet, ProficiencyRank, Strike } from '@/types/charsheet'
import { LORE_ABILITY, SAVING_THROW_ABILITIES, SKILL_DEFINITIONS } from '@/data/charsheetMeta'
import type { SavingThrowKey } from '@/types/charsheet'

/** Базовое значение любого DC в PF2e. */
export const DC_BASE = 10

/** Модификатор характеристики: (значение - 10), округление вниз до пары. */
export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

/** Бонус владения: неопытный даёт 0, остальные — уровень + константа ранга. */
export function proficiencyBonus(rank: ProficiencyRank, level: number): number {
  switch (rank) {
    case 'trained':
      return 2 + level
    case 'expert':
      return 4 + level
    case 'master':
      return 6 + level
    case 'legendary':
      return 8 + level
    default:
      return 0
  }
}

/** Форматирует модификатор со знаком: +3 / -1 / +0. */
export function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : String(value)
}

export function abilityModifiers(sheet: Charsheet): Record<AbilityKey, number> {
  return {
    str: abilityModifier(sheet.abilities.str),
    dex: abilityModifier(sheet.abilities.dex),
    con: abilityModifier(sheet.abilities.con),
    int: abilityModifier(sheet.abilities.int),
    wis: abilityModifier(sheet.abilities.wis),
    cha: abilityModifier(sheet.abilities.cha)
  }
}

/** Бонус Ловкости к КЗ с учётом ограничения брони. */
export function cappedDexBonus(sheet: Charsheet): number {
  const dex = abilityModifier(sheet.abilities.dex)
  const cap = sheet.armorClass.dexCap
  if (cap === null) return dex
  return Math.min(dex, cap)
}

/** КЗ = 10 + огранич. Ловкость + владение активной броней + бонус предмета. */
export function armorClassTotal(sheet: Charsheet): number {
  const rank = sheet.armorClass.proficiencies[sheet.armorClass.activeCategory]
  return (
    DC_BASE +
    cappedDexBonus(sheet) +
    proficiencyBonus(rank, sheet.general.level) +
    sheet.armorClass.item
  )
}

export function savingThrowTotal(sheet: Charsheet, key: SavingThrowKey): number {
  const block = sheet.savingThrows[key]
  const ability = SAVING_THROW_ABILITIES[key]
  return (
    abilityModifier(sheet.abilities[ability]) +
    proficiencyBonus(block.rank, sheet.general.level) +
    block.item
  )
}

export function perceptionTotal(sheet: Charsheet): number {
  return (
    abilityModifier(sheet.abilities.wis) +
    proficiencyBonus(sheet.perception.rank, sheet.general.level) +
    sheet.perception.item
  )
}

/** DC класса = 10 + ключевая характеристика + владение + бонус предмета. */
export function classDcTotal(sheet: Charsheet): number {
  return (
    DC_BASE +
    abilityModifier(sheet.abilities[sheet.classDc.keyAbility]) +
    proficiencyBonus(sheet.classDc.rank, sheet.general.level) +
    sheet.classDc.item
  )
}

/** Итог фиксированного навыка. Штраф брони применяется только к нужным навыкам. */
export function standardSkillTotal(sheet: Charsheet, skillId: string): number {
  const definition = SKILL_DEFINITIONS.find((skill) => skill.id === skillId)
  if (!definition) return 0

  const block = sheet.skills.standard[skillId]
  if (!block) return 0

  const penalty = definition.armorPenalty ? sheet.armorClass.armorPenalty : 0

  return (
    abilityModifier(sheet.abilities[definition.ability]) +
    proficiencyBonus(block.rank, sheet.general.level) +
    block.item -
    penalty
  )
}

/** Итог познания (Lore): всегда Интеллект, без штрафа брони. */
export function loreSkillTotal(sheet: Charsheet, loreId: string): number {
  const entry = sheet.skills.lore.find((lore) => lore.id === loreId)
  if (!entry) return 0

  return (
    abilityModifier(sheet.abilities[LORE_ABILITY]) +
    proficiencyBonus(entry.rank, sheet.general.level) +
    entry.item
  )
}

/** Бонус атаки = модификатор характеристики + владение + бонус предмета. */
export function strikeAttackTotal(sheet: Charsheet, strike: Strike): number {
  return (
    abilityModifier(sheet.abilities[strike.attackAbility]) +
    proficiencyBonus(strike.rank, sheet.general.level) +
    strike.item
  )
}
