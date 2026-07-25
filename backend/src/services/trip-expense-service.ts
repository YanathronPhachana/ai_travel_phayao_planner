import type { CreateTripExpenseInput, ExpenseSummary, TripExpense, UpdateTripExpenseInput } from '../domain/entities/trip-expense'
import { NotFoundError, ValidationError } from '../domain/errors'
import type { TripExpenseRepository } from '../domain/repositories/trip-expense-repository'
import type { TripRepository } from '../domain/repositories/trip-repository'

const VALID_CATEGORIES = ['transport', 'food', 'accommodation', 'activities', 'other']

export class TripExpenseService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly expenseRepository: TripExpenseRepository
  ) {}

  async listExpenses(tripId: string): Promise<TripExpense[]> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')
    return this.expenseRepository.findByTripId(tripId)
  }

  async getExpense(tripId: string, id: string): Promise<TripExpense> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')
    const expense = await this.expenseRepository.findById(id)
    if (!expense || expense.tripId !== tripId) throw new NotFoundError('TripExpense')
    return expense
  }

  async createExpense(tripId: string, input: CreateTripExpenseInput): Promise<TripExpense> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')

    if (!input.itemName?.trim()) throw new ValidationError('itemName is required')
    if (!input.category || !VALID_CATEGORIES.includes(input.category)) {
      throw new ValidationError(`category must be one of: ${VALID_CATEGORIES.join(', ')}`)
    }
    if (!input.amount || input.amount <= 0) {
      throw new ValidationError('amount must be a positive number')
    }
    if (!input.date || !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
      throw new ValidationError('date must be in YYYY-MM-DD format')
    }

    return this.expenseRepository.create({
      tripId,
      category: input.category,
      itemName: input.itemName.trim(),
      amount: input.amount,
      date: input.date,
      notes: input.notes?.trim() ?? '',
    })
  }

  async updateExpense(tripId: string, id: string, input: UpdateTripExpenseInput): Promise<TripExpense> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')

    if (input.category !== undefined && !VALID_CATEGORIES.includes(input.category)) {
      throw new ValidationError(`category must be one of: ${VALID_CATEGORIES.join(', ')}`)
    }
    if (input.amount !== undefined && input.amount <= 0) {
      throw new ValidationError('amount must be a positive number')
    }
    if (input.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
      throw new ValidationError('date must be in YYYY-MM-DD format')
    }

    const expense = await this.expenseRepository.findById(id)
    if (!expense || expense.tripId !== tripId) throw new NotFoundError('TripExpense')

    const updated = await this.expenseRepository.update(id, input)
    if (!updated) throw new NotFoundError('TripExpense')
    return updated
  }

  async deleteExpense(tripId: string, id: string): Promise<void> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')
    const expense = await this.expenseRepository.findById(id)
    if (!expense || expense.tripId !== tripId) throw new NotFoundError('TripExpense')

    const deleted = await this.expenseRepository.delete(id)
    if (!deleted) throw new NotFoundError('TripExpense')
  }

  async getSummary(tripId: string): Promise<ExpenseSummary> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')
    return this.expenseRepository.getSummary(tripId)
  }
}
