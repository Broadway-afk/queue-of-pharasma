<script setup lang="ts">
import { computed } from 'vue'
import type { Pawn } from '@/stores/pawns'
import { resolvePawnImageUrl } from '@/utils/avatar'

const props = defineProps<{
  pawn: Pawn
}>()

const avatarUrl = computed(() => resolvePawnImageUrl(props.pawn))

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify({
      ...props.pawn,
      imageUrl: avatarUrl.value,
      type: 'pawn'
    }))
    event.dataTransfer.effectAllowed = 'copy'
  }
}
</script>

<template>
  <div
    draggable="true"
    class="flex items-center gap-3 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-primary-500 dark:hover:border-primary-400 cursor-grab active:cursor-grabbing transition-all group"
    @dragstart="onDragStart"
  >
    <UAvatar
      :src="avatarUrl"
      :icon="!avatarUrl ? 'i-heroicons-user-20-solid' : undefined"
      size="sm"
      class="bg-neutral-100 dark:bg-neutral-800"
    />
    
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
        {{ pawn.name }}
      </p>
      <div class="flex gap-2 mt-0.5">
        <UBadge color="neutral" variant="soft" size="sm">
          Иниц: {{ pawn.modifier >= 0 ? '+' : '' }}{{ pawn.modifier }}
        </UBadge>
        <UBadge color="neutral" variant="soft" size="sm">
          КЗ: {{ pawn.ac }}
        </UBadge>
      </div>
    </div>
    
    <div class="text-xs text-neutral-400 group-hover:text-primary-500 transition-colors">
      <UIcon name="i-heroicons-hand-raised-20-solid" class="w-4 h-4" />
    </div>
  </div>
</template>
