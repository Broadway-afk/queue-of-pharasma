<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  export: []
  import: [file: File]
  reset: []
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const confirmResetOpen = ref(false)

function pickFile() {
  fileInput.value?.click()
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    emit('import', file)
  }
  // Сбрасываем значение, чтобы повторный выбор того же файла тоже сработал.
  input.value = ''
}

function confirmReset() {
  confirmResetOpen.value = false
  emit('reset')
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="min-w-0">
      <h1 class="text-2xl font-bold">Чарник Pathfinder 2e</h1>
      <p class="text-sm text-neutral-500">Изменения сохраняются автоматически</p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <UButton
        icon="i-heroicons-arrow-down-tray"
        color="neutral"
        variant="subtle"
        @click="emit('export')"
      >
        Экспорт
      </UButton>

      <UButton
        icon="i-heroicons-arrow-up-tray"
        color="neutral"
        variant="subtle"
        @click="pickFile"
      >
        Импорт
      </UButton>

      <UButton
        icon="i-heroicons-arrow-path"
        color="error"
        variant="ghost"
        @click="confirmResetOpen = true"
      >
        Сбросить
      </UButton>

      <input
        ref="fileInput"
        type="file"
        accept="application/json,.json"
        class="hidden"
        aria-label="Выбрать файл чарника"
        @change="onFileChange"
      />
    </div>

    <UModal v-model:open="confirmResetOpen" title="Сбросить чарник?">
      <template #body>
        <p class="text-sm">
          Все заполненные поля будут очищены. Сохранённые данные восстановить не получится —
          сначала сделайте экспорт.
        </p>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="confirmResetOpen = false">
            Отмена
          </UButton>
          <UButton color="error" @click="confirmReset">Сбросить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
