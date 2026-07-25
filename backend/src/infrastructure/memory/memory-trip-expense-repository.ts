import type { CreateTripExpenseInput, ExpenseSummary, TripExpense, UpdateTripExpenseInput } from '../../domain/entities/trip-expense'
import type { TripExpenseRepository } from '../../domain/repositories/trip-expense-repository'

export class MemoryTripExpenseRepository implements TripExpenseRepository {
  private readonly expenses = new Map<string, TripExpense>()

  async findByTripId(tripId: string): Promise<TripExpense[]> {
    return [...this.expenses.values()]
      .filter((e) => e.tripId === tripId)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  async findById(id: string): Promise<TripExpense | null> {
    return this.expenses.get(id) ?? null
  }

  async create(input: CreateTripExpenseInput): Promise<TripExpense> {
    const expense: TripExpense = {
      id: crypto.randomUUID(),
      tripId: input.tripId,
      category: input.category,
      itemName: input.itemName,
      amount: input.amount,
      date: input.date,
      notes: input.notes ?? '',
      createdAt: new Date().toISOString(),
    }
    this.expenses.set(expense.id, expense)
    return expense
  }

  async update(id: string, input: UpdateTripExpenseInput): Promise<TripExpense | null> {
    const existing = this.expenses.get(id)
    if (!existing) return null
    const updated: TripExpense = {
      ...existing,
      category: input.category ?? existing.category,
      itemName: input.itemName ?? existing.itemName,
      amount: input.amount ?? existing.amount,
      date: input.date ?? existing.date,
      notes: input.notes !== undefined ? input.notes : existing.notes,
    }
    this.expenses.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.expenses.delete(id)
  }

  async getSummary(tripId: string): Promise<ExpenseSummary> {
    const items = [...this.expenses.values()].filter((e) => e.tripId === tripId)
    const byCategory: Record<string, number> = {}
    let total = 0
    for (const item of items) {
      byCategory[item.category] = (byCategory[item.category] ?? 0) + item.amount
      total += item.amount
    }
    return { total, byCategory }
  }
}
