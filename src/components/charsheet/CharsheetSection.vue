<script setup lang="ts">
const props = defineProps<{
  title: string
  icon?: string
  /** Подпись под заголовком: короткая подсказка по блоку. */
  hint?: string
}>()
</script>

<template>
  <UCard
    :ui="{
      root: 'ring-neutral-200 dark:ring-neutral-800 bg-neutral-50 dark:bg-neutral-900',
      header: 'p-4 sm:px-5',
      body: 'p-4 sm:p-5'
    }"
  >
    <template #header>
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <UIcon v-if="props.icon" :name="props.icon" class="size-5 shrink-0 text-primary-500" />
          <div class="min-w-0">
            <h2 class="text-base font-semibold uppercase tracking-wide truncate">{{ props.title }}</h2>
            <p v-if="props.hint" class="text-xs text-neutral-500 mt-0.5">{{ props.hint }}</p>
          </div>
        </div>
        <slot name="actions" />
      </div>
    </template>

    <slot />
  </UCard>
</template>
