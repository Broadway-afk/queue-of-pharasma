/**
 * Возвращает случайное число от 1 до sides (включительно)
 */
export function rollDie(sides: number): number {
  if (sides < 1) return 0
  return Math.floor(Math.random() * sides) + 1
}

/**
 * Бросок d3
 */
export const d3 = () => rollDie(3)

/**
 * Бросок d6
 */
export const d6 = () => rollDie(6)

/**
 * Бросок d8
 */
export const d8 = () => rollDie(8)

/**
 * Бросок d10
 */
export const d10 = () => rollDie(10)

/**
 * Бросок d12
 */
export const d12 = () => rollDie(12)

/**
 * Бросок d20
 */
export const d20 = () => rollDie(20)

/**
 * Бросок d100
 */
export const d100 = () => rollDie(100)
