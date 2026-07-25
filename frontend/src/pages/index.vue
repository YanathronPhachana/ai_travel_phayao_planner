<script setup lang="ts">
import { onMounted } from 'vue'
import { useSEO } from '@/composables/useSEO'
import { useTransactionStore } from '@/stores/use-transaction-store'

useSEO({
  title: 'แดชบอร์ด - NgernNgern ThongThong',
  description: 'ภาพรวมรายรับรายจ่ายส่วนตัว',
  keywords: ['dashboard', 'finance', 'personal'],
})

const transactionStore = useTransactionStore()

onMounted(async () => {
  await Promise.all([
    transactionStore.fetchTransactions(),
    transactionStore.fetchSummary(),
  ])
})

function formatAmount(amount: number) {
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
}
</script>

<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">แดชบอร์ด</h1>

    <VRow class="mb-6">
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="success" variant="tonal" size="48">
              <VIcon icon="ri-arrow-up-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">รายรับทั้งหมด</div>
              <div class="text-h5 font-weight-bold text-success">
                ฿{{ transactionStore.summary ? formatAmount(transactionStore.summary.totalIncome) : '0.00' }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="error" variant="tonal" size="48">
              <VIcon icon="ri-arrow-down-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">รายจ่ายทั้งหมด</div>
              <div class="text-h5 font-weight-bold text-error">
                ฿{{ transactionStore.summary ? formatAmount(transactionStore.summary.totalExpense) : '0.00' }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar
              :color="transactionStore.summary && transactionStore.summary.balance >= 0 ? 'primary' : 'error'"
              variant="tonal"
              size="48"
            >
              <VIcon :icon="transactionStore.summary && transactionStore.summary.balance >= 0 ? 'ri-wallet-3-line' : 'ri-alert-line'" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">คงเหลือ</div>
              <div class="text-h5 font-weight-bold" :class="transactionStore.summary && transactionStore.summary.balance >= 0 ? 'text-primary' : 'text-error'">
                ฿{{ transactionStore.summary ? formatAmount(transactionStore.summary.balance) : '0.00' }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="info" variant="tonal" size="48">
              <VIcon icon="ri-list-check" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">รายการทั้งหมด</div>
              <div class="text-h5 font-weight-bold">{{ transactionStore.transactions.length }}</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12" md="6">
        <VCard title="รายการล่าสุด">
          <VList lines="two">
            <VListItem
              v-for="txn in transactionStore.transactions.slice(0, 5)"
              :key="txn.id"
            >
              <template #prepend>
                <VAvatar
                  :color="txn.type === 'income' ? 'success' : 'error'"
                  variant="tonal"
                  size="36"
                >
                  <VIcon :icon="txn.type === 'income' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'" size="18" />
                </VAvatar>
              </template>
              <VListItemTitle>
                {{ txn.description || txn.category }}
                <span :class="txn.type === 'income' ? 'text-success' : 'text-error'" class="font-weight-medium">
                  {{ txn.type === 'income' ? '+' : '-' }}฿{{ formatAmount(txn.amount) }}
                </span>
              </VListItemTitle>
              <VListItemSubtitle>{{ new Date(txn.date).toLocaleDateString('th-TH') }}</VListItemSubtitle>
            </VListItem>
            <VListItem v-if="transactionStore.transactions.length === 0" class="text-center text-medium-emphasis py-4">
              ยังไม่มีรายการ
            </VListItem>
          </VList>
          <VCardActions>
            <RouterLink :to="{ name: 'transaction-page' }">
              <VBtn variant="text" size="small">ดูทั้งหมด</VBtn>
            </RouterLink>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
