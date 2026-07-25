<script setup lang="ts">
import { useTransactionStore } from '@/stores/use-transaction-store'
import type { CreateTransactionBody, Transaction } from '@/models'

const transactionStore = useTransactionStore()
const { transactions, summary, isLoading, error } = storeToRefs(transactionStore)

const categories = [
  { value: 'food', label: 'อาหาร', icon: 'ri-restaurant-line', type: 'expense' },
  { value: 'transport', label: 'เดินทาง', icon: 'ri-roadster-line', type: 'expense' },
  { value: 'utilities', label: 'สาธารณูปโภค', icon: 'ri-flashlight-line', type: 'expense' },
  { value: 'housing', label: 'ที่อยู่อาศัย', icon: 'ri-home-4-line', type: 'expense' },
  { value: 'entertainment', label: 'บันเทิง', icon: 'ri-film-line', type: 'expense' },
  { value: 'health', label: 'สุขภาพ', icon: 'ri-heart-pulse-line', type: 'expense' },
  { value: 'education', label: 'การศึกษา', icon: 'ri-book-open-line', type: 'expense' },
  { value: 'shopping', label: 'ช้อปปิ้ง', icon: 'ri-shopping-bag-line', type: 'expense' },
  { value: 'salary', label: 'เงินเดือน', icon: 'ri-money-dollar-circle-line', type: 'income' },
  { value: 'freelance', label: 'ฟรีแลนซ์', icon: 'ri-briefcase-line', type: 'income' },
  { value: 'investment', label: 'ลงทุน', icon: 'ri-line-chart-line', type: 'income' },
  { value: 'other', label: 'อื่นๆ', icon: 'ri-more-line', type: 'both' },
]

const filterType = ref<string | undefined>(undefined)

watch(filterType, (val) => {
  transactionStore.fetchTransactions(val)
})

const headers = [
  { title: 'วันที่', key: 'date' },
  { title: 'ประเภท', key: 'type' },
  { title: 'หมวดหมู่', key: 'category' },
  { title: 'รายละเอียด', key: 'description' },
  { title: 'จำนวนเงิน', key: 'amount' },
  { title: 'Action', key: 'action', sortable: false, align: 'end' as const },
]

// Dialog state
const dialog = ref(false)
const deleteDialog = ref(false)
const isSubmitting = ref(false)
const editingTransaction = ref<Transaction | null>(null)
const deletingTransaction = ref<Transaction | null>(null)

const form = ref<CreateTransactionBody>({
  type: 'expense',
  amount: 0,
  category: 'food',
  description: '',
  date: new Date().toISOString().slice(0, 10),
})

function openCreate() {
  editingTransaction.value = null
  form.value = {
    type: 'expense',
    amount: 0,
    category: 'food',
    description: '',
    date: new Date().toISOString().slice(0, 10),
  }
  dialog.value = true
}

function openEdit(transaction: Transaction) {
  editingTransaction.value = transaction
  form.value = {
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description,
    date: transaction.date,
  }
  dialog.value = true
}

function openDelete(transaction: Transaction) {
  deletingTransaction.value = transaction
  deleteDialog.value = true
}

async function submit() {
  isSubmitting.value = true
  try {
    if (editingTransaction.value)
      await transactionStore.updateTransaction(editingTransaction.value.id, form.value)
    else
      await transactionStore.createTransaction(form.value as CreateTransactionBody)
    dialog.value = false
  }
  finally {
    isSubmitting.value = false
  }
}

async function confirmDelete() {
  if (!deletingTransaction.value) return
  isSubmitting.value = true
  try {
    await transactionStore.deleteTransaction(deletingTransaction.value.id)
    deleteDialog.value = false
  }
  finally {
    isSubmitting.value = false
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { dateStyle: 'medium' })
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
}

function getCategoryLabel(category: string) {
  return categories.find(c => c.value === category)?.label ?? category
}

function getCategoryIcon(category: string) {
  return categories.find(c => c.value === category)?.icon ?? 'ri-more-line'
}

onMounted(async () => {
  await Promise.all([
    transactionStore.fetchTransactions(),
    transactionStore.fetchSummary(),
  ])
})
</script>

<template>
  <div>
    <!-- Summary Cards -->
    <VRow class="mb-6">
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="success" variant="tonal" size="48">
              <VIcon icon="ri-arrow-up-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">รายรับ</div>
              <div class="text-h5 font-weight-bold text-success">
                ฿{{ summary ? formatAmount(summary.totalIncome) : '0.00' }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="error" variant="tonal" size="48">
              <VIcon icon="ri-arrow-down-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">รายจ่าย</div>
              <div class="text-h5 font-weight-bold text-error">
                ฿{{ summary ? formatAmount(summary.totalExpense) : '0.00' }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar
              :color="summary && summary.balance >= 0 ? 'primary' : 'error'"
              variant="tonal"
              size="48"
            >
              <VIcon :icon="summary && summary.balance >= 0 ? 'ri-wallet-3-line' : 'ri-alert-line'" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">คงเหลือ</div>
              <div class="text-h5 font-weight-bold" :class="summary && summary.balance >= 0 ? 'text-primary' : 'text-error'">
                ฿{{ summary ? formatAmount(summary.balance) : '0.00' }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="info" variant="tonal" size="48">
              <VIcon icon="ri-list-check" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">รายการทั้งหมด</div>
              <div class="text-h5 font-weight-bold">{{ transactions.length }}</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Transactions Table -->
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center gap-4">
          <span class="text-h6">รายการเดินบัญชี</span>
          <div style="width: 160px">
            <VSelect
              v-model="filterType"
              :items="[{ title: 'ทั้งหมด', value: undefined }, { title: 'รายรับ', value: 'income' }, { title: 'รายจ่าย', value: 'expense' }]"
              density="compact"
              hide-details
              clearable
            />
          </div>
        </div>
        <VBtn
          color="primary"
          prepend-icon="ri-add-line"
          @click="openCreate"
        >
          เพิ่มรายการ
        </VBtn>
      </VCardTitle>

      <VDivider />

      <VAlert
        v-if="error"
        type="error"
        class="ma-4"
        :text="error"
        closable
      />

      <VDataTable
        :headers="headers"
        :items="transactions"
        :loading="isLoading"
        hover
      >
        <template #item.date="{ item }">
          {{ formatDate(item.date) }}
        </template>

        <template #item.type="{ item }">
          <VChip
            :color="item.type === 'income' ? 'success' : 'error'"
            size="small"
            variant="tonal"
          >
            {{ item.type === 'income' ? 'รายรับ' : 'รายจ่าย' }}
          </VChip>
        </template>

        <template #item.category="{ item }">
          <div class="d-flex align-center gap-2">
            <VIcon :icon="getCategoryIcon(item.category)" size="18" />
            {{ getCategoryLabel(item.category) }}
          </div>
        </template>

        <template #item.amount="{ item }">
          <span :class="item.type === 'income' ? 'text-success' : 'text-error'" class="font-weight-medium">
            {{ item.type === 'income' ? '+' : '-' }}฿{{ formatAmount(item.amount) }}
          </span>
        </template>

        <template #item.action="{ item }">
          <IconBtn @click="openEdit(item)">
            <VTooltip activator="parent" location="top">แก้ไข</VTooltip>
            <VIcon icon="ri-pencil-line" />
          </IconBtn>
          <IconBtn color="error" @click="openDelete(item)">
            <VTooltip activator="parent" location="top">ลบ</VTooltip>
            <VIcon icon="ri-delete-bin-line" />
          </IconBtn>
        </template>

        <template #no-data>
          <div class="text-center py-8 text-disabled">
            ยังไม่มีรายการ กด "เพิ่มรายการ" เพื่อเริ่มบันทึก
          </div>
        </template>
      </VDataTable>
    </VCard>

    <!-- Create / Edit Dialog -->
    <VDialog v-model="dialog" max-width="560" persistent>
      <VCard :title="editingTransaction ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'">
        <VCardText>
          <VForm @submit.prevent="submit">
            <VRow>
              <VCol cols="6">
                <VSelect
                  v-model="form.type"
                  label="ประเภท"
                  :items="[
                    { title: 'รายรับ', value: 'income' },
                    { title: 'รายจ่าย', value: 'expense' },
                  ]"
                  prepend-inner-icon="ri-swap-line"
                  required
                />
              </VCol>
              <VCol cols="6">
                <VTextField
                  v-model="form.date"
                  label="วันที่"
                  type="date"
                  prepend-inner-icon="ri-calendar-line"
                  required
                />
              </VCol>
            </VRow>
            <VTextField
              v-model.number="form.amount"
              label="จำนวนเงิน (บาท)"
              type="number"
              prepend-inner-icon="ri-money-dollar-circle-line"
              min="0"
              step="0.01"
              class="mb-4"
              required
            />
            <VSelect
              v-model="form.category"
              label="หมวดหมู่"
              :items="categories
                .filter(c => c.type === form.type || c.type === 'both')
                .map(c => ({ title: c.label, value: c.value, prependIcon: c.icon }))"
              prepend-inner-icon="ri-price-tag-3-line"
              class="mb-4"
              required
            />
            <VTextField
              v-model="form.description"
              label="รายละเอียด"
              prepend-inner-icon="ri-file-text-line"
              class="mb-4"
            />
          </VForm>
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="dialog = false">ยกเลิก</VBtn>
          <VBtn
            color="primary"
            :loading="isSubmitting"
            @click="submit"
          >
            {{ editingTransaction ? 'บันทึก' : 'เพิ่ม' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard title="ลบรายการ">
        <VCardText>
          แน่ใจหรือว่าต้องการลบรายการนี้ ({{ formatAmount(deletingTransaction?.amount ?? 0) }} บาท)? การกระทำนี้ไม่สามารถย้อนกลับได้
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="deleteDialog = false">ยกเลิก</VBtn>
          <VBtn
            color="error"
            :loading="isSubmitting"
            @click="confirmDelete"
          >
            ลบ
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
