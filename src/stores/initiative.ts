import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { d20 } from '@/utils/dice'

export interface Character {
  id: string
  name: string
  initiative: number
  modifier: number
  currentHp: number
  maxHp: number
  ac: number
  imageUrl?: string
}

export const useInitiativeStore = defineStore('initiative', () => {
  const characters = ref<Character[]>([])
  const activeCharacterId = ref<string | null>(null)

  // Загрузка состояния из localStorage
  if (typeof window !== 'undefined') {
    const savedCharacters = localStorage.getItem('initiative-characters')
    if (savedCharacters) {
      try {
        characters.value = JSON.parse(savedCharacters)
      } catch (e) {
        console.error('Failed to parse saved characters', e)
      }
    }

    // Если данных нет, используем начальные значения
    if (characters.value.length === 0) {
      characters.value = [
        { id: '1', name: 'Valeros', initiative: 18, modifier: 5, currentHp: 20, maxHp: 22, ac: 18, imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Valeros' },
        { id: '2', name: 'Kyra', initiative: 12, modifier: 3, currentHp: 15, maxHp: 18, ac: 16, imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kyra' },
        { id: '3', name: 'Goblin Warrior', initiative: 15, modifier: 2, currentHp: 6, maxHp: 6, ac: 13, imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Goblin' }
      ]
    }

    const savedActiveId = localStorage.getItem('initiative-active-id')
    if (savedActiveId) {
      activeCharacterId.value = savedActiveId
    }
  }

  // Наблюдатели для персистентности
  watch(characters, (newVal) => {
    localStorage.setItem('initiative-characters', JSON.stringify(newVal))
  }, { deep: true })

  watch(activeCharacterId, (newVal) => {
    if (newVal) {
      localStorage.setItem('initiative-active-id', newVal)
    } else {
      localStorage.removeItem('initiative-active-id')
    }
  })

  function sortByInitiative() {
    characters.value.sort((a, b) => b.initiative - a.initiative)
  }

  function addCharacter(character: Omit<Character, 'id'>) {
    characters.value.push({
      ...character,
      id: Math.random().toString(36).substring(2, 9)
    })
  }

  function removeCharacter(id: string) {
    const index = characters.value.findIndex(c => c.id === id)
    if (index !== -1) {
      const wasActive = activeCharacterId.value === id
      characters.value.splice(index, 1)
      
      if (wasActive) {
        if (characters.value.length > 0) {
          // Устанавливаем активность на следующего персонажа (который теперь на том же индексе)
          // или на первого, если удалили последнего
          const nextIndex = index < characters.value.length ? index : 0
          const nextChar = characters.value[nextIndex]
          if (nextChar) {
            activeCharacterId.value = nextChar.id
          }
        } else {
          activeCharacterId.value = null
        }
      }
    }
  }

  function updateCharacter(id: string, updates: Partial<Character>) {
    const character = characters.value.find(c => c.id === id)
    if (character) {
      Object.assign(character, updates)
    }
  }

  function rerollAllInitiative() {
    characters.value.forEach(character => {
      character.initiative = d20() + character.modifier
    })
    sortByInitiative()
  }

  function nextTurn() {
    if (characters.value.length === 0) {
      activeCharacterId.value = null
      return
    }

    const currentIndex = characters.value.findIndex(c => c.id === activeCharacterId.value)
    if (currentIndex === -1 || currentIndex === characters.value.length - 1) {
      activeCharacterId.value = characters.value[0]?.id || null
    } else {
      activeCharacterId.value = characters.value[currentIndex + 1]?.id || null
    }
  }

  return {
    characters,
    activeCharacterId,
    sortByInitiative,
    addCharacter,
    removeCharacter,
    updateCharacter,
    rerollAllInitiative,
    nextTurn
  }
})
