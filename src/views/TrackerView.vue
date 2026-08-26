<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'
import { useInitiativeStore } from '@/stores/initiative'
import { usePawnStore, type Pawn } from '@/stores/pawns'
import { storeToRefs } from 'pinia'
import InitiativePawn from '@/components/InitiativePawn.vue'
import PawnForm from '@/components/PawnForm.vue'
import PawnBaseForm from '@/components/PawnBaseForm.vue'
import ConditionsLibrary from '@/components/ConditionsLibrary.vue'
import TrackerTableRow from '@/components/TrackerTableRow.vue'
import { preparePawnPayload, resolvePawnImageUrl } from '@/utils/avatar'
import basePawns from '@/data/pawns.json'

const store = useInitiativeStore()
const pawnStore = usePawnStore()
const { characters } = storeToRefs(store)
const { customPawns } = storeToRefs(pawnStore)

const isOver = ref(false)
const searchQuery = ref('')
const isPawnModalOpen = ref(false)
const isEditModalOpen = ref(false)
const activeTab = ref('pawns')
const editingPawn = ref<any>(null)
const editFormRef = useTemplateRef('editFormRef')

const openEditModal = (pawn: any) => {
  editingPawn.value = { ...pawn }
  isEditModalOpen.value = true
}

const handleUpdatePawn = () => {
  if (editingPawn.value && editFormRef.value) {
    pawnStore.updatePawn(editingPawn.value.id, preparePawnPayload(editFormRef.value.form))
    isEditModalOpen.value = false
  }
}

const filterPawnsByQuery = (list: Pawn[]) => {
  if (!searchQuery.value) return list
  const query = searchQuery.value.toLowerCase()
  return list.filter(p => p.name.toLowerCase().includes(query))
}

const filteredCustomPawns = computed(() =>
  filterPawnsByQuery(customPawns.value)
)

const filteredStandardPawns = computed(() =>
  filterPawnsByQuery(basePawns as Pawn[])
)

const pawnAccordionItems = [
  { label: 'Мои павны', value: 'custom', slot: 'custom', icon: 'i-heroicons-user' },
  { label: 'Стандартные', value: 'standard', slot: 'standard', icon: 'i-heroicons-book-open' }
]

const onDrop = (event: DragEvent) => {
  isOver.value = false
  const data = event.dataTransfer?.getData('application/json')
  if (data) {
    try {
      const parsed = JSON.parse(data)
      if (parsed.type === 'pawn') {
        store.addCharacter({
          name: parsed.name,
          initiative: 10 + parsed.modifier,
          modifier: parsed.modifier,
          currentHp: parsed.maxHp,
          maxHp: parsed.maxHp,
          ac: parsed.ac,
          imageUrl: resolvePawnImageUrl(parsed) || parsed.imageUrl
        })
      }
    } catch (e) {
      console.error('Failed to parse pawn data', e)
    }
  }
}

const columns = [
  {
    accessorKey: 'turn',
    header: '',
    class: 'w-10'
  },
  {
    accessorKey: 'avatar',
    header: '',
    class: 'w-12'
  },
  {
    accessorKey: 'initiative',
    header: 'Инициатива',
    class: 'w-32'
  },
  {
    accessorKey: 'name',
    header: 'Имя',
  },
  {
    accessorKey: 'hp',
    header: 'ОЗ (тек/макс)',
    class: 'w-44'
  },
  {
    accessorKey: 'ac',
    header: 'КЗ',
    class: 'w-24'
  },
  {
    accessorKey: 'actions',
    header: '',
    class: 'w-12'
  }
]
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-6 items-start">
    <div class="flex-1 w-full space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Инициатива
          </h1>
          <p class="text-neutral-500 dark:text-neutral-400 mt-1">
            Отслеживание порядка ходов и состояния персонажей в бою.
          </p>
        </div>
        <div class="flex gap-2">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-bars-arrow-down"
            label="Упорядочить"
            @click="store.sortByInitiative"
          />
          <UButton
            color="primary"
            icon="i-heroicons-arrow-path"
            label="Reroll"
            @click="store.rerollAllInitiative"
          />
        </div>
      </div>

      <UCard
        :ui="{
          body: 'p-0 sm:p-0',
          root: isOver 
            ? 'ring-2 ring-primary-500 dark:ring-primary-400 bg-primary-50/50 dark:bg-primary-900/10' 
            : 'bg-neutral-50 dark:bg-neutral-900'
        }"
        class="overflow-hidden transition-all duration-200"
        @dragover.prevent="isOver = true"
        @dragleave.prevent="isOver = false"
        @drop.prevent="onDrop"
      >
        <UTable
          :columns="columns"
          :data="characters"
          class="w-full"
          :ui="{
            thead: 'bg-neutral-100 dark:bg-neutral-800',
            tr: (ctx: any) => [
              'divide-x divide-neutral-200 dark:divide-neutral-800 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors',
              ctx.row?.original?.id === store.activeCharacterId ? 'bg-primary-50/50 dark:bg-primary-900/20 ring-2 ring-inset ring-primary-500' : ''
            ],
            th: 'px-4 py-3 text-neutral-900 dark:text-white font-bold',
            td: 'px-4 py-2'
          }"
        >
          <template v-for="column in columns" #[`${column.accessorKey}-cell`]="{ row }">
            <TrackerTableRow :character="row.original" :column="column.accessorKey" />
          </template>
        </UTable>
      </UCard>

      <div class="flex justify-center">
        <UButton
          size="xl"
          block
          color="primary"
          variant="solid"
          icon="i-heroicons-forward-20-solid"
          label="Следующий ход"
          class="py-4 text-lg font-bold shadow-md ring-offset-2"
          @click="store.nextTurn"
        />
      </div>
    </div>

    <aside class="w-full lg:w-80 flex-shrink-0 space-y-6">
      <UCard :ui="{ root: 'bg-neutral-50 dark:bg-neutral-900', body: 'p-4', header: 'p-2' }">
        <template #header>
          <UTabs
            v-model="activeTab"
            color="primary"
            variant="pill"
            size="sm"
            :items="[
              { label: 'Павны', icon: 'i-heroicons-users', value: 'pawns' },
              { label: 'Состояния', icon: 'i-heroicons-sparkles', value: 'conditions' }
            ]"
            class="w-full"
          />
        </template>
        
        <div v-if="activeTab === 'pawns'" class="space-y-3">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">Библиотека павнов</h3>
            <UButton
              color="primary"
              variant="ghost"
              icon="i-heroicons-plus-circle"
              size="xs"
              @click="isPawnModalOpen = true"
            />
          </div>
          
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Поиск..."
            size="sm"
            class="mb-2 w-full"
          />
          
          <p class="text-[10px] text-neutral-500 mb-2 uppercase font-bold tracking-wider text-center">
            Перетащите на таблицу
          </p>

          <UAccordion
            type="multiple"
            :default-value="['custom', 'standard']"
            :unmount-on-hide="false"
            :items="pawnAccordionItems"
            :ui="{
              trigger: 'py-2 text-xs font-bold uppercase tracking-wider text-neutral-500',
              body: 'pb-2'
            }"
            class="max-h-[600px] overflow-y-auto pr-1"
          >
            <template #custom-body>
              <div class="space-y-2">
                <div v-for="pawn in filteredCustomPawns" :key="pawn.id" class="relative group/pawn">
                  <InitiativePawn :pawn="pawn" class="group-hover/pawn:pr-10" />
                  <div
                    class="absolute top-1 right-2 flex flex-col gap-0.5 opacity-0 group-hover/pawn:opacity-100 transition-opacity"
                  >
                    <UButton
                      color="error"
                      variant="ghost"
                      icon="i-heroicons-trash"
                      size="xs"
                      @click="pawnStore.removePawn(pawn.id)"
                    />
                    <UButton
                      color="neutral"
                      variant="ghost"
                      icon="i-heroicons-pencil-square"
                      size="xs"
                      @click="openEditModal(pawn)"
                    />
                  </div>
                </div>
                <div v-if="filteredCustomPawns.length === 0" class="text-center py-6 text-neutral-400">
                  <UIcon name="i-heroicons-user-plus" class="w-6 h-6 mx-auto mb-2 opacity-20" />
                  <p class="text-xs">
                    {{ searchQuery ? 'Ничего не найдено' : 'Создайте свой первый павн' }}
                  </p>
                </div>
              </div>
            </template>

            <template #standard-body>
              <div class="space-y-2">
                <InitiativePawn
                  v-for="pawn in filteredStandardPawns"
                  :key="pawn.id"
                  :pawn="pawn"
                />
                <div v-if="filteredStandardPawns.length === 0" class="text-center py-6 text-neutral-400">
                  <UIcon name="i-heroicons-face-frown" class="w-6 h-6 mx-auto mb-2 opacity-20" />
                  <p class="text-xs">Ничего не найдено</p>
                </div>
              </div>
            </template>
          </UAccordion>
        </div>

        <div v-else-if="activeTab === 'conditions'" class="space-y-3">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">Библиотека состояний</h3>
          </div>
          <div class="max-h-[600px] overflow-y-auto pr-1">
            <ConditionsLibrary />
          </div>
        </div>
      </UCard>

      <UModal v-model:open="isPawnModalOpen">
        <template #content>
          <PawnForm @close="isPawnModalOpen = false" />
        </template>
      </UModal>

      <UModal v-model:open="isEditModalOpen">
        <template #content>
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
                Редактировать павн
              </h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-x-mark"
                class="-my-1"
                @click="isEditModalOpen = false"
              />
            </template>

            <PawnBaseForm ref="editFormRef" :initial-values="editingPawn" />

            <template #footer>
              <UButton color="neutral" variant="ghost" label="Отмена" @click="isEditModalOpen = false" />
              <UButton color="primary" label="Сохранить изменения" :disabled="!editFormRef?.form?.name" @click="handleUpdatePawn" />
            </template>
          </UCard>
        </template>
      </UModal>
    </aside>

  </div>
</template>
