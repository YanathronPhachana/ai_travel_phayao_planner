import { defineStore } from 'pinia'
import { tripExpenseApi } from '@/apis/trip-expense-api'
import type { CreateTripExpenseBody, ExpenseSummary, TripExpense, UpdateTripExpenseBody } from '@/models'

export const useTripExpenseStore = defineStore('TripExpenseStore', () => {
  const expenses = ref<TripExpense[]>([])
  const summary = ref<ExpenseSummary | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchExpenses(tripId: string) {
    isLoading.value = true
    error.value = null
    try {
      const res = await tripExpenseApi.list(tripId)
      expenses.value = res.data
    }
    catch (e: any) {
      error.value = e.message
    }
    finally {
      isLoading.value = false
    }
  }

  async function fetchSummary(tripId: string) {
    try {
      const res = await tripExpenseApi.summary(tripId)
      summary.value = res.data
    }
    catch (e: any) {
      error.value = e.message
    }
  }

  async function createExpense(tripId: string, body: CreateTripExpenseBody) {
    error.value = null
    try {
      const res = await tripExpenseApi.create(tripId, body)
      expenses.value.unshift(res.data)
      await fetchSummary(tripId)
      return res.data
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  async function updateExpense(tripId: string, id: string, body: UpdateTripExpenseBody) {
    error.value = null
    try {
      const res = await tripExpenseApi.update(tripId, id, body)
      const idx = expenses.value.findIndex(e => e.id === id)
      if (idx !== -1) expenses.value[idx] = res.data
      await fetchSummary(tripId)
      return res.data
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  async function deleteExpense(tripId: string, id: string) {
    error.value = null
    try {
      await tripExpenseApi.remove(tripId, id)
      expenses.value = expenses.value.filter(e => e.id !== id)
      await fetchSummary(tripId)
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  return { expenses, summary, isLoading, error, fetchExpenses, fetchSummary, createExpense, updateExpense, deleteExpense }
})
