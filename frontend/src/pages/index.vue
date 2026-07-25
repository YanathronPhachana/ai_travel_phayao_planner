<script setup lang="ts">
import { onMounted } from 'vue'
import { useSEO } from '@/composables/useSEO'
import { useTripStore } from '@/stores/use-trip-store'
import { useTripExpenseStore } from '@/stores/use-trip-expense-store'
import { useAccommodationStore } from '@/stores/use-accommodation-store'
import { usePackingItemStore } from '@/stores/use-packing-item-store'

useSEO({
  title: 'แดชบอร์ด - AI Travel Phayao Planner',
  description: 'ภาพรวมการวางแผนท่องเที่ยวพะเยา',
  keywords: ['dashboard', 'travel', 'phayao', 'trips'],
})

const tripStore = useTripStore()
const expenseStore = useTripExpenseStore()
const accommodationStore = useAccommodationStore()
const packingStore = usePackingItemStore()

onMounted(async () => {
  await tripStore.fetchTrips()
  if (tripStore.trips.length > 0) {
    const latest = tripStore.trips[0]
    await Promise.all([
      expenseStore.fetchExpenses(latest.id),
      expenseStore.fetchSummary(latest.id),
      accommodationStore.fetchAccommodations(latest.id),
      packingStore.fetchItems(latest.id),
    ])
  }
})

function formatAmount(amount: number) {
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { dateStyle: 'medium' })
}

const totalExpenses = computed(() => expenseStore.summary?.total ?? 0)
const checkedItems = computed(() => packingStore.items.filter(i => i.isChecked).length)
const totalItems = computed(() => packingStore.items.length)
</script>

<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">แดชบอร์ด</h1>

    <VRow class="mb-6">
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="primary" variant="tonal" size="48">
              <VIcon icon="ri-map-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">จำนวนทริป</div>
              <div class="text-h5 font-weight-bold text-primary">
                {{ tripStore.trips.length }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="error" variant="tonal" size="48">
              <VIcon icon="ri-money-cny-circle-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">ค่าใช้จ่ายทั้งหมด</div>
              <div class="text-h5 font-weight-bold text-error">
                ฿{{ formatAmount(totalExpenses) }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="info" variant="tonal" size="48">
              <VIcon icon="ri-hotel-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">ที่พัก</div>
              <div class="text-h5 font-weight-bold text-info">
                {{ accommodationStore.accommodations.length }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="success" variant="tonal" size="48">
              <VIcon icon="ri-suitcase-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">ของใช้จำเป็น</div>
              <div class="text-h5 font-weight-bold text-success">
                {{ checkedItems }}/{{ totalItems }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12" md="6">
        <VCard title="ทริปล่าสุด">
          <VList lines="two">
            <VListItem
              v-for="trip in tripStore.trips.slice(0, 5)"
              :key="trip.id"
            >
              <template #prepend>
                <VAvatar color="primary" variant="tonal" size="36">
                  <VIcon icon="ri-map-pin-line" size="18" />
                </VAvatar>
              </template>
              <VListItemTitle>{{ trip.name }}</VListItemTitle>
              <VListItemSubtitle>{{ formatDate(trip.startDate) }} - {{ formatDate(trip.endDate) }}</VListItemSubtitle>
            </VListItem>
            <VListItem v-if="tripStore.trips.length === 0" class="text-center text-medium-emphasis py-4">
              ยังไม่มีทริป
            </VListItem>
          </VList>
          <VCardActions>
            <RouterLink :to="{ name: 'trip-page' }">
              <VBtn variant="text" size="small">ดูทั้งหมด</VBtn>
            </RouterLink>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
