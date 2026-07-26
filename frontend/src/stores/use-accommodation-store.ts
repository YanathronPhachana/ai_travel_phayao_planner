import { defineStore } from 'pinia'
import { accommodationApi } from '@/apis/accommodation-api'
import type { Accommodation, CreateAccommodationBody, UpdateAccommodationBody } from '@/models'

export const useAccommodationStore = defineStore('AccommodationStore', () => {
  const accommodations = ref<Accommodation[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAccommodations(tripId: string) {
    isLoading.value = true
    error.value = null
    try {
      const res = await accommodationApi.list(tripId)
      accommodations.value = res.data
    }
    catch (e: any) {
      error.value = e.message
    }
    finally {
      isLoading.value = false
    }
  }

  async function createAccommodation(tripId: string, body: CreateAccommodationBody) {
    error.value = null
    try {
      const res = await accommodationApi.create(tripId, body)
      accommodations.value.unshift(res.data)
      return res.data
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  async function updateAccommodation(tripId: string, id: string, body: UpdateAccommodationBody) {
    error.value = null
    try {
      const res = await accommodationApi.update(tripId, id, body)
      const idx = accommodations.value.findIndex(a => a.id === id)
      if (idx !== -1) accommodations.value[idx] = res.data
      return res.data
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  async function deleteAccommodation(tripId: string, id: string) {
    error.value = null
    try {
      await accommodationApi.remove(tripId, id)
      accommodations.value = accommodations.value.filter(a => a.id !== id)
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  return { accommodations, isLoading, error, fetchAccommodations, createAccommodation, updateAccommodation, deleteAccommodation }
})
