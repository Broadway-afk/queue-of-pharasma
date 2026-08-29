import { describe, expect, it } from 'vitest'
import {
  charsheetFileName,
  charsheetToJson,
  normalizeCharsheet,
  parseCharsheetJson
} from '@/utils/charsheetIo'
import { createEmptyCharsheet } from '@/utils/charsheetDefaults'
import { SKILL_DEFINITIONS } from '@/data/charsheetMeta'

describe('normalizeCharsheet', () => {
  it('на мусорном значении возвращает пустой чарник', () => {
    const sheet = normalizeCharsheet('не объект')
    expect(sheet.general.characterName).toBe('')
    expect(Object.keys(sheet.skills.standard)).toHaveLength(SKILL_DEFINITIONS.length)
  })

  it('сохраняет известные поля и отбрасывает лишние', () => {
    const sheet = normalizeCharsheet({
      general: { characterName: 'Валерос', level: 7, unknownField: 'x' },
      abilities: { str: 18 },
      languages: 'Общий'
    })

    expect(sheet.general.characterName).toBe('Валерос')
    expect(sheet.general.level).toBe(7)
    expect(sheet.abilities.str).toBe(18)
    expect(sheet.abilities.dex).toBe(10)
    expect(sheet.languages).toBe('Общий')
    expect('unknownField' in sheet.general).toBe(false)
  })

  it('чинит некорректный ранг владения и нечисловые значения', () => {
    const sheet = normalizeCharsheet({
      general: { level: 'много' },
      perception: { rank: 'godlike', item: '3' },
      armorClass: { activeCategory: 'plate', dexCap: 'нет' }
    })

    expect(sheet.general.level).toBe(1)
    expect(sheet.perception.rank).toBe('untrained')
    expect(sheet.perception.item).toBe(3)
    expect(sheet.armorClass.activeCategory).toBe('unarmored')
    expect(sheet.armorClass.dexCap).toBe(null)
  })

  it('сохраняет явный null у предела Ловкости', () => {
    expect(normalizeCharsheet({ armorClass: { dexCap: null } }).armorClass.dexCap).toBe(null)
    expect(normalizeCharsheet({ armorClass: { dexCap: 2 } }).armorClass.dexCap).toBe(2)
  })

  it('фильтрует неизвестные типы урона и убирает дубликаты', () => {
    const sheet = normalizeCharsheet({
      meleeStrikes: [{ damageTypes: ['slashing', 'slashing', 'fire'] }]
    })

    expect(sheet.meleeStrikes[0]!.damageTypes).toEqual(['slashing'])
  })

  it('всегда оставляет встроенные категории оружия первыми', () => {
    const sheet = normalizeCharsheet({
      weaponProficiencies: [
        { id: 'custom-1', name: 'Алхимические бомбы', rank: 'master' },
        { id: 'martial', rank: 'expert' }
      ]
    })

    expect(sheet.weaponProficiencies.map((entry) => entry.id)).toEqual([
      'simple',
      'martial',
      'custom-1'
    ])
    expect(sheet.weaponProficiencies[1]!.rank).toBe('expert')
    expect(sheet.weaponProficiencies[1]!.fixed).toBe(true)
    expect(sheet.weaponProficiencies[2]!.fixed).toBe(false)
  })

  it('пустые списки атак и познаний заполняет значениями по умолчанию', () => {
    const sheet = normalizeCharsheet({ meleeStrikes: [], rangedStrikes: [], skills: { lore: [] } })

    expect(sheet.meleeStrikes).toHaveLength(1)
    expect(sheet.rangedStrikes).toHaveLength(1)
    expect(sheet.skills.lore.length).toBeGreaterThan(0)
  })
})

describe('parseCharsheetJson', () => {
  it('переживает полный цикл экспорт → импорт', () => {
    const original = createEmptyCharsheet()
    original.general.characterName = 'Кира'
    original.abilities.wis = 18
    original.skills.standard.medicine = { rank: 'expert', item: 1 }

    const restored = parseCharsheetJson(charsheetToJson(original))

    expect(restored).toEqual(original)
  })

  it('сообщает понятную ошибку на битом JSON', () => {
    expect(() => parseCharsheetJson('{ не json')).toThrow('Файл не является корректным JSON')
  })

  it('отклоняет JSON, который не является объектом', () => {
    expect(() => parseCharsheetJson('[1, 2]')).toThrow('Ожидался JSON-объект')
  })
})

describe('charsheetFileName', () => {
  it('использует имя персонажа и заменяет пробелы', () => {
    const sheet = createEmptyCharsheet()
    sheet.general.characterName = 'Валерос Смелый'
    expect(charsheetFileName(sheet)).toBe('Валерос-Смелый.json')
  })

  it('подставляет запасное имя для пустого и опасного ввода', () => {
    const sheet = createEmptyCharsheet()
    expect(charsheetFileName(sheet)).toBe('charsheet.json')

    sheet.general.characterName = '../../etc/passwd'
    expect(charsheetFileName(sheet)).toBe('etcpasswd.json')
  })
})
