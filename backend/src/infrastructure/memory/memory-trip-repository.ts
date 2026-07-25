import type { CreateTripInput, Trip, UpdateTripInput } from '../../domain/entities/trip'
import type { TripRepository } from '../../domain/repositories/trip-repository'

export class MemoryTripRepository implements TripRepository {
  private readonly trips = new Map<string, Trip>()

  async findAll(): Promise<Trip[]> {
    return [...this.trips.values()].sort((a, b) => b.startDate.localeCompare(a.startDate))
  }

  async findById(id: string): Promise<Trip | null> {
    return this.trips.get(id) ?? null
  }

  async create(input: CreateTripInput): Promise<Trip> {
    const trip: Trip = {
      id: crypto.randomUUID(),
      name: input.name,
      startDate: input.startDate,
      endDate: input.endDate,
      totalBudget: input.totalBudget ?? null,
      notes: input.notes ?? '',
      destinationIds: input.destinationIds ?? [],
      createdAt: new Date().toISOString(),
    }
    this.trips.set(trip.id, trip)
    return trip
  }

  async update(id: string, input: UpdateTripInput): Promise<Trip | null> {
    const existing = this.trips.get(id)
    if (!existing) return null
    const updated: Trip = {
      ...existing,
      name: input.name ?? existing.name,
      startDate: input.startDate ?? existing.startDate,
      endDate: input.endDate ?? existing.endDate,
      totalBudget: input.totalBudget !== undefined ? input.totalBudget : existing.totalBudget,
      notes: input.notes !== undefined ? input.notes : existing.notes,
      destinationIds: input.destinationIds ?? existing.destinationIds,
    }
    this.trips.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.trips.delete(id)
  }
}
