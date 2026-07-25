import { defineStore } from 'pinia'
import { packingItemApi } from '@/apis/packing-item-api'
import type { CreatePackingItemBody, PackingItem, UpdatePackingItemBody } from '@/models'

export const usePackingItemStore = defineStore('PackingItemStore', () => {
  const items = ref<PackingItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchItems(tripId: string) {
    isLoading.value = true
    error.value = null
    try {
      const res = await packingItemApi.list(tripId)
      items.value = res.data
    }
    catch (e: any) {
      error.value = e.message
    }
    finally {
      isLoading.value = false
    }
  }

  async function createItem(tripId: string, body: CreatePackingItemBody) {
    const res = await packingItemApi.create(tripId, body)
    items.value.unshift(res.data)
    return res.data
  }

  async function updateItem(tripId: string, id: string, body: UpdatePackingItemBody) {
    const res = await packingItemApi.update(tripId, id, body)
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) items.value[idx] = res.data
    return res.data
  }

  async function deleteItem(tripId: string, id: string) {
    await packingItemApi.remove(tripId, id)
    items.value = items.value.filter(i => i.id !== id)
  }

  return { items, isLoading, error, fetchItems, createItem, updateItem, deleteItem }
})
