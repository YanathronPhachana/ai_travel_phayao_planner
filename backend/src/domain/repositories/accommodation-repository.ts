import type { Accommodation, CreateAccommodationInput, UpdateAccommodationInput } from '../entities/accommodation'

export interface AccommodationRepository {
  findByTripId(tripId: string): Promise<Accommodation[]>
  findById(id: string): Promise<Accommodation | null>
  create(input: CreateAccommodationInput): Promise<Accommodation>
  update(id: string, input: UpdateAccommodationInput): Promise<Accommodation | null>
  delete(id: string): Promise<boolean>
}
