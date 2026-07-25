import type { CreateTripExpenseInput, ExpenseCategory, ExpenseSummary, TripExpense, UpdateTripExpenseInput } from '../../domain/entities/trip-expense'
import type { TripExpenseRepository } from '../../domain/repositories/trip-expense-repository'

interface TripExpenseRow {
  id: string
  trip_id: string
  category: string
  item_name: string
  amount: number
  date: string
  notes: string
  created_at: string
}

function toTripExpense(row: TripExpenseRow): TripExpense {
  return {
    id: row.id,
    tripId: row.trip_id,
    category: row.category as ExpenseCategory,
    itemName: row.item_name,
    amount: row.amount,
    date: row.date,
    notes: row.notes,
    createdAt: row.created_at,
  }
}

export class D1TripExpenseRepository implements TripExpenseRepository {
  constructor(private readonly db: D1Database) {}

  async findByTripId(tripId: string): Promise<TripExpense[]> {
    const { results } = await this.db
      .prepare('SELECT id, trip_id, category, item_name, amount, date, notes, created_at FROM trip_expenses WHERE trip_id = ? ORDER BY date DESC')
      .bind(tripId)
      .all<TripExpenseRow>()
    return results.map(toTripExpense)
  }

  async findById(id: string): Promise<TripExpense | null> {
    const row = await this.db
      .prepare('SELECT id, trip_id, category, item_name, amount, date, notes, created_at FROM trip_expenses WHERE id = ?')
      .bind(id)
      .first<TripExpenseRow>()
    return row ? toTripExpense(row) : null
  }

  async create(input: CreateTripExpenseInput): Promise<TripExpense> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const notes = input.notes ?? ''
    await this.db
      .prepare('INSERT INTO trip_expenses (id, trip_id, category, item_name, amount, date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, input.tripId, input.category, input.itemName, input.amount, input.date, notes, createdAt)
      .run()
    return { id, tripId: input.tripId, category: input.category, itemName: input.itemName, amount: input.amount, date: input.date, notes, createdAt }
  }

  async update(id: string, input: UpdateTripExpenseInput): Promise<TripExpense | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const category = input.category ?? existing.category
    const itemName = input.itemName ?? existing.itemName
    const amount = input.amount ?? existing.amount
    const date = input.date ?? existing.date
    const notes = input.notes !== undefined ? input.notes : existing.notes
    await this.db
      .prepare('UPDATE trip_expenses SET category = ?, item_name = ?, amount = ?, date = ?, notes = ? WHERE id = ?')
      .bind(category, itemName, amount, date, notes, id)
      .run()
    return { ...existing, category, itemName, amount, date, notes }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM trip_expenses WHERE id = ?').bind(id).run()
    return result.meta.changes > 0
  }

  async getSummary(tripId: string): Promise<ExpenseSummary> {
    const { results } = await this.db
      .prepare('SELECT category, SUM(amount) as total FROM trip_expenses WHERE trip_id = ? GROUP BY category')
      .bind(tripId)
      .all<{ category: string; total: number }>()
    const byCategory: Record<string, number> = {}
    let total = 0
    for (const row of results) {
      byCategory[row.category] = row.total
      total += row.total
    }
    return { total, byCategory }
  }
}
