// Модель данных чарника Pathfinder 2e.
// Хранится целиком одним JSON-объектом в сторе, чтобы легко сохранять/импортировать/экспортировать.

/** Ранг владения (proficiency). TEML на бумажном чарнике. */
export type ProficiencyRank = 'untrained' | 'trained' | 'expert' | 'master' | 'legendary'

/** Ключ характеристики. */
export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

/** Категория брони: определяет, какой ранг владения идёт в итоговый КЗ. */
export type ArmorCategory = 'unarmored' | 'light' | 'medium' | 'heavy'

/** Тип физического урона. Оружие может иметь несколько (versatile). */
export type DamageType = 'bludgeoning' | 'piercing' | 'slashing'

/** Характеристики: очко характеристики, модификатор вычисляется. */
export type AbilityScores = Record<AbilityKey, number>

/** Общая часть любого числового блока со рангом владения и бонусом предмета. */
export interface ProficiencyBlock {
  rank: ProficiencyRank
  item: number
}

export interface ArmorClass {
  /** Какая броня надета сейчас — её ранг идёт в итоговый КЗ. */
  activeCategory: ArmorCategory
  /** Ранги владения по всем категориям брони. */
  proficiencies: Record<ArmorCategory, ProficiencyRank>
  item: number
  /** Ограничение бонуса Ловкости от брони. null — без ограничения. */
  dexCap: number | null
  /** Штраф брони, вычитается из Акробатики, Атлетики, Скрытности и Воровства. */
  armorPenalty: number
  shieldBonus: number
  shieldHardness: number
  shieldMaxHp: number
  shieldBreakThreshold: number
  shieldCurrentHp: number
}

export interface HitPoints {
  max: number
  current: number
  temporary: number
  dying: number
  dyingMax: number
  wounded: number
  resistancesAndImmunities: string
  conditions: string
}

export type SavingThrowKey = 'fortitude' | 'reflex' | 'will'

export type SavingThrows = Record<SavingThrowKey, ProficiencyBlock>

export interface Perception extends ProficiencyBlock {
  senses: string
}

export interface ClassDc extends ProficiencyBlock {
  /** Ключевая характеристика класса. */
  keyAbility: AbilityKey
}

export interface Speed {
  value: number
  /** Прочие виды перемещения и заметки. */
  notes: string
}

/** Определение навыка: фиксированные навыки берутся из справочника, Lore добавляются пользователем. */
export interface SkillEntry extends ProficiencyBlock {
  /** id навыка: 'acrobatics' и т.п., для Lore — сгенерированный uuid. */
  id: string
  /** Заполняется только для Lore: тема познаний. */
  name?: string
}

export interface Skills {
  /** Фиксированные навыки, ключ — id из SKILL_DEFINITIONS. */
  standard: Record<string, ProficiencyBlock>
  /** Познания (Lore) — произвольное количество. */
  lore: SkillEntry[]
}

export interface Strike {
  id: string
  /** Название оружия. */
  weapon: string
  /** Характеристика для броска атаки: обычно Сила для ближнего, Ловкость для дальнего. */
  attackAbility: AbilityKey
  rank: ProficiencyRank
  item: number
  /** Кубик урона, свободный ввод: «1d8», «2d6». */
  damageDice: string
  /** Числовой бонус урона от характеристики. */
  damageAbilityBonus: number
  damageTypes: DamageType[]
  /** Дополнительный урон от рун и особенностей. */
  weaponSpecialization: string
  otherDamage: string
  traits: string
}

export interface WeaponProficiency {
  id: string
  /** Название категории. Для simple/martial редактированию не подлежит. */
  name: string
  rank: ProficiencyRank
  /** Встроенная строка (Простое / Воинское) — название нельзя менять и нельзя удалить. */
  fixed: boolean
}

export interface GeneralInfo {
  characterName: string
  playerName: string
  ancestryAndHeritage: string
  background: string
  className: string
  level: number
  heroPoints: number
  experiencePoints: number
  size: string
  alignment: string
  traits: string
  deity: string
}

export interface Charsheet {
  /** Версия схемы: нужна для миграций при импорте старого JSON. */
  schemaVersion: number
  general: GeneralInfo
  abilities: AbilityScores
  armorClass: ArmorClass
  hitPoints: HitPoints
  savingThrows: SavingThrows
  perception: Perception
  classDc: ClassDc
  speed: Speed
  skills: Skills
  meleeStrikes: Strike[]
  rangedStrikes: Strike[]
  weaponProficiencies: WeaponProficiency[]
  languages: string
}
