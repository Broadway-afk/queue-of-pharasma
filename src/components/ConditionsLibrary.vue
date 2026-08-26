<script setup lang="ts">
import { ref, computed } from 'vue'
import conditionsData from '@/data/conditions.json'
import ConditionTile from '@/components/ConditionTile.vue'

const searchQuery = ref('')

const filteredConditions = computed(() => {
  if (!searchQuery.value) return conditionsData
  const query = searchQuery.value.toLowerCase()
  return conditionsData.filter(c => 
    c.id.toLowerCase().includes(query) ||
    c.name.toLowerCase().includes(query) || 
    c.description.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="space-y-4">
    <UInput
      v-model="searchQuery"
      icon="i-heroicons-magnifying-glass"
      placeholder="Поиск состояний..."
      size="sm"
      class="w-full"
    />

    <div class="grid grid-cols-1 gap-2 pr-1">
      <ConditionTile
        v-for="condition in filteredConditions"
        :key="condition.id"
        :condition="condition"
      />
    </div>
    
    <p class="text-[10px] text-neutral-500 text-center uppercase font-bold tracking-wider pt-2">
      Перетащите на персонажа
    </p>
  </div>
</template>
