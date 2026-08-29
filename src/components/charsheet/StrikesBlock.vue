<script setup lang="ts">
import type { Charsheet, Strike } from '@/types/charsheet'
import CharsheetSection from './CharsheetSection.vue'
import StrikeRow from './StrikeRow.vue'

const strikes = defineModel<Strike[]>({ required: true })

const props = defineProps<{
  title: string
  icon: string
  sheet: Charsheet
  addLabel: string
}>()

const emit = defineEmits<{
  add: []
  remove: [id: string]
}>()
</script>

<template>
  <CharsheetSection :title="props.title" :icon="props.icon">
    <template #actions>
      <UButton
        icon="i-heroicons-plus"
        size="xs"
        color="neutral"
        variant="subtle"
        @click="emit('add')"
      >
        {{ props.addLabel }}
      </UButton>
    </template>

    <ul v-if="strikes.length > 0" class="flex flex-col gap-3">
      <StrikeRow
        v-for="(strike, index) in strikes"
        :key="strike.id"
        v-model="strikes[index]!"
        :sheet="props.sheet"
        :index="index"
        @remove="emit('remove', strike.id)"
      />
    </ul>
    <p v-else class="text-sm text-neutral-500">Атак пока нет.</p>
  </CharsheetSection>
</template>
