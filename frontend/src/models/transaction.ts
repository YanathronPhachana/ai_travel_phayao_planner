export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
}

export interface CreateTransactionBody {
  type: 'income' | 'expense'
  amount: number
  category: string
  description?: string
  date: string
}

export interface UpdateTransactionBody {
  type?: 'income' | 'expense'
  amount?: number
  category?: string
  description?: string
  date?: string
}

export interface TransactionListResponse {
  data: Transaction[]
}

export interface TransactionResponse {
  data: Transaction
}

export interface SummaryResponse {
  data: {
    totalIncome: number
    totalExpense: number
    balance: number
    byCategory: Record<string, number>
  }
}
