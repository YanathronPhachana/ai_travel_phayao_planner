import { defineStore } from 'pinia'
import { tripApi } from '@/apis/trip-api'
import type { CreateTripBody, Trip, UpdateTripBody } from '@/models'

export const useTripStore = defineStore('TripStore', () => {
  const trips = ref<Trip[]>([])
  const currentTrip = ref<Trip | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTrips() {
    isLoading.value = true
    error.value = null
    try {
      const res = await tripApi.list()
      trips.value = res.data
    }
    catch (e: any) {
      error.value = e.message
    }
    finally {
      isLoading.value = false
    }
  }

  async function fetchTrip(id: string) {
    isLoading.value = true
    error.value = null
    try {
      const res = await tripApi.get(id)
      currentTrip.value = res.data
      return res.data
    }
    catch (e: any) {
      error.value = e.message
      return null
    }
    finally {
      isLoading.value = false
    }
  }

  async function createTrip(body: CreateTripBody) {
    const res = await tripApi.create(body)
    trips.value.unshift(res.data)
    return res.data
  }

  async function updateTrip(id: string, body: UpdateTripBody) {
    const res = await tripApi.update(id, body)
    const idx = trips.value.findIndex(t => t.id === id)
    if (idx !== -1) trips.value[idx] = res.data
    if (currentTrip.value?.id === id) currentTrip.value = res.data
    return res.data
  }

  async function deleteTrip(id: string) {
    await tripApi.remove(id)
    trips.value = trips.value.filter(t => t.id !== id)
    if (currentTrip.value?.id === id) currentTrip.value = null
  }

  return { trips, currentTrip, isLoading, error, fetchTrips, fetchTrip, createTrip, updateTrip, deleteTrip }
})
