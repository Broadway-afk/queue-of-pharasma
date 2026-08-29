import type {
  AbilityKey,
  ArmorCategory,
  DamageType,
  ProficiencyRank,
  SavingThrowKey
} from '@/types/charsheet'

/** Порядок рангов владения для TEML-переключателя. */
export const PROFICIENCY_RANKS: ProficiencyRank[] = [
  'untrained',
  'trained',
  'expert',
  'master',
  'legendary'
]

/** Ранги, отображаемые клетками TEML (untrained — это «ничего не отмечено»). */
export const TEML_RANKS: Exclude<ProficiencyRank, 'untrained'>[] = [
  'trained',
  'expert',
  'master',
  'legendary'
]

export const PROFICIENCY_LETTERS: Record<Exclude<ProficiencyRank, 'untrained'>, string> = {
  trained: 'T',
  expert: 'E',
  master: 'M',
  legendary: 'L'
}

export const PROFICIENCY_LABELS: Record<ProficiencyRank, string> = {
  untrained: 'Неопытный',
  trained: 'Обученный',
  expert: 'Эксперт',
  master: 'Мастер',
  legendary: 'Легенда'
}

export const ABILITY_KEYS: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: 'Сила',
  dex: 'Ловкость',
  con: 'Телосложение',
  int: 'Интеллект',
  wis: 'Мудрость',
  cha: 'Харизма'
}

export const ABILITY_SHORT_LABELS: Record<AbilityKey, string> = {
  str: 'СИЛ',
  dex: 'ЛОВ',
  con: 'ТЕЛ',
  int: 'ИНТ',
  wis: 'МДР',
  cha: 'ХАР'
}

export const SAVING_THROW_KEYS: SavingThrowKey[] = ['fortitude', 'reflex', 'will']

export const SAVING_THROW_LABELS: Record<SavingThrowKey, string> = {
  fortitude: 'Стойкость',
  reflex: 'Реакция',
  will: 'Воля'
}

export const SAVING_THROW_ABILITIES: Record<SavingThrowKey, AbilityKey> = {
  fortitude: 'con',
  reflex: 'dex',
  will: 'wis'
}

export const ARMOR_CATEGORIES: ArmorCategory[] = ['unarmored', 'light', 'medium', 'heavy']

export const ARMOR_CATEGORY_LABELS: Record<ArmorCategory, string> = {
  unarmored: 'Без брони',
  light: 'Лёгкая',
  medium: 'Средняя',
  heavy: 'Тяжёлая'
}

export const DAMAGE_TYPES: DamageType[] = ['bludgeoning', 'piercing', 'slashing']

export const DAMAGE_TYPE_LETTERS: Record<DamageType, string> = {
  bludgeoning: 'Д',
  piercing: 'К',
  slashing: 'Р'
}

export const DAMAGE_TYPE_LABELS: Record<DamageType, string> = {
  bludgeoning: 'Дробящий',
  piercing: 'Колющий',
  slashing: 'Режущий'
}

export interface SkillDefinition {
  id: string
  label: string
  ability: AbilityKey
  /** Навык получает штраф брони. */
  armorPenalty: boolean
}

/** Фиксированные навыки в порядке бумажного чарника. Lore задаётся пользователем отдельно. */
export const SKILL_DEFINITIONS: SkillDefinition[] = [
  { id: 'acrobatics', label: 'Акробатика', ability: 'dex', armorPenalty: true },
  { id: 'arcana', label: 'Магия', ability: 'int', armorPenalty: false },
  { id: 'athletics', label: 'Атлетика', ability: 'str', armorPenalty: true },
  { id: 'crafting', label: 'Ремесло', ability: 'int', armorPenalty: false },
  { id: 'deception', label: 'Обман', ability: 'cha', armorPenalty: false },
  { id: 'diplomacy', label: 'Дипломатия', ability: 'cha', armorPenalty: false },
  { id: 'intimidation', label: 'Запугивание', ability: 'cha', armorPenalty: false },
  { id: 'medicine', label: 'Медицина', ability: 'wis', armorPenalty: false },
  { id: 'nature', label: 'Природа', ability: 'wis', armorPenalty: false },
  { id: 'occultism', label: 'Оккультизм', ability: 'int', armorPenalty: false },
  { id: 'performance', label: 'Выступление', ability: 'cha', armorPenalty: false },
  { id: 'religion', label: 'Религия', ability: 'wis', armorPenalty: false },
  { id: 'society', label: 'Общество', ability: 'int', armorPenalty: false },
  { id: 'stealth', label: 'Скрытность', ability: 'dex', armorPenalty: true },
  { id: 'survival', label: 'Выживание', ability: 'wis', armorPenalty: false },
  { id: 'thievery', label: 'Воровство', ability: 'dex', armorPenalty: true }
]

/** Познания (Lore) всегда основаны на Интеллекте и не получают штраф брони. */
export const LORE_ABILITY: AbilityKey = 'int'
