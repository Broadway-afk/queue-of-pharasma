<script setup lang="ts">
import { ref, reactive, useTemplateRef } from 'vue'
import { usePawnStore } from '@/stores/pawns'
import { parseMonsterStatblock } from '@/utils/monsterParser'
import { preparePawnPayload } from '@/utils/avatar'
import PawnBaseForm from './PawnBaseForm.vue'

const emit = defineEmits(['close'])
const pawnStore = usePawnStore()
const baseFormRef = useTemplateRef('baseForm')

const activeTab = ref('manual')
const statblock = ref('')

const handleParse = () => {
  const parsed = parseMonsterStatblock(statblock.value)
  if (parsed && baseFormRef.value) {
    baseFormRef.value.form.name = parsed.name
    baseFormRef.value.form.modifier = parsed.modifier
    baseFormRef.value.form.maxHp = parsed.maxHp
    baseFormRef.value.form.ac = parsed.ac
    activeTab.value = 'manual'
  }
}

const handleSubmit = () => {
  if (!baseFormRef.value) return
  
  pawnStore.addPawn(preparePawnPayload(baseFormRef.value.form))
  emit('close')
}
</script>

<template>
  <UCard
    :ui="{
      root: 'bg-neutral-50 dark:bg-neutral-900 shadow-xl',
      header: 'flex items-center justify-between',
      body: 'p-4 sm:p-6',
      footer: 'flex justify-end gap-2 p-4 sm:px-6'
    }"
  >
    <template #header>
      <h3 class="text-lg font-bold text-neutral-900 dark:text-white">
        Добавить павн
      </h3>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-x-mark"
        class="-my-1"
        @click="emit('close')"
      />
    </template>

    <div class="space-y-4">
      <UTabs
        v-model="activeTab"
        :items="[
          { value: 'manual', slot: 'manual', label: 'Вручную', icon: 'i-heroicons-pencil-square' },
          { value: 'import', slot: 'import', label: 'Импорт', icon: 'i-heroicons-document-arrow-down' }
        ]"
      >
        <template #manual>
          <PawnBaseForm ref="baseForm" />
        </template>

        <template #import>
          <div class="space-y-3 py-3">
            <p class="text-sm text-neutral-500">
              Вставьте статблок монстра (из AoN или PDF). Мы попробуем извлечь основные параметры.
            </p>
            <UTextarea
              v-model="statblock"
              placeholder="Giant Rat\nPerception +5...\nAC 15...\nHP 8..."
              rows="6"
            />
            <UButton
              color="neutral"
              variant="soft"
              block
              label="Распарсить"
              :disabled="!statblock.trim()"
              @click="handleParse"
            />
          </div>
        </template>
      </UTabs>
    </div>

    <template #footer>
      <UButton color="neutral" variant="ghost" label="Отмена" @click="emit('close')" />
      <UButton color="primary" label="Добавить в библиотеку" :disabled="!baseFormRef?.form?.name" @click="handleSubmit" />
    </template>
  </UCard>
</template>
