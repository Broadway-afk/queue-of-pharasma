<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import type { Pawn } from '@/stores/pawns'
import { resolvePawnImageUrl } from '@/utils/avatar'

const props = defineProps<{
  initialValues?: Partial<Pawn>
}>()

function defaultGenerateAvatar(values?: Partial<Pawn>): boolean {
  if (values?.generateAvatar !== undefined) return values.generateAvatar
  return !values?.imageUrl
}

const form = reactive({
  name: props.initialValues?.name || '',
  modifier: props.initialValues?.modifier ?? 0,
  maxHp: props.initialValues?.maxHp ?? 10,
  ac: props.initialValues?.ac ?? 10,
  imageUrl: props.initialValues?.imageUrl || '',
  generateAvatar: defaultGenerateAvatar(props.initialValues)
})

const avatarPreviewUrl = computed(() =>
  resolvePawnImageUrl({
    name: form.name,
    imageUrl: form.imageUrl,
    generateAvatar: form.generateAvatar
  })
)

defineExpose({
  form
})

watch(() => props.initialValues, (newValues) => {
  if (newValues) {
    form.name = newValues.name || ''
    form.modifier = newValues.modifier ?? 0
    form.maxHp = newValues.maxHp ?? 10
    form.ac = newValues.ac ?? 10
    form.imageUrl = newValues.imageUrl || ''
    form.generateAvatar = defaultGenerateAvatar(newValues)
  }
}, { deep: true })
</script>

<template>
  <div class="space-y-3 py-3">
    <UFormField label="Имя">
      <UInput v-model="form.name" placeholder="Например: Лютый волк" class="w-full" />
    </UFormField>
    
    <div class="grid grid-cols-3 gap-3">
      <UFormField label="Иниц (мод)">
        <UInput v-model.number="form.modifier" type="number" />
      </UFormField>
      <UFormField label="ОЗ (макс)">
        <UInput v-model.number="form.maxHp" type="number" />
      </UFormField>
      <UFormField label="КЗ">
        <UInput v-model.number="form.ac" type="number" />
      </UFormField>
    </div>
    
    <UFormField label="Ссылка на картинку (опционально)">
      <UInput v-model="form.imageUrl" placeholder="https://..." />
    </UFormField>

    <div class="flex items-center gap-3">
      <UCheckbox v-model="form.generateAvatar" label="Генерировать аватар из имени" />
      <UAvatar
        :src="avatarPreviewUrl"
        :icon="!avatarPreviewUrl ? 'i-heroicons-user-20-solid' : undefined"
        size="sm"
        class="bg-neutral-100 dark:bg-neutral-800"
      />
    </div>
  </div>
</template>
