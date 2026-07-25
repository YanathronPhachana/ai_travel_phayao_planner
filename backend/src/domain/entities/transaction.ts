export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
}

export interface CreateTransactionInput {
  type: TransactionType
  amount: number
  category: string
  description?: string
  date: string
}

export interface UpdateTransactionInput {
  type?: TransactionType
  amount?: number
  category?: string
  description?: string
  date?: string
}
