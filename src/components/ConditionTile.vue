<script setup lang="ts">
const props = defineProps<{
  condition: {
    id: string
    name: string
    description: string
    icon: string
    color: string
  }
}>()

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify({
      type: 'condition',
      conditionId: props.condition.id
    }))
    event.dataTransfer.effectAllowed = 'copy'
  }
}
</script>

<template>
  <div
    draggable="true"
    class="flex items-center gap-1.5 p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 cursor-grab active:cursor-grabbing hover:border-primary-500 dark:hover:border-primary-400 transition-colors group relative"
    @dragstart="onDragStart"
  >
    <UBadge
      :color="(condition.color as any)"
      variant="solid"
      size="sm"
      class="p-1 w-7 h-7 flex items-center justify-center rounded flex-shrink-0"
    >
      <UIcon :name="condition.icon" class="w-4 h-4 text-white" />
    </UBadge>
    
    <div class="flex-1 min-w-0 pr-4">
      <p class="text-[11px] font-bold leading-tight text-neutral-900 dark:text-white break-words">
        {{ condition.name }}
      </p>
    </div>
    
    <UPopover :popper="{ placement: 'top' }">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-information-circle"
        size="xs"
        class="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"
        @click.stop.prevent
      />
      <template #content>
        <div class="p-3 w-64 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl">
          <p class="font-bold text-neutral-900 dark:text-white mb-1">{{ condition.name }}</p>
          {{ condition.description }}
        </div>
      </template>
    </UPopover>
  </div>
</template>
