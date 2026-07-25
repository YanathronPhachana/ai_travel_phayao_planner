import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from '../entities/transaction'

export interface TransactionRepository {
  findAll(): Promise<Transaction[]>
  findById(id: string): Promise<Transaction | null>
  findByDateRange(startDate: string, endDate: string): Promise<Transaction[]>
  findByType(type: 'income' | 'expense'): Promise<Transaction[]>
  create(input: CreateTransactionInput): Promise<Transaction>
  update(id: string, input: UpdateTransactionInput): Promise<Transaction | null>
  delete(id: string): Promise<boolean>
}
