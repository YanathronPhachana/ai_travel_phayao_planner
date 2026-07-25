<script setup lang="ts">
import { useSEO } from '@/composables/useSEO'
import { useTripStore } from '@/stores/use-trip-store'
import { useTripExpenseStore } from '@/stores/use-trip-expense-store'
import { useAccommodationStore } from '@/stores/use-accommodation-store'
import { usePackingItemStore } from '@/stores/use-packing-item-store'
import { expenseCategoryLabels } from '@/models/trip-expense'
import { accommodationTypeLabels } from '@/models/accommodation'
import { packingCategoryLabels } from '@/models/packing-item'
import type { CreateTripExpenseBody, UpdateTripExpenseBody, TripExpense, CreateAccommodationBody, UpdateAccommodationBody, Accommodation, CreatePackingItemBody, UpdatePackingItemBody, PackingItem } from '@/models'

const route = useRoute()
const tripId = computed(() => route.params.tripId as string)

useSEO({
  title: 'รายละเอียดทริป',
  description: 'จัดการค่าใช้จ่าย ที่พัก ของใช้ และสถานที่ท่องเที่ยวในทริป',
})

const tripStore = useTripStore()
const expenseStore = useTripExpenseStore()
const accommodationStore = useAccommodationStore()
const packingStore = usePackingItemStore()

const activeTab = ref('expenses')

onMounted(async () => {
  await tripStore.fetchTrip(tripId.value)
  await loadTabData()
})

watch(tripId, async () => {
  await tripStore.fetchTrip(tripId.value)
  await loadTabData()
})

watch(activeTab, async () => {
  await loadTabData()
})

async function loadTabData() {
  if (activeTab.value === 'expenses') {
    await Promise.all([expenseStore.fetchExpenses(tripId.value), expenseStore.fetchSummary(tripId.value)])
  } else if (activeTab.value === 'accommodations') {
    await accommodationStore.fetchAccommodations(tripId.value)
  } else if (activeTab.value === 'packing') {
    await packingStore.fetchItems(tripId.value)
  }
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatDate(iso: string | null) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('th-TH', { dateStyle: 'medium' })
}

// Expense dialog
const expenseDialog = ref(false)
const isSubmitting = ref(false)
const editingExpense = ref<TripExpense | null>(null)
const expenseForm = ref<CreateTripExpenseBody & UpdateTripExpenseBody>({
  tripId: '', category: 'food', itemName: '', amount: 0, date: '', notes: '',
})

function openCreateExpense() {
  editingExpense.value = null
  expenseForm.value = { tripId: tripId.value, category: 'food', itemName: '', amount: 0, date: new Date().toISOString().split('T')[0], notes: '' }
  expenseDialog.value = true
}

function openEditExpense(expense: TripExpense) {
  editingExpense.value = expense
  expenseForm.value = {
    category: expense.category,
    itemName: expense.itemName,
    amount: expense.amount,
    date: expense.date,
    notes: expense.notes,
  }
  expenseDialog.value = true
}

async function submitExpense() {
  isSubmitting.value = true
  try {
    if (editingExpense.value)
      await expenseStore.updateExpense(tripId.value, editingExpense.value.id, expenseForm.value)
    else
      await expenseStore.createExpense(tripId.value, expenseForm.value as CreateTripExpenseBody)
    expenseDialog.value = false
  } finally { isSubmitting.value = false }
}

async function deleteExpense(id: string) {
  await expenseStore.deleteExpense(tripId.value, id)
}

// Accommodation dialog
const accDialog = ref(false)
const editingAcc = ref<Accommodation | null>(null)
const accForm = ref<CreateAccommodationBody & UpdateAccommodationBody>({
  tripId: '', name: '', type: 'hotel', pricePerNight: undefined, checkIn: '', checkOut: '', totalCost: undefined, address: '', phone: '', notes: '',
})

function openCreateAcc() {
  editingAcc.value = null
  accForm.value = { tripId: tripId.value, name: '', type: 'hotel', pricePerNight: undefined, checkIn: '', checkOut: '', totalCost: undefined, address: '', phone: '', notes: '' }
  accDialog.value = true
}

function openEditAcc(acc: Accommodation) {
  editingAcc.value = acc
  accForm.value = {
    name: acc.name,
    type: acc.type,
    pricePerNight: acc.pricePerNight ?? undefined,
    checkIn: acc.checkIn ?? '',
    checkOut: acc.checkOut ?? '',
    totalCost: acc.totalCost ?? undefined,
    address: acc.address,
    phone: acc.phone,
    notes: acc.notes,
  }
  accDialog.value = true
}

async function submitAcc() {
  isSubmitting.value = true
  try {
    if (editingAcc.value)
      await accommodationStore.updateAccommodation(tripId.value, editingAcc.value.id, accForm.value)
    else
      await accommodationStore.createAccommodation(tripId.value, accForm.value as CreateAccommodationBody)
    accDialog.value = false
  } finally { isSubmitting.value = false }
}

async function deleteAcc(id: string) {
  await accommodationStore.deleteAccommodation(tripId.value, id)
}

// Packing dialog
const packDialog = ref(false)
const editingPack = ref<PackingItem | null>(null)
const packForm = ref<CreatePackingItemBody & UpdatePackingItemBody>({
  tripId: '', category: 'clothing', itemName: '', quantity: undefined, notes: '',
})

function openCreatePack() {
  editingPack.value = null
  packForm.value = { tripId: tripId.value, category: 'clothing', itemName: '', quantity: undefined, notes: '' }
  packDialog.value = true
}

function openEditPack(item: PackingItem) {
  editingPack.value = item
  packForm.value = {
    category: item.category,
    itemName: item.itemName,
    quantity: item.quantity ?? undefined,
    notes: item.notes,
  }
  packDialog.value = true
}

async function submitPack() {
  isSubmitting.value = true
  try {
    if (editingPack.value)
      await packingStore.updateItem(tripId.value, editingPack.value.id, packForm.value)
    else
      await packingStore.createItem(tripId.value, packForm.value as CreatePackingItemBody)
    packDialog.value = false
  } finally { isSubmitting.value = false }
}

async function deletePack(id: string) {
  await packingStore.deleteItem(tripId.value, id)
}

async function toggleCheck(item: PackingItem) {
  await packingStore.updateItem(tripId.value, item.id, { isChecked: !item.isChecked })
}

const checkedCount = computed(() => packingStore.items.filter(i => i.isChecked).length)
const totalPackItems = computed(() => packingStore.items.length)
const progressPercent = computed(() => totalPackItems.value > 0 ? Math.round((checkedCount.value / totalPackItems.value) * 100) : 0)
</script>

<template>
  <div>
    <div class="d-flex align-center mb-4">
      <VBtn icon variant="text" :to="{ name: 'trip-page' }" class="mr-2">
        <VIcon icon="ri-arrow-left-line" />
      </VBtn>
      <div>
        <h1 class="text-h5 font-weight-bold">{{ tripStore.currentTrip?.name || 'รายละเอียดทริป' }}</h1>
        <div class="text-caption text-medium-emphasis">
          {{ formatDate(tripStore.currentTrip?.startDate) }} - {{ formatDate(tripStore.currentTrip?.endDate) }}
          <span v-if="tripStore.currentTrip?.totalBudget"> | งบประมาณ ฿{{ formatAmount(tripStore.currentTrip.totalBudget) }}</span>
        </div>
      </div>
    </div>

    <VTabs v-model="activeTab" class="mb-4">
      <VTab value="expenses">
        <VIcon icon="ri-money-cny-circle-line" class="mr-2" />ค่าใช้จ่าย
      </VTab>
      <VTab value="accommodations">
        <VIcon icon="ri-hotel-line" class="mr-2" />ที่พัก
      </VTab>
      <VTab value="packing">
        <VIcon icon="ri-suitcase-line" class="mr-2" />ของใช้
      </VTab>
      <VTab value="destinations">
        <VIcon icon="ri-map-pin-line" class="mr-2" />สถานที่
      </VTab>
    </VTabs>

    <!-- Expenses Tab -->
    <div v-if="activeTab === 'expenses'">
      <VRow class="mb-4">
        <VCol cols="12" sm="4">
          <VCard>
            <VCardText>
              <div class="text-caption text-medium-emphasis">ค่าใช้จ่ายรวม</div>
              <div class="text-h4 font-weight-bold text-error">฿{{ formatAmount(expenseStore.summary?.total ?? 0) }}</div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol v-for="(amount, cat) in (expenseStore.summary?.byCategory ?? {})" :key="cat" cols="12" sm="4">
          <VCard>
            <VCardText>
              <div class="text-caption text-medium-emphasis">{{ expenseCategoryLabels[cat as keyof typeof expenseCategoryLabels] || cat }}</div>
              <div class="text-h6 font-weight-bold">฿{{ formatAmount(amount) }}</div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <div class="d-flex justify-end mb-4">
        <VBtn color="primary" prepend-icon="ri-add-line" @click="openCreateExpense">เพิ่มค่าใช้จ่าย</VBtn>
      </div>

      <VDataTable :items="expenseStore.expenses" :headers="[
        { title: 'รายการ', key: 'itemName' },
        { title: 'หมวดหมู่', key: 'category' },
        { title: 'จำนวนเงิน', key: 'amount' },
        { title: 'วันที่', key: 'date' },
        { title: 'จัดการ', key: 'action', sortable: false, align: 'end' },
      ]" :loading="expenseStore.isLoading">
        <template #item.category="{ item }">
          {{ expenseCategoryLabels[item.category] || item.category }}
        </template>
        <template #item.amount="{ item }">
          <span class="font-weight-medium">฿{{ formatAmount(item.amount) }}</span>
        </template>
        <template #item.date="{ item }">
          {{ formatDate(item.date) }}
        </template>
        <template #item.action="{ item }">
          <IconBtn @click="openEditExpense(item)"><VIcon icon="ri-pencil-line" /></IconBtn>
          <IconBtn color="error" @click="deleteExpense(item.id)"><VIcon icon="ri-delete-bin-line" /></IconBtn>
        </template>
      </VDataTable>
    </div>

    <!-- Accommodations Tab -->
    <div v-if="activeTab === 'accommodations'">
      <div class="d-flex justify-end mb-4">
        <VBtn color="primary" prepend-icon="ri-add-line" @click="openCreateAcc">เพิ่มที่พัก</VBtn>
      </div>

      <VRow>
        <VCol v-for="acc in accommodationStore.accommodations" :key="acc.id" cols="12" sm="6" lg="4">
          <VCard>
            <VCardItem>
              <VCardTitle>{{ acc.name }}</VCardTitle>
              <VCardSubtitle>{{ accommodationTypeLabels[acc.type] }}</VCardSubtitle>
            </VCardItem>
            <VCardText>
              <div v-if="acc.pricePerNight" class="mb-1">ราคา/คืน: ฿{{ formatAmount(acc.pricePerNight) }}</div>
              <div v-if="acc.checkIn || acc.checkOut" class="mb-1">
                เข้าพัก: {{ formatDate(acc.checkIn) }} - {{ formatDate(acc.checkOut) }}
              </div>
              <div v-if="acc.totalCost" class="mb-1 font-weight-medium text-primary">รวม: ฿{{ formatAmount(acc.totalCost) }}</div>
              <div v-if="acc.address" class="text-caption text-medium-emphasis text-truncate">{{ acc.address }}</div>
              <div v-if="acc.phone" class="text-caption text-medium-emphasis">{{ acc.phone }}</div>
            </VCardText>
            <VCardActions>
              <VSpacer />
              <IconBtn @click="openEditAcc(acc)"><VIcon icon="ri-pencil-line" /></IconBtn>
              <IconBtn color="error" @click="deleteAcc(acc.id)"><VIcon icon="ri-delete-bin-line" /></IconBtn>
            </VCardActions>
          </VCard>
        </VCol>
        <VCol v-if="accommodationStore.accommodations.length === 0" cols="12" class="text-center text-medium-emphasis py-8">
          ยังไม่มีที่พัก
        </VCol>
      </VRow>
    </div>

    <!-- Packing Tab -->
    <div v-if="activeTab === 'packing'">
      <VCard class="mb-4">
        <VCardText>
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-h6">Checklist</span>
            <span class="text-h6 font-weight-bold text-success">{{ checkedCount }}/{{ totalPackItems }}</span>
          </div>
          <VProgressLinear v-model="progressPercent" color="success" height="12" rounded />
        </VCardText>
      </VCard>

      <div class="d-flex justify-end mb-4">
        <VBtn color="primary" prepend-icon="ri-add-line" @click="openCreatePack">เพิ่มของใช้</VBtn>
      </div>

      <VDataTable :items="packingStore.items" :headers="[
        { title: '', key: 'isChecked', sortable: false, width: '48' },
        { title: 'รายการ', key: 'itemName' },
        { title: 'หมวดหมู่', key: 'category' },
        { title: 'จำนวน', key: 'quantity' },
        { title: 'จัดการ', key: 'action', sortable: false, align: 'end' },
      ]" :loading="packingStore.isLoading">
        <template #item.isChecked="{ item }">
          <VCheckbox v-model="item.isChecked" hide-details density="compact" @update:model-value="toggleCheck(item)" />
        </template>
        <template #item.category="{ item }">
          {{ packingCategoryLabels[item.category] || item.category }}
        </template>
        <template #item.quantity="{ item }">
          {{ item.quantity ?? '-' }}
        </template>
        <template #item.action="{ item }">
          <IconBtn @click="openEditPack(item)"><VIcon icon="ri-pencil-line" /></IconBtn>
          <IconBtn color="error" @click="deletePack(item.id)"><VIcon icon="ri-delete-bin-line" /></IconBtn>
        </template>
      </VDataTable>
    </div>

    <!-- Destinations Tab -->
    <div v-if="activeTab === 'destinations'">
      <VAlert type="info" class="mb-4">
        สถานที่ท่องเที่ยวที่เลือกไว้สำหรับทริปนี้ จัดการสถานที่ท่องเที่ยวได้ที่เมนู "สถานที่ท่องเที่ยว"
      </VAlert>
      <VRow>
        <VCol v-for="destId in (tripStore.currentTrip?.destinationIds ?? [])" :key="destId" cols="12" sm="6" lg="4">
          <VCard>
            <VCardText>
              <div class="text-caption text-medium-emphasis">Destination ID</div>
              <div class="font-weight-medium">{{ destId }}</div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol v-if="(tripStore.currentTrip?.destinationIds ?? []).length === 0" cols="12" class="text-center text-medium-emphasis py-8">
          ยังไม่ได้เลือกสถานที่ท่องเที่ยว
        </VCol>
      </VRow>
    </div>

    <!-- Expense Dialog -->
    <VDialog v-model="expenseDialog" max-width="480" persistent>
      <VCard :title="editingExpense ? 'แก้ไขค่าใช้จ่าย' : 'เพิ่มค่าใช้จ่าย'">
        <VCardText>
          <VTextField v-model="expenseForm.itemName" label="รายการ" class="mb-4" required />
          <VSelect v-model="expenseForm.category" :items="Object.entries(expenseCategoryLabels).map(([k,v])=>({value:k,title:v}))" label="หมวดหมู่" class="mb-4" required />
          <VTextField v-model.number="expenseForm.amount" label="จำนวนเงิน" type="number" class="mb-4" required />
          <VTextField v-model="expenseForm.date" label="วันที่" type="date" class="mb-4" required />
          <VTextarea v-model="expenseForm.notes" label="หมายเหตุ" rows="2" />
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="expenseDialog = false">ยกเลิก</VBtn>
          <VBtn color="primary" :loading="isSubmitting" @click="submitExpense">{{ editingExpense ? 'บันทึก' : 'เพิ่ม' }}</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Accommodation Dialog -->
    <VDialog v-model="accDialog" max-width="520" persistent>
      <VCard :title="editingAcc ? 'แก้ไขที่พัก' : 'เพิ่มที่พัก'">
        <VCardText>
          <VTextField v-model="accForm.name" label="ชื่อที่พัก" class="mb-4" required />
          <VSelect v-model="accForm.type" :items="Object.entries(accommodationTypeLabels).map(([k,v])=>({value:k,title:v}))" label="ประเภท" class="mb-4" required />
          <VRow>
            <VCol cols="6"><VTextField v-model.number="accForm.pricePerNight" label="ราคา/คืน" type="number" /></VCol>
            <VCol cols="6"><VTextField v-model.number="accForm.totalCost" label="ราคารวม" type="number" /></VCol>
          </VRow>
          <VRow class="mt-2">
            <VCol cols="6"><VTextField v-model="accForm.checkIn" label="เข้าพัก" type="date" /></VCol>
            <VCol cols="6"><VTextField v-model="accForm.checkOut" label="ออก" type="date" /></VCol>
          </VRow>
          <VTextField v-model="accForm.address" label="ที่อยู่" class="mt-4" />
          <VTextField v-model="accForm.phone" label="เบอร์โทร" class="mt-4" />
          <VTextarea v-model="accForm.notes" label="หมายเหตุ" rows="2" class="mt-4" />
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="accDialog = false">ยกเลิก</VBtn>
          <VBtn color="primary" :loading="isSubmitting" @click="submitAcc">{{ editingAcc ? 'บันทึก' : 'เพิ่ม' }}</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Packing Dialog -->
    <VDialog v-model="packDialog" max-width="480" persistent>
      <VCard :title="editingPack ? 'แก้ไขของใช้' : 'เพิ่มของใช้'">
        <VCardText>
          <VTextField v-model="packForm.itemName" label="รายการ" class="mb-4" required />
          <VSelect v-model="packForm.category" :items="Object.entries(packingCategoryLabels).map(([k,v])=>({value:k,title:v}))" label="หมวดหมู่" class="mb-4" required />
          <VTextField v-model.number="packForm.quantity" label="จำนวน" type="number" class="mb-4" />
          <VTextarea v-model="packForm.notes" label="หมายเหตุ" rows="2" />
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="packDialog = false">ยกเลิก</VBtn>
          <VBtn color="primary" :loading="isSubmitting" @click="submitPack">{{ editingPack ? 'บันทึก' : 'เพิ่ม' }}</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
