<script setup lang="ts">
import { useSEO } from '@/composables/useSEO'
import { useDestinationStore } from '@/stores/use-destination-store'
import { destinationCategoryLabels } from '@/models/destination'
import type { CreateDestinationBody, Destination, UpdateDestinationBody } from '@/models'

useSEO({
  title: 'สถานที่ท่องเที่ยวในพะเยา',
  description: 'จัดการสถานที่ท่องเที่ยวในจังหวัดพะเยา',
  keywords: ['destinations', 'phayao', 'tourism', 'travel'],
})

const destinationStore = useDestinationStore()
const { destinations, isLoading, error } = storeToRefs(destinationStore)

const selectedCategory = ref<string | undefined>(undefined)

const dialog = ref(false)
const deleteDialog = ref(false)
const isSubmitting = ref(false)
const editingDestination = ref<Destination | null>(null)
const deletingDestination = ref<Destination | null>(null)

const form = ref<CreateDestinationBody & UpdateDestinationBody>({
  name: '',
  category: 'nature',
  description: '',
  location: '',
  imageUrl: '',
})

function openCreate() {
  editingDestination.value = null
  form.value = { name: '', category: 'nature', description: '', location: '', imageUrl: '' }
  dialog.value = true
}

function openEdit(destination: Destination) {
  editingDestination.value = destination
  form.value = {
    name: destination.name,
    category: destination.category,
    description: destination.description,
    location: destination.location,
    imageUrl: destination.imageUrl ?? '',
  }
  dialog.value = true
}

function openDelete(destination: Destination) {
  deletingDestination.value = destination
  deleteDialog.value = true
}

async function submit() {
  isSubmitting.value = true
  try {
    if (editingDestination.value)
      await destinationStore.updateDestination(editingDestination.value.id, form.value)
    else
      await destinationStore.createDestination(form.value as CreateDestinationBody)
    dialog.value = false
  }
  finally {
    isSubmitting.value = false
  }
}

async function confirmDelete() {
  if (!deletingDestination.value) return
  isSubmitting.value = true
  try {
    await destinationStore.deleteDestination(deletingDestination.value.id)
    deleteDialog.value = false
  }
  finally {
    isSubmitting.value = false
  }
}

const categoryColors: Record<string, string> = {
  nature: 'success',
  temple: 'warning',
  landmark: 'primary',
  restaurant: 'error',
  activity: 'info',
  waterfall: 'success',
  mountain: 'success',
  market: 'warning',
  other: 'secondary',
}

watch(selectedCategory, () => destinationStore.fetchDestinations(selectedCategory.value))

const destinationCategoryItems = computed(() => [
  { title: 'ทั้งหมด', value: undefined },
  ...Object.entries(destinationCategoryLabels).map(([k, v]) => ({ title: v, value: k })),
])

onMounted(() => destinationStore.fetchDestinations())
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h5 font-weight-bold">สถานที่ท่องเที่ยวในพะเยา</h1>
      <VBtn color="primary" prepend-icon="ri-add-line" @click="openCreate">
        เพิ่มสถานที่
      </VBtn>
    </div>

    <VAlert v-if="error" type="error" class="mb-4" :text="error" closable />

    <VSelect
      v-model="selectedCategory"
      :items="destinationCategoryItems"
      label="กรองตามหมวดหมู่"
      class="mb-4"
      style="max-width: 300px"
      clearable
    />

    <VRow>
      <VCol
        v-for="dest in destinations"
        :key="dest.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <VCard hover>
          <VImg
            v-if="dest.imageUrl"
            :src="dest.imageUrl"
            height="160"
            cover
          />
          <VCardItem>
            <template #prepend>
              <VAvatar :color="categoryColors[dest.category] || 'primary'" variant="tonal" size="36">
                <VIcon :icon="dest.category === 'temple' ? 'ri-building-line' : dest.category === 'restaurant' ? 'ri-restaurant-line' : 'ri-map-pin-line'" size="18" />
              </VAvatar>
            </template>
            <VCardTitle>{{ dest.name }}</VCardTitle>
            <VCardSubtitle>
              <VChip :color="categoryColors[dest.category] || 'primary'" size="small" label>
                {{ destinationCategoryLabels[dest.category] || dest.category }}
              </VChip>
            </VCardSubtitle>
          </VCardItem>
          <VCardText>
            <div v-if="dest.location" class="text-caption text-medium-emphasis mb-2">
              <VIcon icon="ri-map-pin-2-line" size="14" class="mr-1" />
              {{ dest.location }}
            </div>
            <div v-if="dest.description" class="text-body-2">{{ dest.description }}</div>
          </VCardText>
          <VCardActions>
            <VSpacer />
            <IconBtn @click="openEdit(dest)">
              <VTooltip activator="parent" location="top">แก้ไข</VTooltip>
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn color="error" @click="openDelete(dest)">
              <VTooltip activator="parent" location="top">ลบ</VTooltip>
              <VIcon icon="ri-delete-bin-line" />
            </IconBtn>
          </VCardActions>
        </VCard>
      </VCol>
      <VCol v-if="destinations.length === 0 && !isLoading" cols="12" class="text-center text-medium-emphasis py-8">
        ยังไม่มีสถานที่ท่องเที่ยว
      </VCol>
    </VRow>

    <!-- Create / Edit Dialog -->
    <VDialog v-model="dialog" max-width="520" persistent>
      <VCard :title="editingDestination ? 'แก้ไขสถานที่' : 'เพิ่มสถานที่ท่องเที่ยว'">
        <VCardText>
          <VForm @submit.prevent="submit">
            <VTextField v-model="form.name" label="ชื่อสถานที่" class="mb-4" required />
            <VSelect
              v-model="form.category"
              :items="Object.entries(destinationCategoryLabels).map(([k, v]) => ({ value: k, title: v }))"
              label="หมวดหมู่"
              class="mb-4"
              required
            />
            <VTextField v-model="form.location" label="ที่ตั้ง" class="mb-4" />
            <VTextField v-model="form.imageUrl" label="URL รูปภาพ" class="mb-4" />
            <VTextarea v-model="form.description" label="รายละเอียด" rows="3" />
          </VForm>
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="dialog = false">ยกเลิก</VBtn>
          <VBtn color="primary" :loading="isSubmitting" @click="submit">
            {{ editingDestination ? 'บันทึก' : 'เพิ่ม' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard title="ลบสถานที่">
        <VCardText>
          ต้องการลบ <strong>{{ deletingDestination?.name }}</strong> ใช่หรือไม่?
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="deleteDialog = false">ยกเลิก</VBtn>
          <VBtn color="error" :loading="isSubmitting" @click="confirmDelete">ลบ</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
