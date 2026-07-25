import type { CreateTripInput, Trip, UpdateTripInput } from '../../domain/entities/trip'
import type { TripRepository } from '../../domain/repositories/trip-repository'

interface TripRow {
  id: string
  name: string
  start_date: string
  end_date: string
  total_budget: number | null
  notes: string
  destination_ids: string
  created_at: string
}

function toTrip(row: TripRow): Trip {
  return {
    id: row.id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    totalBudget: row.total_budget,
    notes: row.notes,
    destinationIds: JSON.parse(row.destination_ids || '[]'),
    createdAt: row.created_at,
  }
}

export class D1TripRepository implements TripRepository {
  constructor(private readonly db: D1Database) {}

  async findAll(): Promise<Trip[]> {
    const { results } = await this.db
      .prepare('SELECT id, name, start_date, end_date, total_budget, notes, destination_ids, created_at FROM trips ORDER BY start_date DESC')
      .all<TripRow>()
    return results.map(toTrip)
  }

  async findById(id: string): Promise<Trip | null> {
    const row = await this.db
      .prepare('SELECT id, name, start_date, end_date, total_budget, notes, destination_ids, created_at FROM trips WHERE id = ?')
      .bind(id)
      .first<TripRow>()
    return row ? toTrip(row) : null
  }

  async create(input: CreateTripInput): Promise<Trip> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const notes = input.notes ?? ''
    const totalBudget = input.totalBudget ?? null
    const destinationIds = JSON.stringify(input.destinationIds ?? [])
    await this.db
      .prepare('INSERT INTO trips (id, name, start_date, end_date, total_budget, notes, destination_ids, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, input.name, input.startDate, input.endDate, totalBudget, notes, destinationIds, createdAt)
      .run()
    return { id, name: input.name, startDate: input.startDate, endDate: input.endDate, totalBudget, notes, destinationIds: input.destinationIds ?? [], createdAt }
  }

  async update(id: string, input: UpdateTripInput): Promise<Trip | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const name = input.name ?? existing.name
    const startDate = input.startDate ?? existing.startDate
    const endDate = input.endDate ?? existing.endDate
    const totalBudget = input.totalBudget !== undefined ? input.totalBudget : existing.totalBudget
    const notes = input.notes !== undefined ? input.notes : existing.notes
    const destinationIds = input.destinationIds !== undefined ? JSON.stringify(input.destinationIds) : JSON.stringify(existing.destinationIds)
    await this.db
      .prepare('UPDATE trips SET name = ?, start_date = ?, end_date = ?, total_budget = ?, notes = ?, destination_ids = ? WHERE id = ?')
      .bind(name, startDate, endDate, totalBudget, notes, destinationIds, id)
      .run()
    return { ...existing, name, startDate, endDate, totalBudget, notes, destinationIds: input.destinationIds ?? existing.destinationIds }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM trips WHERE id = ?').bind(id).run()
    return result.meta.changes > 0
  }
}
