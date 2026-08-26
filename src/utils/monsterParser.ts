export interface ParsedMonster {
  name: string
  modifier: number
  maxHp: number
  ac: number
}

export function parseMonsterStatblock(text: string): ParsedMonster | null {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  if (lines.length === 0) return null

  const monster: Partial<ParsedMonster> = {}

  // Name is usually the first line
  monster.name = lines[0]

  // Perception +X
  const perceptionMatch = text.match(/Perception\s+\+(\d+)/i)
  if (perceptionMatch && perceptionMatch[1]) {
    monster.modifier = parseInt(perceptionMatch[1], 10)
  } else {
    monster.modifier = 0
  }

  // AC XX
  const acMatch = text.match(/AC\s+(\d+)/i)
  if (acMatch && acMatch[1]) {
    monster.ac = parseInt(acMatch[1], 10)
  } else {
    monster.ac = 10
  }

  // HP XX
  const hpMatch = text.match(/HP\s+(\d+)/i)
  if (hpMatch && hpMatch[1]) {
    monster.maxHp = parseInt(hpMatch[1], 10)
  } else {
    monster.maxHp = 10
  }

  return monster as ParsedMonster
}
