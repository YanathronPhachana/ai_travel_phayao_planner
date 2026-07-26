import { defineStore } from 'pinia'
import { destinationApi } from '@/apis/destination-api'
import type { CreateDestinationBody, Destination, UpdateDestinationBody } from '@/models'

export const useDestinationStore = defineStore('DestinationStore', () => {
  const destinations = ref<Destination[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDestinations(category?: string) {
    isLoading.value = true
    error.value = null
    try {
      const res = await destinationApi.list(category)
      destinations.value = res.data
    }
    catch (e: any) {
      error.value = e.message
    }
    finally {
      isLoading.value = false
    }
  }

  async function createDestination(body: CreateDestinationBody) {
    error.value = null
    try {
      const res = await destinationApi.create(body)
      destinations.value.unshift(res.data)
      return res.data
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  async function updateDestination(id: string, body: UpdateDestinationBody) {
    error.value = null
    try {
      const res = await destinationApi.update(id, body)
      const idx = destinations.value.findIndex(d => d.id === id)
      if (idx !== -1) destinations.value[idx] = res.data
      return res.data
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  async function deleteDestination(id: string) {
    error.value = null
    try {
      await destinationApi.remove(id)
      destinations.value = destinations.value.filter(d => d.id !== id)
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  return { destinations, isLoading, error, fetchDestinations, createDestination, updateDestination, deleteDestination }
})
