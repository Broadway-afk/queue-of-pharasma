import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import basePawns from '@/data/pawns.json'

export interface Pawn {
  id: string
  name: string
  modifier: number
  maxHp: number
  ac: number
  imageUrl?: string
  generateAvatar?: boolean
  isCustom?: boolean
}

export const usePawnStore = defineStore('pawns', () => {
  const customPawns = ref<Pawn[]>([])

  // Load from localStorage
  const saved = localStorage.getItem('custom_pawns')
  if (saved) {
    try {
      customPawns.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load custom pawns', e)
    }
  }

  // Watch and save to localStorage
  watch(customPawns, (val) => {
    localStorage.setItem('custom_pawns', JSON.stringify(val))
  }, { deep: true })

  const pawns = computed<Pawn[]>(() => {
    return [...(basePawns as Pawn[]), ...customPawns.value]
  })

  function addPawn(pawn: Omit<Pawn, 'id' | 'isCustom'>) {
    const newPawn: Pawn = {
      ...pawn,
      id: crypto.randomUUID(),
      isCustom: true
    }
    customPawns.value.push(newPawn)
    return newPawn
  }

  function removePawn(id: string) {
    customPawns.value = customPawns.value.filter(p => p.id !== id)
  }

  const updatePawn = (id: string, updates: Partial<Omit<Pawn, 'id' | 'isCustom'>>) => {
    const index = customPawns.value.findIndex(p => p.id === id)
    if (index !== -1) {
      const pawn = customPawns.value[index]
      if (pawn) {
        customPawns.value[index] = { ...pawn, ...updates }
      }
    }
  }

  return {
    pawns,
    customPawns,
    addPawn,
    updatePawn,
    removePawn
  }
})
