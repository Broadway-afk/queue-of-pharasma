import type {
  AbilityKey,
  ArmorCategory,
  Charsheet,
  DamageType,
  ProficiencyRank,
  SkillEntry,
  Strike,
  WeaponProficiency
} from '@/types/charsheet'
import {
  ABILITY_KEYS,
  ARMOR_CATEGORIES,
  DAMAGE_TYPES,
  PROFICIENCY_RANKS,
  SKILL_DEFINITIONS
} from '@/data/charsheetMeta'
import {
  CHARSHEET_SCHEMA_VERSION,
  createEmptyCharsheet,
  createLoreEntry,
  createStrike
} from '@/utils/charsheetDefaults'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function pick(source: unknown, key: string): unknown {
  return isRecord(source) ? source[key] : undefined
}

function toString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function toNullableNumber(value: unknown, fallback: number | null): number | null {
  if (value === null) return null
  if (value === undefined || value === '') return fallback
  const parsed = toNumber(value, Number.NaN)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback
}

function toRank(value: unknown, fallback: ProficiencyRank = 'untrained'): ProficiencyRank {
  return toEnum(value, PROFICIENCY_RANKS, fallback)
}

function toAbility(value: unknown, fallback: AbilityKey): AbilityKey {
  return toEnum(value, ABILITY_KEYS, fallback)
}

function toArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function normalizeProficiencyBlock(raw: unknown): { rank: ProficiencyRank; item: number } {
  return {
    rank: toRank(pick(raw, 'rank')),
    item: toNumber(pick(raw, 'item'), 0)
  }
}

function normalizeStrike(raw: unknown, defaultAbility: AbilityKey): Strike {
  const fallback = createStrike(defaultAbility)
  const damageTypes = toArray(pick(raw, 'damageTypes'))
    .filter((type): type is DamageType => (DAMAGE_TYPES as string[]).includes(type as string))

  return {
    id: toString(pick(raw, 'id'), fallback.id),
    weapon: toString(pick(raw, 'weapon'), ''),
    attackAbility: toAbility(pick(raw, 'attackAbility'), defaultAbility),
    rank: toRank(pick(raw, 'rank')),
    item: toNumber(pick(raw, 'item'), 0),
    damageDice: toString(pick(raw, 'damageDice'), ''),
    damageAbilityBonus: toNumber(pick(raw, 'damageAbilityBonus'), 0),
    damageTypes: [...new Set(damageTypes)],
    weaponSpecialization: toString(pick(raw, 'weaponSpecialization'), ''),
    otherDamage: toString(pick(raw, 'otherDamage'), ''),
    traits: toString(pick(raw, 'traits'), '')
  }
}

function normalizeLore(raw: unknown): SkillEntry {
  const fallback = createLoreEntry()
  return {
    id: toString(pick(raw, 'id'), fallback.id),
    name: toString(pick(raw, 'name'), ''),
    rank: toRank(pick(raw, 'rank')),
    item: toNumber(pick(raw, 'item'), 0)
  }
}

/** Встроенные категории оружия сохраняются всегда, пользовательские — дописываются после них. */
function normalizeWeaponProficiencies(raw: unknown, defaults: WeaponProficiency[]): WeaponProficiency[] {
  const entries = toArray(raw)

  const fixed = defaults.map((base) => {
    const match = entries.find((entry) => pick(entry, 'id') === base.id)
    return { ...base, rank: toRank(pick(match, 'rank')) }
  })

  const custom = entries
    .filter((entry) => {
      const id = pick(entry, 'id')
      return !defaults.some((base) => base.id === id)
    })
    .map<WeaponProficiency>((entry, index) => ({
      id: toString(pick(entry, 'id'), `weapon-prof-${index}`),
      name: toString(pick(entry, 'name'), ''),
      rank: toRank(pick(entry, 'rank')),
      fixed: false
    }))

  return [...fixed, ...custom]
}

/**
 * Приводит произвольный JSON к валидному чарнику: неизвестные поля отбрасываются,
 * отсутствующие берутся из пустого чарника. Никогда не бросает исключений.
 */
export function normalizeCharsheet(raw: unknown): Charsheet {
  const defaults = createEmptyCharsheet()
  if (!isRecord(raw)) return defaults

  const general = pick(raw, 'general')
  const abilities = pick(raw, 'abilities')
  const armorClass = pick(raw, 'armorClass')
  const hitPoints = pick(raw, 'hitPoints')
  const savingThrows = pick(raw, 'savingThrows')
  const perception = pick(raw, 'perception')
  const classDc = pick(raw, 'classDc')
  const speed = pick(raw, 'speed')
  const skills = pick(raw, 'skills')

  const armorProficiencies = pick(armorClass, 'proficiencies')
  const standardRaw = pick(skills, 'standard')

  const standard: Charsheet['skills']['standard'] = {}
  for (const skill of SKILL_DEFINITIONS) {
    standard[skill.id] = normalizeProficiencyBlock(pick(standardRaw, skill.id))
  }

  const proficiencies = {} as Record<ArmorCategory, ProficiencyRank>
  for (const category of ARMOR_CATEGORIES) {
    proficiencies[category] = toRank(pick(armorProficiencies, category))
  }

  const lore = toArray(pick(skills, 'lore')).map(normalizeLore)
  const meleeStrikes = toArray(pick(raw, 'meleeStrikes')).map((entry) => normalizeStrike(entry, 'str'))
  const rangedStrikes = toArray(pick(raw, 'rangedStrikes')).map((entry) => normalizeStrike(entry, 'dex'))

  return {
    schemaVersion: CHARSHEET_SCHEMA_VERSION,
    general: {
      characterName: toString(pick(general, 'characterName'), ''),
      playerName: toString(pick(general, 'playerName'), ''),
      ancestryAndHeritage: toString(pick(general, 'ancestryAndHeritage'), ''),
      background: toString(pick(general, 'background'), ''),
      className: toString(pick(general, 'className'), ''),
      level: toNumber(pick(general, 'level'), defaults.general.level),
      heroPoints: toNumber(pick(general, 'heroPoints'), defaults.general.heroPoints),
      experiencePoints: toNumber(pick(general, 'experiencePoints'), 0),
      size: toString(pick(general, 'size'), ''),
      alignment: toString(pick(general, 'alignment'), ''),
      traits: toString(pick(general, 'traits'), ''),
      deity: toString(pick(general, 'deity'), '')
    },
    abilities: {
      str: toNumber(pick(abilities, 'str'), 10),
      dex: toNumber(pick(abilities, 'dex'), 10),
      con: toNumber(pick(abilities, 'con'), 10),
      int: toNumber(pick(abilities, 'int'), 10),
      wis: toNumber(pick(abilities, 'wis'), 10),
      cha: toNumber(pick(abilities, 'cha'), 10)
    },
    armorClass: {
      activeCategory: toEnum(pick(armorClass, 'activeCategory'), ARMOR_CATEGORIES, 'unarmored'),
      proficiencies,
      item: toNumber(pick(armorClass, 'item'), 0),
      dexCap: toNullableNumber(pick(armorClass, 'dexCap'), null),
      armorPenalty: toNumber(pick(armorClass, 'armorPenalty'), 0),
      shieldBonus: toNumber(pick(armorClass, 'shieldBonus'), 0),
      shieldHardness: toNumber(pick(armorClass, 'shieldHardness'), 0),
      shieldMaxHp: toNumber(pick(armorClass, 'shieldMaxHp'), 0),
      shieldBreakThreshold: toNumber(pick(armorClass, 'shieldBreakThreshold'), 0),
      shieldCurrentHp: toNumber(pick(armorClass, 'shieldCurrentHp'), 0)
    },
    hitPoints: {
      max: toNumber(pick(hitPoints, 'max'), 0),
      current: toNumber(pick(hitPoints, 'current'), 0),
      temporary: toNumber(pick(hitPoints, 'temporary'), 0),
      dying: toNumber(pick(hitPoints, 'dying'), 0),
      dyingMax: toNumber(pick(hitPoints, 'dyingMax'), defaults.hitPoints.dyingMax),
      wounded: toNumber(pick(hitPoints, 'wounded'), 0),
      resistancesAndImmunities: toString(pick(hitPoints, 'resistancesAndImmunities'), ''),
      conditions: toString(pick(hitPoints, 'conditions'), '')
    },
    savingThrows: {
      fortitude: normalizeProficiencyBlock(pick(savingThrows, 'fortitude')),
      reflex: normalizeProficiencyBlock(pick(savingThrows, 'reflex')),
      will: normalizeProficiencyBlock(pick(savingThrows, 'will'))
    },
    perception: {
      ...normalizeProficiencyBlock(perception),
      senses: toString(pick(perception, 'senses'), '')
    },
    classDc: {
      ...normalizeProficiencyBlock(classDc),
      keyAbility: toAbility(pick(classDc, 'keyAbility'), 'str')
    },
    speed: {
      value: toNumber(pick(speed, 'value'), defaults.speed.value),
      notes: toString(pick(speed, 'notes'), '')
    },
    skills: {
      standard,
      lore: lore.length > 0 ? lore : defaults.skills.lore
    },
    meleeStrikes: meleeStrikes.length > 0 ? meleeStrikes : defaults.meleeStrikes,
    rangedStrikes: rangedStrikes.length > 0 ? rangedStrikes : defaults.rangedStrikes,
    weaponProficiencies: normalizeWeaponProficiencies(
      pick(raw, 'weaponProficiencies'),
      defaults.weaponProficiencies.filter((entry) => entry.fixed)
    ),
    languages: toString(pick(raw, 'languages'), '')
  }
}

/** Разбирает текст JSON. Бросает Error с понятным сообщением при некорректном вводе. */
export function parseCharsheetJson(text: string): Charsheet {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Файл не является корректным JSON')
  }

  if (!isRecord(parsed)) {
    throw new Error('Ожидался JSON-объект с данными чарника')
  }

  return normalizeCharsheet(parsed)
}

export function charsheetToJson(sheet: Charsheet): string {
  return JSON.stringify(sheet, null, 2)
}

/** Имя файла для экспорта: имя персонажа в транслитерации отсутствует, поэтому чистим только опасные символы. */
export function charsheetFileName(sheet: Charsheet): string {
  const name = sheet.general.characterName.trim().replace(/[^\p{L}\p{N}\-_ ]/gu, '')
  const base = name === '' ? 'charsheet' : name.replace(/\s+/g, '-')
  return `${base}.json`
}
