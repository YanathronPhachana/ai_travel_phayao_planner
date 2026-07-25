import type { Accommodation, AccommodationType, CreateAccommodationInput, UpdateAccommodationInput } from '../../domain/entities/accommodation'
import type { AccommodationRepository } from '../../domain/repositories/accommodation-repository'

interface AccommodationRow {
  id: string
  trip_id: string
  name: string
  type: string
  price_per_night: number | null
  check_in: string | null
  check_out: string | null
  total_cost: number | null
  address: string
  phone: string
  notes: string
  created_at: string
}

function toAccommodation(row: AccommodationRow): Accommodation {
  return {
    id: row.id,
    tripId: row.trip_id,
    name: row.name,
    type: row.type as AccommodationType,
    pricePerNight: row.price_per_night,
    checkIn: row.check_in,
    checkOut: row.check_out,
    totalCost: row.total_cost,
    address: row.address,
    phone: row.phone,
    notes: row.notes,
    createdAt: row.created_at,
  }
}

export class D1AccommodationRepository implements AccommodationRepository {
  constructor(private readonly db: D1Database) {}

  async findByTripId(tripId: string): Promise<Accommodation[]> {
    const { results } = await this.db
      .prepare('SELECT id, trip_id, name, type, price_per_night, check_in, check_out, total_cost, address, phone, notes, created_at FROM accommodations WHERE trip_id = ? ORDER BY created_at DESC')
      .bind(tripId)
      .all<AccommodationRow>()
    return results.map(toAccommodation)
  }

  async findById(id: string): Promise<Accommodation | null> {
    const row = await this.db
      .prepare('SELECT id, trip_id, name, type, price_per_night, check_in, check_out, total_cost, address, phone, notes, created_at FROM accommodations WHERE id = ?')
      .bind(id)
      .first<AccommodationRow>()
    return row ? toAccommodation(row) : null
  }

  async create(input: CreateAccommodationInput): Promise<Accommodation> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const pricePerNight = input.pricePerNight ?? null
    const checkIn = input.checkIn ?? null
    const checkOut = input.checkOut ?? null
    const totalCost = input.totalCost ?? null
    const address = input.address ?? ''
    const phone = input.phone ?? ''
    const notes = input.notes ?? ''
    await this.db
      .prepare('INSERT INTO accommodations (id, trip_id, name, type, price_per_night, check_in, check_out, total_cost, address, phone, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, input.tripId, input.name, input.type, pricePerNight, checkIn, checkOut, totalCost, address, phone, notes, createdAt)
      .run()
    return { id, tripId: input.tripId, name: input.name, type: input.type, pricePerNight, checkIn, checkOut, totalCost, address, phone, notes, createdAt }
  }

  async update(id: string, input: UpdateAccommodationInput): Promise<Accommodation | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const name = input.name ?? existing.name
    const type = input.type ?? existing.type
    const pricePerNight = input.pricePerNight !== undefined ? input.pricePerNight : existing.pricePerNight
    const checkIn = input.checkIn !== undefined ? input.checkIn : existing.checkIn
    const checkOut = input.checkOut !== undefined ? input.checkOut : existing.checkOut
    const totalCost = input.totalCost !== undefined ? input.totalCost : existing.totalCost
    const address = input.address !== undefined ? input.address : existing.address
    const phone = input.phone !== undefined ? input.phone : existing.phone
    const notes = input.notes !== undefined ? input.notes : existing.notes
    await this.db
      .prepare('UPDATE accommodations SET name = ?, type = ?, price_per_night = ?, check_in = ?, check_out = ?, total_cost = ?, address = ?, phone = ?, notes = ? WHERE id = ?')
      .bind(name, type, pricePerNight, checkIn, checkOut, totalCost, address, phone, notes, id)
      .run()
    return { ...existing, name, type, pricePerNight, checkIn, checkOut, totalCost, address, phone, notes }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM accommodations WHERE id = ?').bind(id).run()
    return result.meta.changes > 0
  }
}
