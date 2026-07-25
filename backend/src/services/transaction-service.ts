import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from '../domain/entities/transaction'
import { NotFoundError, ValidationError } from '../domain/errors'
import type { TransactionRepository } from '../domain/repositories/transaction-repository'

const VALID_CATEGORIES = [
  'food', 'transport', 'utilities', 'housing', 'entertainment',
  'health', 'education', 'shopping', 'salary', 'freelance',
  'investment', 'other',
]

const INCOME_CATEGORIES = ['salary', 'freelance', 'investment', 'other']
const EXPENSE_CATEGORIES = ['food', 'transport', 'utilities', 'housing', 'entertainment', 'health', 'education', 'shopping', 'other']

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository
  ) {}

  async listTransactions(type?: string): Promise<Transaction[]> {
    if (type === 'income' || type === 'expense') {
      return this.transactionRepository.findByType(type)
    }
    return this.transactionRepository.findAll()
  }

  async getTransaction(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id)
    if (!transaction) throw new NotFoundError('Transaction')
    return transaction
  }

  async listByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    return this.transactionRepository.findByDateRange(startDate, endDate)
  }

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    this.validateTransaction(input)

    return this.transactionRepository.create({
      type: input.type,
      amount: input.amount,
      category: input.category,
      description: input.description?.trim() ?? '',
      date: input.date,
    })
  }

  async updateTransaction(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    if (input.type !== undefined && !['income', 'expense'].includes(input.type)) {
      throw new ValidationError('type must be "income" or "expense"')
    }
    if (input.amount !== undefined && input.amount <= 0) {
      throw new ValidationError('amount must be positive')
    }
    if (input.category !== undefined && !VALID_CATEGORIES.includes(input.category)) {
      throw new ValidationError(`category must be one of: ${VALID_CATEGORIES.join(', ')}`)
    }
    if (input.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
      throw new ValidationError('date must be in YYYY-MM-DD format')
    }

    const updated = await this.transactionRepository.update(id, input)
    if (!updated) throw new NotFoundError('Transaction')
    return updated
  }

  async deleteTransaction(id: string): Promise<void> {
    const deleted = await this.transactionRepository.delete(id)
    if (!deleted) throw new NotFoundError('Transaction')
  }

  async getSummary(): Promise<{ totalIncome: number; totalExpense: number; balance: number; byCategory: Record<string, number> }> {
    const transactions = await this.transactionRepository.findAll()
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    const byCategory: Record<string, number> = {}
    for (const t of transactions) {
      byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount
    }
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense, byCategory }
  }

  private validateTransaction(input: CreateTransactionInput): void {
    if (!input.type || !['income', 'expense'].includes(input.type)) {
      throw new ValidationError('type must be "income" or "expense"')
    }
    if (!input.amount || input.amount <= 0) {
      throw new ValidationError('amount must be a positive number')
    }
    if (!input.category || !VALID_CATEGORIES.includes(input.category)) {
      throw new ValidationError(`category must be one of: ${VALID_CATEGORIES.join(', ')}`)
    }
    if (!input.date || !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
      throw new ValidationError('date must be in YYYY-MM-DD format')
    }
  }
}
