import { defineStore } from 'pinia'
import { transactionApi } from '@/apis/transaction-api'
import type { CreateTransactionBody, SummaryResponse, Transaction, UpdateTransactionBody } from '@/models'

export const useTransactionStore = defineStore('TransactionStore', () => {
  const transactions = ref<Transaction[]>([])
  const summary = ref<SummaryResponse['data'] | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTransactions(type?: string) {
    isLoading.value = true
    error.value = null
    try {
      const res = await transactionApi.list(type)
      transactions.value = res.data
    }
    catch (e: any) {
      error.value = e.message
    }
    finally {
      isLoading.value = false
    }
  }

  async function fetchSummary() {
    try {
      const res = await transactionApi.summary()
      summary.value = res.data
    }
    catch (e: any) {
      error.value = e.message
    }
  }

  async function createTransaction(body: CreateTransactionBody) {
    const res = await transactionApi.create(body)
    transactions.value.unshift(res.data)
    await fetchSummary()
    return res.data
  }

  async function updateTransaction(id: string, body: UpdateTransactionBody) {
    const res = await transactionApi.update(id, body)
    const idx = transactions.value.findIndex(t => t.id === id)
    if (idx !== -1) transactions.value[idx] = res.data
    await fetchSummary()
    return res.data
  }

  async function deleteTransaction(id: string) {
    await transactionApi.remove(id)
    transactions.value = transactions.value.filter(t => t.id !== id)
    await fetchSummary()
  }

  return {
    transactions, summary, isLoading, error,
    fetchTransactions, fetchSummary,
    createTransaction, updateTransaction, deleteTransaction,
  }
})
