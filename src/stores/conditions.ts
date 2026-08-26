import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export interface ActiveCondition {
  id: string
  conditionId: string
  value: number
}

export const useConditionsStore = defineStore('conditions', () => {
  const activeConditions = ref<Record<string, ActiveCondition[]>>({})

  // Загрузка состояния из localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('active-conditions')
    if (saved) {
      try {
        activeConditions.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved conditions', e)
      }
    }
  }

  // Наблюдатель для персистентности
  watch(activeConditions, (newVal) => {
    localStorage.setItem('active-conditions', JSON.stringify(newVal))
  }, { deep: true })

  function addCondition(characterId: string, conditionId: string, value: number = 1) {
    if (!activeConditions.value[characterId]) {
      activeConditions.value[characterId] = []
    }

    const existing = activeConditions.value[characterId].find(c => c.conditionId === conditionId)
    if (existing) {
      // Если состояние уже есть, можно либо увеличить значение, либо оставить как есть
      // Для многих состояний в PF2e они не складываются, а выбирается высшее.
      // Но для простоты пока будем просто устанавливать переданное или оставлять большее.
      existing.value = Math.max(existing.value, value)
    } else {
      activeConditions.value[characterId].push({
        id: Math.random().toString(36).substring(2, 9),
        conditionId,
        value
      })
    }
  }

  function removeCondition(characterId: string, conditionInstanceId: string) {
    if (activeConditions.value[characterId]) {
      activeConditions.value[characterId] = activeConditions.value[characterId].filter(
        c => c.id !== conditionInstanceId
      )
    }
  }

  function updateConditionValue(characterId: string, conditionInstanceId: string, newValue: number) {
    if (activeConditions.value[characterId]) {
      const condition = activeConditions.value[characterId].find(c => c.id === conditionInstanceId)
      if (condition) {
        condition.value = newValue
        if (condition.value <= 0) {
          removeCondition(characterId, conditionInstanceId)
        }
      }
    }
  }

  function clearForCharacter(characterId: string) {
    if (activeConditions.value[characterId]) {
      delete activeConditions.value[characterId]
    }
  }

  return {
    activeConditions,
    addCondition,
    removeCondition,
    updateConditionValue,
    clearForCharacter
  }
})
