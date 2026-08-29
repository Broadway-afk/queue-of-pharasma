<script setup lang="ts">
import CharsheetSection from './CharsheetSection.vue'

const languages = defineModel<string>({ required: true })
</script>

<template>
  <CharsheetSection title="Языки" icon="i-heroicons-language">
    <UTextarea
      v-model="languages"
      :rows="3"
      autoresize
      placeholder="Общий, эльфийский, дварфийский…"
      aria-label="Языки персонажа"
      class="w-full"
    />
  </CharsheetSection>
</template>
