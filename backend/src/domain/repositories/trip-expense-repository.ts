import type { CreateTripExpenseInput, ExpenseSummary, TripExpense, UpdateTripExpenseInput } from '../entities/trip-expense'

export interface TripExpenseRepository {
  findByTripId(tripId: string): Promise<TripExpense[]>
  findById(id: string): Promise<TripExpense | null>
  create(input: CreateTripExpenseInput): Promise<TripExpense>
  update(id: string, input: UpdateTripExpenseInput): Promise<TripExpense | null>
  delete(id: string): Promise<boolean>
  getSummary(tripId: string): Promise<ExpenseSummary>
}
