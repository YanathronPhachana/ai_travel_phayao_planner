import type { Accommodation, CreateAccommodationInput, UpdateAccommodationInput } from '../../domain/entities/accommodation'
import type { AccommodationRepository } from '../../domain/repositories/accommodation-repository'

export class MemoryAccommodationRepository implements AccommodationRepository {
  private readonly accommodations = new Map<string, Accommodation>()

  async findByTripId(tripId: string): Promise<Accommodation[]> {
    return [...this.accommodations.values()]
      .filter((a) => a.tripId === tripId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async findById(id: string): Promise<Accommodation | null> {
    return this.accommodations.get(id) ?? null
  }

  async create(input: CreateAccommodationInput): Promise<Accommodation> {
    const accommodation: Accommodation = {
      id: crypto.randomUUID(),
      tripId: input.tripId,
      name: input.name,
      type: input.type,
      pricePerNight: input.pricePerNight ?? null,
      checkIn: input.checkIn ?? null,
      checkOut: input.checkOut ?? null,
      totalCost: input.totalCost ?? null,
      address: input.address ?? '',
      phone: input.phone ?? '',
      notes: input.notes ?? '',
      createdAt: new Date().toISOString(),
    }
    this.accommodations.set(accommodation.id, accommodation)
    return accommodation
  }

  async update(id: string, input: UpdateAccommodationInput): Promise<Accommodation | null> {
    const existing = this.accommodations.get(id)
    if (!existing) return null
    const updated: Accommodation = {
      ...existing,
      name: input.name ?? existing.name,
      type: input.type ?? existing.type,
      pricePerNight: input.pricePerNight !== undefined ? input.pricePerNight : existing.pricePerNight,
      checkIn: input.checkIn !== undefined ? input.checkIn : existing.checkIn,
      checkOut: input.checkOut !== undefined ? input.checkOut : existing.checkOut,
      totalCost: input.totalCost !== undefined ? input.totalCost : existing.totalCost,
      address: input.address !== undefined ? input.address : existing.address,
      phone: input.phone !== undefined ? input.phone : existing.phone,
      notes: input.notes !== undefined ? input.notes : existing.notes,
    }
    this.accommodations.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.accommodations.delete(id)
  }
}
