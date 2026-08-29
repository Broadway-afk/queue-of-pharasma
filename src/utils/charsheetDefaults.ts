import type {
  ArmorCategory,
  Charsheet,
  ProficiencyRank,
  SkillEntry,
  Strike,
  WeaponProficiency
} from '@/types/charsheet'
import { SKILL_DEFINITIONS } from '@/data/charsheetMeta'

/** Текущая версия схемы чарника. Увеличивать при несовместимых изменениях. */
export const CHARSHEET_SCHEMA_VERSION = 1

function createId(): string {
  return crypto.randomUUID()
}

function createStandardSkills(): Charsheet['skills']['standard'] {
  const standard: Charsheet['skills']['standard'] = {}
  for (const skill of SKILL_DEFINITIONS) {
    standard[skill.id] = { rank: 'untrained', item: 0 }
  }
  return standard
}

function createArmorProficiencies(): Record<ArmorCategory, ProficiencyRank> {
  return {
    unarmored: 'untrained',
    light: 'untrained',
    medium: 'untrained',
    heavy: 'untrained'
  }
}

export function createStrike(attackAbility: Strike['attackAbility']): Strike {
  return {
    id: createId(),
    weapon: '',
    attackAbility,
    rank: 'untrained',
    item: 0,
    damageDice: '',
    damageAbilityBonus: 0,
    damageTypes: [],
    weaponSpecialization: '',
    otherDamage: '',
    traits: ''
  }
}

export function createLoreEntry(): SkillEntry {
  return {
    id: createId(),
    name: '',
    rank: 'untrained',
    item: 0
  }
}

export function createWeaponProficiency(name = ''): WeaponProficiency {
  return {
    id: createId(),
    name,
    rank: 'untrained',
    fixed: false
  }
}

/** Две встроенные категории оружия из бумажного чарника. */
function createFixedWeaponProficiencies(): WeaponProficiency[] {
  return [
    { id: 'simple', name: 'Простое', rank: 'untrained', fixed: true },
    { id: 'martial', name: 'Воинское', rank: 'untrained', fixed: true }
  ]
}

export function createEmptyCharsheet(): Charsheet {
  return {
    schemaVersion: CHARSHEET_SCHEMA_VERSION,
    general: {
      characterName: '',
      playerName: '',
      ancestryAndHeritage: '',
      background: '',
      className: '',
      level: 1,
      heroPoints: 1,
      experiencePoints: 0,
      size: '',
      alignment: '',
      traits: '',
      deity: ''
    },
    abilities: {
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10
    },
    armorClass: {
      activeCategory: 'unarmored',
      proficiencies: createArmorProficiencies(),
      item: 0,
      dexCap: null,
      armorPenalty: 0,
      shieldBonus: 0,
      shieldHardness: 0,
      shieldMaxHp: 0,
      shieldBreakThreshold: 0,
      shieldCurrentHp: 0
    },
    hitPoints: {
      max: 0,
      current: 0,
      temporary: 0,
      dying: 0,
      dyingMax: 4,
      wounded: 0,
      resistancesAndImmunities: '',
      conditions: ''
    },
    savingThrows: {
      fortitude: { rank: 'untrained', item: 0 },
      reflex: { rank: 'untrained', item: 0 },
      will: { rank: 'untrained', item: 0 }
    },
    perception: {
      rank: 'untrained',
      item: 0,
      senses: ''
    },
    classDc: {
      rank: 'untrained',
      item: 0,
      keyAbility: 'str'
    },
    speed: {
      value: 25,
      notes: ''
    },
    skills: {
      standard: createStandardSkills(),
      lore: [createLoreEntry(), createLoreEntry()]
    },
    meleeStrikes: [createStrike('str')],
    rangedStrikes: [createStrike('dex')],
    weaponProficiencies: createFixedWeaponProficiencies(),
    languages: ''
  }
}
