<script setup lang="ts">
import { ref } from 'vue'
import type { Character } from '@/stores/initiative'
import { useInitiativeStore } from '@/stores/initiative'
import { useConditionsStore } from '@/stores/conditions'
import ActiveConditions from '@/components/ActiveConditions.vue'

const props = defineProps<{
  character: Character
  column: string
}>()

const store = useInitiativeStore()
const conditionsStore = useConditionsStore()

const hpChange = ref('')

const handleRemoveCharacter = () => {
  store.removeCharacter(props.character.id)
  conditionsStore.clearForCharacter(props.character.id)
}

const applyHpChange = (close: () => void) => {
  const val = hpChange.value.trim()
  if (!val) return

  const delta = parseInt(val)
  if (!isNaN(delta)) {
    props.character.currentHp += delta
  }

  hpChange.value = ''
  close()
}

const onCellDrop = (event: DragEvent) => {
  const data = event.dataTransfer?.getData('application/json')
  if (!data) return

  try {
    const parsed = JSON.parse(data)
    if (parsed.type === 'condition') {
      event.stopPropagation()
      conditionsStore.addCondition(props.character.id, parsed.conditionId)
    }
  } catch (e) {
    console.error('Failed to parse condition data', e)
  }
}
</script>

<template>
  <template v-if="column === 'turn'">
    <div class="flex justify-center" @dragover.prevent @drop.prevent="onCellDrop">
      <UIcon
        v-if="character.id === store.activeCharacterId"
        name="i-heroicons-play-20-solid"
        class="w-5 h-5 text-primary-500 animate-pulse"
      />
    </div>
  </template>

  <template v-else-if="column === 'avatar'">
    <div class="relative group flex items-center justify-center w-full h-full py-1" @dragover.prevent @drop.prevent="onCellDrop">
      <UAvatar
        :src="character.imageUrl"
        :icon="!character.imageUrl ? 'i-heroicons-user-20-solid' : undefined"
        size="sm"
        class="bg-neutral-100 dark:bg-neutral-800"
      />
      <div class="absolute -bottom-1 z-10">
        <ActiveConditions :character-id="character.id" />
      </div>
    </div>
  </template>

  <template v-else-if="column === 'initiative'">
    <div class="flex items-center justify-center gap-0.5 px-1" @dragover.prevent @drop.prevent="onCellDrop">
      <UInput
        v-model.number="character.initiative"
        type="number"
        size="md"
        variant="none"
        class="w-14 font-mono font-bold text-center"
        :ui="{ base: 'px-0 text-center' }"
      />
      <span class="text-neutral-400 text-sm">(</span>
      <UInput
        v-model.number="character.modifier"
        type="number"
        size="md"
        variant="none"
        class="w-10 text-neutral-500 font-mono text-center"
        :ui="{ base: 'px-0 text-center' }"
      />
      <span class="text-neutral-400 text-sm">)</span>
    </div>
  </template>

  <template v-else-if="column === 'name'">
    <div class="w-full h-full flex items-center" @dragover.prevent @drop.prevent="onCellDrop">
      <UInput
        v-model="character.name"
        variant="none"
        size="md"
        class="w-full font-semibold text-neutral-900 dark:text-white"
      />
    </div>
  </template>

  <template v-else-if="column === 'hp'">
    <div class="flex flex-col gap-1 py-1 px-2" @dragover.prevent @drop.prevent="onCellDrop">
      <div class="flex items-center gap-1">
        <UInput
          v-model.number="character.currentHp"
          type="number"
          size="md"
          variant="none"
          class="w-16"
          :ui="{ base: 'text-right p-0' }"
        />
        <span class="text-neutral-400">/</span>
        <UInput
          v-model.number="character.maxHp"
          type="number"
          size="md"
          variant="none"
          class="w-16"
          :ui="{ base: 'p-0' }"
        />

        <UPopover>
          <UButton
            icon="i-heroicons-calculator"
            size="xs"
            color="neutral"
            variant="outline"
            class="ml-0.5"
            title="Быстрое изменение ОЗ"
          />
          <template #content="{ close }">
            <div class="p-2 flex gap-1 items-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg">
              <UInput
                v-model="hpChange"
                placeholder="+/- HP"
                size="sm"
                class="w-20"
                autofocus
                @keyup.enter="applyHpChange(close)"
              />
              <UButton
                icon="i-heroicons-check"
                size="sm"
                color="primary"
                @click="applyHpChange(close)"
              />
            </div>
          </template>
        </UPopover>
      </div>
      <div class="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1 overflow-hidden">
        <div
          class="bg-primary-500 h-1 rounded-full transition-all duration-300"
          :style="{ width: `${Math.min(100, Math.max(0, (character.currentHp / (character.maxHp || 1)) * 100))}%` }"
        ></div>
      </div>
    </div>
  </template>

  <template v-else-if="column === 'ac'">
    <div class="flex items-center justify-center gap-1" @dragover.prevent @drop.prevent="onCellDrop">
      <UIcon name="i-heroicons-shield-check-20-solid" class="w-4 h-4 text-neutral-400" />
      <UInput
        v-model.number="character.ac"
        type="number"
        variant="none"
        size="md"
        class="w-14 text-center"
        :ui="{ base: 'text-center' }"
      />
    </div>
  </template>

  <template v-else-if="column === 'actions'">
    <UButton
      @dragover.prevent @drop.prevent="onCellDrop"
      color="error"
      variant="ghost"
      icon="i-heroicons-x-mark"
      size="sm"
      @click="handleRemoveCharacter"
    />
  </template>
</template>
