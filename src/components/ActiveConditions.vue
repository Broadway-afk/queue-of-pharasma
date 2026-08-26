<script setup lang="ts">
import { computed } from 'vue'
import { useConditionsStore } from '@/stores/conditions'
import { useInitiativeStore } from '@/stores/initiative'
import conditionsData from '@/data/conditions.json'

const props = defineProps<{
  characterId: string
}>()

const conditionsStore = useConditionsStore()
const initiativeStore = useInitiativeStore()

const activeConditions = computed(() => {
  return conditionsStore.activeConditions[props.characterId] || []
})

const getConditionData = (conditionId: string) => {
  return conditionsData.find(c => c.id === conditionId)
}

const isActiveTurn = computed(() => {
  return initiativeStore.activeCharacterId === props.characterId
})
</script>

<template>
  <div v-if="activeConditions.length > 0" class="flex flex-wrap gap-1 max-w-[80px]">
    <UPopover :popper="{ placement: 'top-start' }">
      <div class="flex flex-wrap gap-0.5 cursor-help">
        <UBadge
          color="neutral"
          variant="soft"
          size="sm"
          class="p-0.5 min-w-[1.25rem] h-5 flex items-center justify-center gap-0.5 transition-all"
          :class="{ 'animate-pulse scale-110 z-10': isActiveTurn }"
        >
          <UIcon
            v-for="ac in activeConditions"
            :key="ac.id"
            :name="getConditionData(ac.conditionId)?.icon || 'i-heroicons-question-mark-circle-20-solid'"
            class="w-3.5 h-3.5"
            :style="{ color: `var(--ui-${getConditionData(ac.conditionId)?.color || 'neutral'})` }"
          />
        </UBadge>
      </div>

      <template #content>
        <div class="p-3 w-72 space-y-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl">
          <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h4 class="text-sm font-bold">Состояния</h4>
            <UBadge v-if="isActiveTurn" color="primary" variant="soft" size="sm" class="animate-pulse">
              Текущий ход
            </UBadge>
          </div>
          
          <div class="space-y-3 max-h-60 overflow-y-auto pr-1">
            <div 
              v-for="ac in activeConditions" 
              :key="ac.id" 
              class="flex flex-col gap-1.5 p-2 rounded border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50"
              :class="{ 'ring-1 ring-primary-500/50 border-primary-200 dark:border-primary-800': isActiveTurn }"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UBadge :color="(getConditionData(ac.conditionId)?.color as any)" variant="solid" size="sm" class="w-7 h-7 flex items-center justify-center">
                    <UIcon :name="getConditionData(ac.conditionId)?.icon || ''" class="w-4 h-4 text-white" />
                  </UBadge>
                  <span class="text-xs font-bold">{{ getConditionData(ac.conditionId)?.name }}</span>
                </div>
                
                <div class="flex items-center gap-1">
                  <template v-if="getConditionData(ac.conditionId)?.hasValue">
                    <UButton
                      icon="i-heroicons-minus"
                      size="xs"
                      variant="ghost"
                      color="neutral"
                      @click="conditionsStore.updateConditionValue(props.characterId, ac.id, ac.value - 1)"
                    />
                    <span class="text-xs font-mono font-bold w-4 text-center text-neutral-900 dark:text-white">{{ ac.value }}</span>
                    <UButton
                      icon="i-heroicons-plus"
                      size="xs"
                      variant="ghost"
                      color="neutral"
                      @click="conditionsStore.updateConditionValue(props.characterId, ac.id, ac.value + 1)"
                    />
                  </template>
                  <UButton
                    icon="i-heroicons-trash"
                    size="xs"
                    variant="ghost"
                    color="error"
                    class="ml-1"
                    @click="conditionsStore.removeCondition(props.characterId, ac.id)"
                  />
                </div>
              </div>
              <p class="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">
                {{ getConditionData(ac.conditionId)?.description }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>
