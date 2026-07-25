<script setup lang="ts">
import { useSEO } from '@/composables/useSEO'
import { useTripStore } from '@/stores/use-trip-store'
import type { CreateTripBody, Trip, UpdateTripBody } from '@/models'

useSEO({
  title: 'จัดการทริป',
  description: 'จัดการแผนการเดินทาง',
  keywords: ['trips', 'travel', 'phayao'],
})

const tripStore = useTripStore()
const { trips, isLoading, error } = storeToRefs(tripStore)

const dialog = ref(false)
const deleteDialog = ref(false)
const isSubmitting = ref(false)
const editingTrip = ref<Trip | null>(null)
const deletingTrip = ref<Trip | null>(null)

const form = ref<CreateTripBody & UpdateTripBody>({
  name: '',
  startDate: '',
  endDate: '',
  totalBudget: undefined,
  notes: '',
  destinationIds: [],
})

function openCreate() {
  editingTrip.value = null
  form.value = { name: '', startDate: '', endDate: '', totalBudget: undefined, notes: '', destinationIds: [] }
  dialog.value = true
}

function openEdit(trip: Trip) {
  editingTrip.value = trip
  form.value = {
    name: trip.name,
    startDate: trip.startDate,
    endDate: trip.endDate,
    totalBudget: trip.totalBudget ?? undefined,
    notes: trip.notes,
    destinationIds: trip.destinationIds,
  }
  dialog.value = true
}

function openDelete(trip: Trip) {
  deletingTrip.value = trip
  deleteDialog.value = true
}

async function submit() {
  isSubmitting.value = true
  try {
    if (editingTrip.value)
      await tripStore.updateTrip(editingTrip.value.id, form.value)
    else
      await tripStore.createTrip(form.value as CreateTripBody)
    dialog.value = false
  }
  finally {
    isSubmitting.value = false
  }
}

async function confirmDelete() {
  if (!deletingTrip.value) return
  isSubmitting.value = true
  try {
    await tripStore.deleteTrip(deletingTrip.value.id)
    deleteDialog.value = false
  }
  finally {
    isSubmitting.value = false
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { dateStyle: 'medium' })
}

function formatAmount(amount: number | null) {
  if (!amount) return '-'
  return '฿' + new Intl.NumberFormat('th-TH').format(amount)
}

onMounted(() => tripStore.fetchTrips())
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h5 font-weight-bold">จัดการทริป</h1>
      <VBtn color="primary" prepend-icon="ri-add-line" @click="openCreate">
        สร้างทริป
      </VBtn>
    </div>

    <VAlert v-if="error" type="error" class="mb-4" :text="error" closable />

    <VRow>
      <VCol
        v-for="trip in trips"
        :key="trip.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <VCard hover>
          <VCardItem>
            <VCardTitle>{{ trip.name }}</VCardTitle>
            <VCardSubtitle>
              {{ formatDate(trip.startDate) }} - {{ formatDate(trip.endDate) }}
            </VCardSubtitle>
          </VCardItem>
          <VCardText>
            <div class="text-caption text-medium-emphasis mb-2">
              งบประมาณ: <span class="font-weight-medium">{{ formatAmount(trip.totalBudget) }}</span>
            </div>
            <div v-if="trip.notes" class="text-caption text-medium-emphasis text-truncate">
              {{ trip.notes }}
            </div>
          </VCardText>
          <VCardActions>
            <VBtn variant="text" size="small" :to="{ name: 'trip-detail-page', params: { tripId: trip.id } }">
              รายละเอียด
            </VBtn>
            <VSpacer />
            <IconBtn @click="openEdit(trip)">
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn color="error" @click="openDelete(trip)">
              <VIcon icon="ri-delete-bin-line" />
            </IconBtn>
          </VCardActions>
        </VCard>
      </VCol>
      <VCol v-if="trips.length === 0 && !isLoading" cols="12" class="text-center text-medium-emphasis py-8">
        ยังไม่มีทริป กด "สร้างทริป" เพื่อเริ่มต้น
      </VCol>
    </VRow>

    <!-- Create / Edit Dialog -->
    <VDialog v-model="dialog" max-width="520" persistent>
      <VCard :title="editingTrip ? 'แก้ไขทริป' : 'สร้างทริปใหม่'">
        <VCardText>
          <VForm @submit.prevent="submit">
            <VTextField v-model="form.name" label="ชื่อทริป" class="mb-4" required />
            <VRow>
              <VCol cols="6">
                <VTextField v-model="form.startDate" label="วันเริ่มต้น" type="date" required />
              </VCol>
              <VCol cols="6">
                <VTextField v-model="form.endDate" label="วันสิ้นสุด" type="date" required />
              </VCol>
            </VRow>
            <VTextField v-model.number="form.totalBudget" label="งบประมาณ (บาท)" type="number" class="mt-4" />
            <VTextarea v-model="form.notes" label="หมายเหตุ" rows="2" class="mt-4" />
          </VForm>
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="dialog = false">ยกเลิก</VBtn>
          <VBtn color="primary" :loading="isSubmitting" @click="submit">
            {{ editingTrip ? 'บันทึก' : 'สร้าง' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard title="ลบทริป">
        <VCardText>
          ต้องการลบทริป <strong>{{ deletingTrip?.name }}</strong> ใช่หรือไม่?
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="deleteDialog = false">ยกเลิก</VBtn>
          <VBtn color="error" :loading="isSubmitting" @click="confirmDelete">ลบ</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
