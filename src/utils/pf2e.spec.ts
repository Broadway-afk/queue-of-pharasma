import { describe, expect, it } from 'vitest'
import { createEmptyCharsheet } from '@/utils/charsheetDefaults'
import {
  abilityModifier,
  armorClassTotal,
  cappedDexBonus,
  classDcTotal,
  formatModifier,
  loreSkillTotal,
  perceptionTotal,
  proficiencyBonus,
  savingThrowTotal,
  standardSkillTotal,
  strikeAttackTotal
} from '@/utils/pf2e'

describe('abilityModifier', () => {
  it('считает модификатор с округлением вниз', () => {
    expect(abilityModifier(10)).toBe(0)
    expect(abilityModifier(11)).toBe(0)
    expect(abilityModifier(18)).toBe(4)
    expect(abilityModifier(9)).toBe(-1)
    expect(abilityModifier(7)).toBe(-2)
  })
})

describe('proficiencyBonus', () => {
  it('для неопытного всегда 0 независимо от уровня', () => {
    expect(proficiencyBonus('untrained', 5)).toBe(0)
  })

  it('добавляет уровень к константе ранга', () => {
    expect(proficiencyBonus('trained', 3)).toBe(5)
    expect(proficiencyBonus('expert', 3)).toBe(7)
    expect(proficiencyBonus('master', 3)).toBe(9)
    expect(proficiencyBonus('legendary', 3)).toBe(11)
  })
})

describe('formatModifier', () => {
  it('добавляет знак плюса к нулю и положительным', () => {
    expect(formatModifier(0)).toBe('+0')
    expect(formatModifier(3)).toBe('+3')
    expect(formatModifier(-2)).toBe('-2')
  })
})

describe('armorClassTotal', () => {
  it('использует владение активной категорией брони', () => {
    const sheet = createEmptyCharsheet()
    sheet.general.level = 4
    sheet.abilities.dex = 16
    sheet.armorClass.proficiencies.medium = 'expert'
    sheet.armorClass.proficiencies.unarmored = 'untrained'
    sheet.armorClass.activeCategory = 'medium'
    sheet.armorClass.item = 1

    // 10 + 3 (ЛОВ) + 8 (эксперт на 4 уровне) + 1 (предмет)
    expect(armorClassTotal(sheet)).toBe(22)
  })

  it('ограничивает бонус Ловкости пределом брони', () => {
    const sheet = createEmptyCharsheet()
    sheet.abilities.dex = 18
    sheet.armorClass.dexCap = 1

    expect(cappedDexBonus(sheet)).toBe(1)
    expect(armorClassTotal(sheet)).toBe(11)
  })

  it('без предела учитывает всю Ловкость', () => {
    const sheet = createEmptyCharsheet()
    sheet.abilities.dex = 18
    sheet.armorClass.dexCap = null

    expect(cappedDexBonus(sheet)).toBe(4)
  })
})

describe('savingThrowTotal', () => {
  it('берёт характеристику, соответствующую спасброску', () => {
    const sheet = createEmptyCharsheet()
    sheet.general.level = 2
    sheet.abilities.con = 14
    sheet.savingThrows.fortitude = { rank: 'expert', item: 2 }

    // 2 (ТЕЛ) + 6 (эксперт на 2 уровне) + 2 (предмет)
    expect(savingThrowTotal(sheet, 'fortitude')).toBe(10)
  })
})

describe('perceptionTotal и classDcTotal', () => {
  it('внимательность считается от Мудрости', () => {
    const sheet = createEmptyCharsheet()
    sheet.general.level = 1
    sheet.abilities.wis = 16
    sheet.perception = { rank: 'trained', item: 0, senses: '' }

    expect(perceptionTotal(sheet)).toBe(6)
  })

  it('СЛ класса включает базу 10 и ключевую характеристику', () => {
    const sheet = createEmptyCharsheet()
    sheet.general.level = 1
    sheet.abilities.cha = 18
    sheet.classDc = { rank: 'trained', item: 0, keyAbility: 'cha' }

    expect(classDcTotal(sheet)).toBe(17)
  })
})

describe('навыки', () => {
  it('вычитает штраф брони только у нужных навыков', () => {
    const sheet = createEmptyCharsheet()
    sheet.general.level = 1
    sheet.abilities.dex = 16
    sheet.abilities.int = 16
    sheet.armorClass.armorPenalty = 2
    sheet.skills.standard.acrobatics = { rank: 'trained', item: 0 }
    sheet.skills.standard.arcana = { rank: 'trained', item: 0 }

    // Акробатика: 3 + 3 - 2 = 4, Магия штраф не получает: 3 + 3 = 6
    expect(standardSkillTotal(sheet, 'acrobatics')).toBe(4)
    expect(standardSkillTotal(sheet, 'arcana')).toBe(6)
  })

  it('познание считается от Интеллекта без штрафа брони', () => {
    const sheet = createEmptyCharsheet()
    sheet.general.level = 1
    sheet.abilities.int = 18
    sheet.armorClass.armorPenalty = 3
    const lore = sheet.skills.lore[0]!
    lore.rank = 'trained'
    lore.item = 1

    expect(loreSkillTotal(sheet, lore.id)).toBe(8)
  })

  it('неизвестный навык даёт 0 вместо ошибки', () => {
    const sheet = createEmptyCharsheet()
    expect(standardSkillTotal(sheet, 'unknown')).toBe(0)
    expect(loreSkillTotal(sheet, 'unknown')).toBe(0)
  })
})

describe('strikeAttackTotal', () => {
  it('использует характеристику, указанную в атаке', () => {
    const sheet = createEmptyCharsheet()
    sheet.general.level = 5
    sheet.abilities.str = 18
    sheet.abilities.dex = 12
    const strike = sheet.meleeStrikes[0]!
    strike.attackAbility = 'str'
    strike.rank = 'expert'
    strike.item = 1

    // 4 (СИЛ) + 9 (эксперт на 5 уровне) + 1 (предмет)
    expect(strikeAttackTotal(sheet, strike)).toBe(14)
  })
})
